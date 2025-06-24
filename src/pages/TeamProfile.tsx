
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TeamProfileHeader from "@/components/team-profile/TeamProfileHeader";
import TeamStats from "@/components/team-profile/TeamStats";
import TeamDrivers from "@/components/team-profile/TeamDrivers";
import TeamCarSpecs from "@/components/team-profile/TeamCarSpecs";
import TeamPerformanceCharts from "@/components/team-profile/TeamPerformanceCharts";
import TeamHistory from "@/components/team-profile/TeamHistory";
import { Skeleton } from "@/components/ui/skeleton";

const TeamProfile = () => {
  const { id } = useParams();

  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          drivers (
            id,
            first_name,
            last_name,
            driver_number,
            points,
            position,
            profile_image_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Team not found</h1>
          <p className="text-muted-foreground">The requested team profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TeamProfileHeader team={team} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TeamStats team={team} />
            <TeamPerformanceCharts teamId={team.id} />
            <TeamHistory team={team} />
          </div>
          
          <div className="space-y-8">
            <TeamDrivers team={team} />
            <TeamCarSpecs team={team} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
