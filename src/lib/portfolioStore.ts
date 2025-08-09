import { promises as fs } from 'fs';
import { join } from 'path';

// File-based persistence for portfolios when Supabase is not available
const PORTFOLIO_FILE = join(process.cwd(), '.portfolio-cache.json');

async function loadPortfoliosFromFile(): Promise<Map<string, any>> {
  try {
    const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
    const portfolios = JSON.parse(data);
    return new Map(Object.entries(portfolios));
  } catch (error) {
    // File doesn't exist or is corrupted, start with empty map
    return new Map();
  }
}

async function savePortfoliosToFile(portfolios: Map<string, any>): Promise<void> {
  try {
    const data = Object.fromEntries(portfolios.entries());
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(PORTFOLIO_FILE, jsonData, 'utf8');
    console.log('Portfolios saved to file successfully');
  } catch (error) {
    console.error('Failed to save portfolios to file:', error);
  }
}

// Shared in-memory portfolio store for fallback when Supabase is not configured
// Using global to persist across module reloads in development + file backup
declare global {
  var __portfolioStore: Map<string, any> | undefined;
  var __portfolioStoreInitialized: boolean | undefined;
}

let portfolioStore: Map<string, any>;

// Initialize store with file data if available
if (!globalThis.__portfolioStoreInitialized) {
  portfolioStore = globalThis.__portfolioStore ?? new Map<string, any>();
  
  // Try to load from file on first initialization
  loadPortfoliosFromFile().then(fileData => {
    if (fileData.size > 0) {
      console.log(`Loaded ${fileData.size} portfolios from file:`, Array.from(fileData.keys()));
      fileData.forEach((value, key) => portfolioStore.set(key, value));
    }
  }).catch(err => {
    console.log('No portfolio file to load from:', err.message);
  });
  
  globalThis.__portfolioStore = portfolioStore;
  globalThis.__portfolioStoreInitialized = true;
} else {
  portfolioStore = globalThis.__portfolioStore!;
}

export { portfolioStore };

// Helper functions for consistent store access
export function getFromStore(username: string) {
  const key = username.toLowerCase();
  const profile = portfolioStore.get(key);
  console.log(`Retrieving profile for "${key}":`, {
    found: !!profile,
    hasConvertedResume: !!profile?.convertedResume,
    hasPortfolioData: !!profile?.portfolioData,
    storeKeys: Array.from(portfolioStore.keys())
  });
  return profile;
}

export function setInStore(username: string, profile: any) {
  const key = username.toLowerCase();
  portfolioStore.set(key, profile);
  console.log(`Portfolio stored for "${key}". Store now has ${portfolioStore.size} entries:`, Array.from(portfolioStore.keys()));
  console.log(`Stored profile data:`, {
    hasConvertedResume: !!profile?.convertedResume,
    hasPortfolioData: !!profile?.portfolioData,
    roleKey: profile?.roleKey,
    username: profile?.username
  });
  
  // Also save to file for persistence (async, don't wait)
  setTimeout(() => {
    savePortfoliosToFile(portfolioStore).catch(err => {
      console.error('Failed to persist portfolio to file:', err);
    });
  }, 100);
}

export function removeFromStore(username: string) {
  return portfolioStore.delete(username.toLowerCase());
}

export function getAllFromStore() {
  return Array.from(portfolioStore.values());
}

export function getStoreSize() {
  return portfolioStore.size;
}

export function getStoreKeys() {
  return Array.from(portfolioStore.keys());
}
