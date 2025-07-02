
import { config, isDevelopment, isStaging, isProduction } from '@/config/environment';

interface FeatureFlags {
  ENABLE_EXPERIMENTAL_FEATURES: boolean;
  ENABLE_DEBUG_PANEL: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  ENABLE_ERROR_BOUNDARY: boolean;
  ENABLE_WEBSOCKET_LIVE_DATA: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_A_B_TESTING: boolean;
}

const createFeatureFlags = (): FeatureFlags => {
  return {
    ENABLE_EXPERIMENTAL_FEATURES: isDevelopment || isStaging,
    ENABLE_DEBUG_PANEL: isDevelopment,
    ENABLE_PERFORMANCE_MONITORING: isProduction || isStaging,
    ENABLE_ERROR_BOUNDARY: true,
    ENABLE_WEBSOCKET_LIVE_DATA: true,
    ENABLE_PUSH_NOTIFICATIONS: isProduction,
    ENABLE_ANALYTICS: config.ENABLE_ANALYTICS,
    ENABLE_A_B_TESTING: isProduction,
  };
};

export const featureFlags = createFeatureFlags();

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature];
};
