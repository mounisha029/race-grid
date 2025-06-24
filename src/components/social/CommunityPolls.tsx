
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  total_votes: number;
  ends_at: string;
  created_by: string;
  race_id?: string;
  created_at: string;
}

interface UserProfile {
  display_name: string;
}

interface PollWithProfile extends Poll {
  user_profiles: UserProfile | null;
}

interface CommunityPollsProps {
  raceId?: string;
}

const CommunityPolls = ({ raceId }: CommunityPollsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<PollWithProfile[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
    if (user) {
      fetchUserVotes();
    }
  }, [raceId, user]);

  const fetchPolls = async () => {
    try {
      let query = supabase
        .from('community_polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (raceId) {
        query = query.eq('race_id', raceId);
      }

      const { data: pollsData, error } = await query;
      if (error) throw error;

      // Fetch user profiles for each poll
      const pollsWithProfiles = await Promise.all(
        (pollsData || []).map(async (poll) => {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('display_name')
            .eq('user_id', poll.created_by)
            .single();

          return {
            ...poll,
            user_profiles: profileData
          };
        })
      );
      
      setPolls(pollsWithProfiles);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('poll_votes')
        .select('poll_id, selected_option')
        .eq('user_id', user.id);

      if (error) throw error;

      const votes = data?.reduce((acc, vote) => {
        acc[vote.poll_id] = vote.selected_option;
        return acc;
      }, {} as Record<string, string>) || {};

      setUserVotes(votes);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const createPoll = async () => {
    if (!user || !newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_polls')
        .insert({
          question: newPoll.question.trim(),
          options: newPoll.options.filter(opt => opt.trim()),
          votes: {},
          total_votes: 0,
          ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: user.id,
          race_id: raceId
        });

      if (error) throw error;

      setNewPoll({ question: '', options: ['', ''] });
      setShowCreatePoll(false);
      fetchPolls();
      
      toast({
        title: "Success",
        description: "Poll created successfully",
      });
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: "Error",
        description: "Failed to create poll",
        variant: "destructive",
      });
    }
  };

  const vote = async (pollId: string, option: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user.id,
          selected_option: option
        });

      if (error) throw error;

      setUserVotes({ ...userVotes, [pollId]: option });
      fetchPolls();
      
      toast({
        title: "Success",
        description: "Vote recorded",
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive",
      });
    }
  };

  const addOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Community Polls & Predictions
              </CardTitle>
              <CardDescription>
                Vote on race predictions and community polls
              </CardDescription>
            </div>
            
            {user && (
              <Button
                onClick={() => setShowCreatePoll(!showCreatePoll)}
                variant="outline"
              >
                {showCreatePoll ? "Cancel" : "Create Poll"}
              </Button>
            )}
          </div>
        </CardHeader>
        
        {showCreatePoll && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                placeholder="What's your prediction for this race?"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options</Label>
              {newPoll.options.map((option, index) => (
                <Input
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
              ))}
              <Button variant="outline" size="sm" onClick={addOption}>
                Add Option
              </Button>
            </div>
            
            <Button onClick={createPoll}>Create Poll</Button>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-f1-red"></div>
          </div>
        ) : polls.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No polls yet. Create the first one!</p>
            </CardContent>
          </Card>
        ) : (
          polls.map((poll) => (
            <Card key={poll.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{poll.question}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {poll.total_votes} votes
                  </Badge>
                </div>
                <CardDescription>
                  Created by {poll.user_profiles?.display_name || 'Anonymous'} • 
                  Ends {new Date(poll.ends_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {poll.options.map((option, index) => {
                  const votes = poll.votes[option] || 0;
                  const percentage = poll.total_votes > 0 ? (votes / poll.total_votes) * 100 : 0;
                  const hasVoted = userVotes[poll.id];
                  const isSelected = hasVoted === option;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => vote(poll.id, option)}
                          disabled={!!hasVoted}
                          className="flex-1 justify-start"
                        >
                          {option}
                        </Button>
                        <span className="text-sm text-muted-foreground ml-4">
                          {votes} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      
                      {hasVoted && (
                        <Progress value={percentage} className="h-2" />
                      )}
                    </div>
                  );
                })}
                
                {userVotes[poll.id] && (
                  <div className="pt-2 text-sm text-muted-foreground">
                    ✓ You voted for: {userVotes[poll.id]}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityPolls;
