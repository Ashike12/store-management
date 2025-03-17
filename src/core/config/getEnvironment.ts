export function getEnvironment() {
  try {
    const environment = process.env;
    return environment;
  } catch {
    const environment = import.meta.env;
    return environment;
  }
}
