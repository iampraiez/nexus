import { isBrowser } from "./env";

/**
 * Security module for HMAC-SHA256 signing
 */

/**
 * Generate HMAC-SHA256 signature for request validation
 */
export class SecurityManager {
  /**
   * Create HMAC-SHA256 signature for events
   */
  static async createSignature(
    data: string,
    secret: string
  ): Promise<string> {
    // Browser environment
    if (isBrowser()) {
      return this.createSignatureBrowser(data, secret);
    }

    // Node.js environment
    return this.createSignatureNode(data, secret);
  }

  /**
   * Browser implementation using SubtleCrypto
   */
  private static async createSignatureBrowser(
    data: string,
    secret: string
  ): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Node.js implementation using crypto module
   */
  private static async createSignatureNode(
    data: string,
    secret: string
  ): Promise<string> {
    // Dynamic import to avoid bundling issues in browser
    const crypto = await import("crypto");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    return hmac.digest("hex");
  }

  /**
   * Validate API key format
   */
  static validateApiKey(apiKey: string): boolean {
    return typeof apiKey === "string" && apiKey.length > 0;
  }

  /**
   * Validate project ID format
   */
  static validateProjectId(projectId: string): boolean {
    return typeof projectId === "string" && projectId.length > 0;
  }
}
