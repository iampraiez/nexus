/**
 * Node.js-based storage implementation using filesystem
 */

import type { IStorage } from "../types";

const DATA_DIR = ".nexus_cache";

export class NodeStorage implements IStorage {
  private dataPath: string | null = null;

  constructor() {
    // Initialization is deferred to methods to avoid top-level Node.js dependencies
  }

  private async getPathUtils() {
    const path = await import("path");
    return path;
  }

  private async getFsUtils() {
    const fs = await import("fs/promises");
    return fs;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.dataPath) return;
    const path = await this.getPathUtils();
    this.dataPath = path.join(process.cwd(), DATA_DIR);
    await this.ensureDirectory();
  }

  private async ensureDirectory(): Promise<void> {
    if (!this.dataPath) return;
    try {
      const fs = await this.getFsUtils();
      await fs.mkdir(this.dataPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  private async getFilePath(key: string): Promise<string> {
    await this.ensureInitialized();
    const path = await this.getPathUtils();
    // Sanitize key to be safe for filesystem
    const sanitized = key.replace(/[^a-z0-9-_]/gi, "_");
    return path.join(this.dataPath!, `${sanitized}.json`);
  }

  async get(key: string): Promise<string | null> {
    try {
      const fs = await this.getFsUtils();
      const filePath = await this.getFilePath(key);
      const content = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(content);
      return data.value ?? null;
    } catch (error) {
      // File doesn't exist or is invalid
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const fs = await this.getFsUtils();
      await this.ensureDirectory();
      const filePath = await this.getFilePath(key);
      const data = { value, timestamp: Date.now() };
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
    } catch (error) {
      throw new Error(`Failed to write to storage: ${error}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fs = await this.getFsUtils();
      const filePath = await this.getFilePath(key);
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist
    }
  }

  async clear(): Promise<void> {
    try {
      await this.ensureInitialized();
      const fs = await this.getFsUtils();
      const path = await this.getPathUtils();
      const files = await fs.readdir(this.dataPath!);
      await Promise.all(
        files.map((file) => fs.unlink(path.join(this.dataPath!, file)))
      );
    } catch (error) {
      // Directory might not exist
    }
  }
}
