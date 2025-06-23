
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import LiveRaceTracker from "@/components/LiveRaceTracker";

const LiveRace = () => {
  const { raceId } = useParams<{ raceId: string }>();

  if (!raceId) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Race Not Found</h1>
          <p className="text-muted-foreground">
            Please select a valid race to view live timing.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Live Race Tracking</h1>
        </div>
        
        <LiveRaceTracker raceId={raceId} />
      </div>
    </Layout>
  );
};

export default LiveRace;
