import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react';
          if (id.includes('@sqds')) return 'squads';
          if (id.includes('@solana/wallet-adapter')) return 'wallet-adapter';
          if (id.includes('@solana/web3.js')) return 'solana-web3';
          if (id.includes('@noble') || id.includes('bn.js') || id.includes('borsh')) return 'crypto-vendor';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'util'],
      globals: {
        Buffer: true,
      },
    }),
  ],
});
