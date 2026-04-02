import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.impactmanagement.id',
  appName: 'ImpactManagement',
  webDir: 'public/build', 
  server: {
    // Untuk development — Android emulator akses localhost Laravel
    url: 'http://10.0.2.2:8000',
    cleartext: true
  }
};

export default config;
