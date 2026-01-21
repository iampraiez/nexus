/**
 * Environment detection utility
 */

export const isBrowser = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.navigator !== "undefined"
  );
};

export const isNode = (): boolean => {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
};

export enum Environment {
  Browser = "browser",
  Node = "node",
  Unknown = "unknown",
}

export const getEnvironment = (): Environment => {
  if (isBrowser()) return Environment.Browser;
  if (isNode()) return Environment.Node;
  return Environment.Unknown;
};
