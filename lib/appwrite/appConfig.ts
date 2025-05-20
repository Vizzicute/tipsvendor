import { appwriteConfig, databases } from "./config";
import { ID, Query } from "appwrite";

// Define the settings types
export interface AppSettings {
  id: string;
  category: 'email' | 'site' | 'security' | 'notifications' | 'subscriptions' | 'social' | 'wallet';
  settings: Record<string, any>;
  $updatedAt: string;
}

// Settings categories and their default values
export const DEFAULT_SETTINGS: Record<string, any> = {
  email: {
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
  },
  site: {
    siteName: "TipsVendor",
    siteUrl: "https://tipsvendor.com",
    siteDescription: "Your trusted source for sports predictions",
    maintenanceMode: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    notificationSound: true,
  },
  subscriptions: {
    defaultSubscriptionType: "basic",
    subscriptionPrice: 30,
    trialPeriod: 7,
    gracePeriod: 3,
  },
  social: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    supportEmail: "",
    infoEmail: "",
    advertEmail: "",
  },
  wallet: {
    minimumDeposit: 1000,
    maximumDeposit: 1000000,
    minimumWithdrawal: 2000,
    maximumWithdrawal: 500000,
    withdrawalFee: 100,
    depositFee: 0,
    processingTime: "24 hours",
    supportedCurrencies: ["NGN"],
    bankAccounts: [
      {
        bankName: "Access Bank",
        accountNumber: "1234567890",
        accountName: "TipsVendor",
      }
    ],
    paymentMethods: ["bank_transfer", "card"],
    maintenanceMode: false,
    paystack: {
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
    },
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      swiftCode: "",
      routingNumber: "",
    },
    usdBankAccount: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      swiftCode: "",
      routingNumber: "",
    },
    mobileMoney: {
      provider: "",
      accountName: "",
      accountNumber: "",
      apiKey: "",
      apiSecret: "",
    },
    crypto: {
      bitcoin: {
        address: "",
        network: "Bitcoin",
      },
      ethereum: {
        address: "",
        network: "Ethereum",
      },
      usdt: {
        address: "",
        network: "TRC20",
      },
    },
  },
};

// Cache for settings
let settingsCache: Record<string, AppSettings> = {};
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize settings if they don't exist
export async function initializeSettings() {
  try {
    for (const [category, defaultSettings] of Object.entries(DEFAULT_SETTINGS)) {
      const existingSettings = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.settingsId,
        [Query.equal("category", category)]
      );

      if (existingSettings.documents.length === 0) {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.settingsId,
          ID.unique(),
          {
            category,
            settings: JSON.stringify(defaultSettings),
          }
        );
      }
    }
  } catch (error) {
    console.error("Error initializing settings:", error);
  }
}

// Get all settings
export async function getAllSettings(): Promise<Record<string, AppSettings>> {
  const now = Date.now();
  
  // Return cached settings if they're still valid
  if (now - lastFetchTime < CACHE_DURATION && Object.keys(settingsCache).length > 0) {
    return settingsCache;
  }

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.settingsId
    );

    const settings: Record<string, AppSettings> = {};
    response.documents.forEach((doc: any) => {
      settings[doc.category] = {
        id: doc.$id,
        category: doc.category,
        settings: JSON.parse(doc.settings),
        $updatedAt: doc.$updatedAt,
      };
    });

    // Update cache
    settingsCache = settings;
    lastFetchTime = now;

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

// Get settings by category
export async function getSettingsByCategory(category: string): Promise<AppSettings | null> {
  try {
    const allSettings = await getAllSettings();
    return allSettings[category] || null;
  } catch (error) {
    console.error(`Error fetching ${category} settings:`, error);
    return null;
  }
}

// Update settings
export async function updateSettings(category: string, newSettings: Record<string, any>): Promise<boolean> {
  try {
    const currentSettings = await getSettingsByCategory(category);
    
    if (!currentSettings) {
      // Create new settings if they don't exist
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.settingsId,
        ID.unique(),
        {
          category,
          settings: JSON.stringify(newSettings),
        }
      );
    } else {
      // Update existing settings
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.settingsId,
        currentSettings.id,
        {
          settings: JSON.stringify(newSettings),
        }
      );
    }

    // Clear cache
    settingsCache = {};
    lastFetchTime = 0;

    return true;
  } catch (error) {
    console.error(`Error updating ${category} settings:`, error);
    return false;
  }
}

// Helper functions for specific settings
export async function getEmailSettings() {
  const settings = await getSettingsByCategory('email');
  return settings?.settings || DEFAULT_SETTINGS.email;
}

export async function getSiteSettings() {
  const settings = await getSettingsByCategory('site');
  return settings?.settings || DEFAULT_SETTINGS.site;
}

export async function getSecuritySettings() {
  const settings = await getSettingsByCategory('security');
  return settings?.settings || DEFAULT_SETTINGS.security;
}

export async function getNotificationSettings() {
  const settings = await getSettingsByCategory('notifications');
  return settings?.settings || DEFAULT_SETTINGS.notifications;
}

export async function getSubscriptionSettings() {
  const settings = await getSettingsByCategory('subscriptions');
  return settings?.settings || DEFAULT_SETTINGS.subscriptions;
}

export async function getSocialSettings() {
  const settings = await getSettingsByCategory('social');
  return settings?.settings || DEFAULT_SETTINGS.social;
}

// Add wallet settings helper function
export async function getWalletSettings() {
  const settings = await getSettingsByCategory('wallet');
  return settings?.settings || DEFAULT_SETTINGS.wallet;
} 