
import { config } from './environment';

interface DeploymentConfig {
  BUILD_TIMESTAMP: string;
  COMMIT_HASH?: string;
  BRANCH?: string;
  VERSION: string;
  HEALTH_CHECK_ENDPOINT: string;
  STATUS_ENDPOINT: string;
}

export const deploymentConfig: DeploymentConfig = {
  BUILD_TIMESTAMP: new Date().toISOString(),
  COMMIT_HASH: process.env.REACT_APP_COMMIT_HASH || 'unknown',
  BRANCH: process.env.REACT_APP_BRANCH || 'unknown',
  VERSION: config.APP_VERSION,
  HEALTH_CHECK_ENDPOINT: `${config.API_BASE_URL}/health`,
  STATUS_ENDPOINT: `${config.API_BASE_URL}/status`,
};

// Health check utility
export const performHealthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(deploymentConfig.HEALTH_CHECK_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
