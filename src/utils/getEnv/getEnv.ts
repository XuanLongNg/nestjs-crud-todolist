export function getEnv(env: string) {
  const value = process.env[env];
  if (value) {
    return value;
  }
  throw new Error(`Could not find environment variable: ` + env);
}
