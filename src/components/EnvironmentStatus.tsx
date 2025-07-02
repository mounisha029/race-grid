
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { config, isDevelopment } from '@/config/environment';
import { deploymentConfig, performHealthCheck } from '@/config/deployment';
import { featureFlags } from '@/utils/featureFlags';
import { cacheManager } from '@/utils/cacheManager';
import { logger } from '@/utils/logger';

const EnvironmentStatus: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    checkHealth();
    updateCacheStats();
  }, []);

  const checkHealth = async () => {
    const isHealthy = await performHealthCheck();
    setHealthStatus(isHealthy);
    logger.info('Health check completed', { isHealthy });
  };

  const updateCacheStats = () => {
    const stats = cacheManager.getStats();
    setCacheStats(stats);
  };

  const clearCache = () => {
    cacheManager.clear();
    updateCacheStats();
    logger.info('Cache cleared manually');
  };

  if (!isDevelopment) {
    return null; // Only show in development
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          Environment Status
          <Badge variant={config.NODE_ENV === 'production' ? 'default' : 'secondary'}>
            {config.NODE_ENV}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>Version:</strong> {config.APP_VERSION}
          </div>
          <div>
            <strong>Build:</strong> {deploymentConfig.BUILD_TIMESTAMP.slice(0, 10)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <strong>Health:</strong>
          {healthStatus === null ? (
            <Badge variant="outline">Checking...</Badge>
          ) : (
            <Badge variant={healthStatus ? 'default' : 'destructive'}>
              {healthStatus ? 'Healthy' : 'Unhealthy'}
            </Badge>
          )}
          <Button size="sm" variant="outline" onClick={checkHealth}>
            Check
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <strong>Cache:</strong>
          <span>{cacheStats?.size || 0} items</span>
          <Button size="sm" variant="outline" onClick={clearCache}>
            Clear
          </Button>
        </div>

        <div className="space-y-1">
          <strong>Features:</strong>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(featureFlags).map(([key, enabled]) => (
              <div key={key} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="truncate text-xs">{key.replace('ENABLE_', '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500">
            <div>Log Level: {config.LOG_LEVEL}</div>
            <div>Analytics: {config.ENABLE_ANALYTICS ? 'On' : 'Off'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentStatus;
