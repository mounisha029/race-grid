
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'staging' | 'production';
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  API_BASE_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_ANALYTICS: boolean;
  CACHE_TTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    VERY_LONG: number;
  };
}

const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'staging';
  } else {
    return 'production';
  }
};

const createEnvironmentConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  
  const baseConfig = {
    NODE_ENV: env,
    APP_NAME: 'F1 Insights',
    APP_VERSION: '1.0.0',
  };

  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        SUPABASE_URL: "https://wcgrdwsndxjkpfgcnbhx.supabase.co",
        SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ3Jkd3NuZHhqa3BmZ2NuYmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU3NDEsImV4cCI6MjA2NjE4MTc0MX0.EDNbLn1UdVAx85xv6Lh0TKGTgZX4vnzp4a-zt9qS3XM",
        API_BASE_URL: "https://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1",
        LOG_LEVEL: 'debug' as const,
        ENABLE_ANALYTICS: false,
        CACHE_TTL: {
          SHORT: 30 * 1000, // 30 seconds
          MEDIUM: 5 * 60 * 1000, // 5 minutes
          LONG: 30 * 60 * 1000, // 30 minutes
          VERY_LONG: 2 * 60 * 60 * 1000, // 2 hours
        },
      };

    case 'staging':
      return {
        ...baseConfig,
        SUPABASE_URL: "https://wcgrdwsndxjkpfgcnbhx.supabase.co",
        SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ3Jkd3NuZHhqa3BmZ2NuYmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU3NDEsImV4cCI6MjA2NjE4MTc0MX0.EDNbLn1UdVAx85xv6Lh0TKGTgZX4vnzp4a-zt9qS3XM",
        API_BASE_URL: "https://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1",
        LOG_LEVEL: 'info' as const,
        ENABLE_ANALYTICS: true,
        CACHE_TTL: {
          SHORT: 1 * 60 * 1000, // 1 minute
          MEDIUM: 10 * 60 * 1000, // 10 minutes
          LONG: 60 * 60 * 1000, // 1 hour
          VERY_LONG: 4 * 60 * 60 * 1000, // 4 hours
        },
      };

    case 'production':
      return {
        ...baseConfig,
        SUPABASE_URL: "https://wcgrdwsndxjkpfgcnbhx.supabase.co",
        SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ3Jkd3NuZHhqa3BmZ2NuYmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU3NDEsImV4cCI6MjA2NjE4MTc0MX0.EDNbLn1UdVAx85xv6Lh0TKGTgZX4vnzp4a-zt9qS3XM",
        API_BASE_URL: "https://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1",
        LOG_LEVEL: 'warn' as const,
        ENABLE_ANALYTICS: true,
        CACHE_TTL: {
          SHORT: 2 * 60 * 1000, // 2 minutes
          MEDIUM: 15 * 60 * 1000, // 15 minutes
          LONG: 2 * 60 * 60 * 1000, // 2 hours
          VERY_LONG: 8 * 60 * 60 * 1000, // 8 hours
        },
      };

    default:
      throw new Error(`Unknown environment: ${env}`);
  }
};

export const config = createEnvironmentConfig();
export const isDevelopment = config.NODE_ENV === 'development';
export const isStaging = config.NODE_ENV === 'staging';
export const isProduction = config.NODE_ENV === 'production';
