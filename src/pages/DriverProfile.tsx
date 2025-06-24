
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DriverProfileHeader from "@/components/driver-profile/DriverProfileHeader";
import DriverStats from "@/components/driver-profile/DriverStats";
import DriverCareerHistory from "@/components/driver-profile/DriverCareerHistory";
import DriverPerformanceCharts from "@/components/driver-profile/DriverPerformanceCharts";
import DriverComparison from "@/components/driver-profile/DriverComparison";
import DriverGallery from "@/components/driver-profile/DriverGallery";
import { Skeleton } from "@/components/ui/skeleton";

const DriverProfile = () => {
  const { id } = useParams();

  const { data: driver, isLoading, error } = useQuery({
    queryKey: ['driver', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          teams (
            name,
            primary_color,
            secondary_color,
            logo_url
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

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Driver not found</h1>
          <p className="text-muted-foreground">The requested driver profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DriverProfileHeader driver={driver} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DriverStats driver={driver} />
            <DriverPerformanceCharts driverId={driver.id} />
            <DriverCareerHistory driver={driver} />
          </div>
          
          <div className="space-y-8">
            <DriverComparison currentDriver={driver} />
            <DriverGallery driver={driver} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
