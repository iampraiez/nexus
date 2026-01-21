/**
 * Storage factory for creating appropriate storage backend
 */

import type { IStorage } from "../types";
import { BrowserStorage } from "./BrowserStorage";
import { NodeStorage } from "./NodeStorage";
import { isBrowser } from "../core/env";

export class StorageFactory {
  static create(): IStorage {
    if (isBrowser()) {
      return new BrowserStorage();
    }

    return new NodeStorage();
  }
}
