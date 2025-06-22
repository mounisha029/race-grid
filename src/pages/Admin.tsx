
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataSyncPanel from "@/components/DataSyncPanel";
import { Database, Activity, Settings, BarChart3 } from "lucide-react";

const Admin = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold racing-text">F1 Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage data synchronization, live timing, and system configuration
        </p>
      </div>

      <Tabs defaultValue="sync" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sync" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Data Sync</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Live Timing</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sync" className="space-y-6">
          <DataSyncPanel />
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Live Timing Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Live timing functionality will be available here. This includes:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                <li>Real-time race data monitoring</li>
                <li>Live session management</li>
                <li>Timing data validation</li>
                <li>WebSocket connection status</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>System Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics and monitoring dashboard will be available here. This includes:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                <li>API usage statistics</li>
                <li>Data sync performance metrics</li>
                <li>Cache hit/miss ratios</li>
                <li>Error tracking and reporting</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                System configuration options will be available here. This includes:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                <li>API endpoint configuration</li>
                <li>Sync schedule settings</li>
                <li>Cache configuration</li>
                <li>Notification preferences</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
