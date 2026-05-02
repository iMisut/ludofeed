import dotenv from 'dotenv';

dotenv.config();

export const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',
  cache_expiry_days: parseInt(process.env.CACHE_EXPIRY_DAYS || '30', 10),
  feed_check_interval_minutes: parseInt(process.env.FEED_CHECK_INTERVAL_MINUTES || '30', 10),
};

export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
