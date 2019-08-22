import dotenv from 'dotenv';

dotenv.config();

export function get(variable: string) {
  return process.env[variable];
}

export function isDev() {
  return get('NODE_ENV') !== 'production';
}

export function isProd() {
  return !isDev();
}
