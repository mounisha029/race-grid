
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import TeamProfileHeader from "@/components/team-profile/TeamProfileHeader";
import TeamStatsGrid from "@/components/team-profile/TeamStatsGrid";
import TeamCarSpecs from "@/components/team-profile/TeamCarSpecs";
import TeamPerformanceCharts from "@/components/team-profile/TeamPerformanceCharts";
import TeamDriverLineup from "@/components/team-profile/TeamDriverLineup";
import TeamGallery from "@/components/team-profile/TeamGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeams } from "@/hooks/useApi";

const TeamProfile = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: teamsData, isLoading } = useTeams();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-2 border-f1-red border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const team = (teamsData as any)?.teams?.find((t: any) => t.id === teamId);

  if (!team) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Team Not Found</h1>
          <p className="text-muted-foreground">
            The requested team profile could not be found.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <TeamProfileHeader team={team} />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="car">Car Specs</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TeamStatsGrid team={team} />
            <TeamPerformanceCharts team={team} />
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            <TeamDriverLineup team={team} />
          </TabsContent>

          <TabsContent value="car" className="space-y-6">
            <TeamCarSpecs team={team} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <TeamPerformanceCharts team={team} detailed />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <TeamGallery team={team} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TeamProfile;
