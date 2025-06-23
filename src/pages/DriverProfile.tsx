
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import DriverProfileHeader from "@/components/driver-profile/DriverProfileHeader";
import DriverStatsGrid from "@/components/driver-profile/DriverStatsGrid";
import DriverCareerHistory from "@/components/driver-profile/DriverCareerHistory";
import DriverPerformanceCharts from "@/components/driver-profile/DriverPerformanceCharts";
import DriverComparisons from "@/components/driver-profile/DriverComparisons";
import DriverGallery from "@/components/driver-profile/DriverGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDrivers } from "@/hooks/useApi";

const DriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const { data: driversData, isLoading } = useDrivers();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-2 border-f1-red border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const driver = driversData?.drivers?.find((d: any) => d.id === driverId);

  if (!driver) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Driver Not Found</h1>
          <p className="text-muted-foreground">
            The requested driver profile could not be found.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <DriverProfileHeader driver={driver} />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DriverStatsGrid driver={driver} />
            <DriverPerformanceCharts driver={driver} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <DriverPerformanceCharts driver={driver} detailed />
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <DriverCareerHistory driver={driver} />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <DriverComparisons driver={driver} />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <DriverGallery driver={driver} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DriverProfile;
