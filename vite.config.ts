// @ts-nocheck
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Asset Copier Plugin to automatically copy images from brain folders
const assetCopier = () => {
  return {
    name: 'asset-copier',
    buildStart() {
      const publicDir = path.resolve(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }

      const copyJobs = [
        { src: 'C:\\Users\\pavan\\.gemini\\antigravity-ide\\brain\\e74391a2-d404-40b7-8e1a-8b6b002c7dc6\\github_banner_1783868542636.png', dst: 'github_banner.png' },
        { src: 'C:\\Users\\pavan\\.gemini\\antigravity-ide\\brain\\2e30d2a9-fe34-4e0b-8592-cbe0acb40a9f\\media__1783871515876.png', dst: 'luffy_walk.png' },
        { src: 'C:\\Users\\pavan\\.gemini\\antigravity-ide\\brain\\2e30d2a9-fe34-4e0b-8592-cbe0acb40a9f\\media__1783871515692.png', dst: 'luffy_wave.png' },
        { src: 'C:\\Users\\pavan\\.gemini\\antigravity-ide\\brain\\2e30d2a9-fe34-4e0b-8592-cbe0acb40a9f\\media__1783871515863.png', dst: 'luffy_laugh.png' }
      ];

      copyJobs.forEach(({ src, dst }) => {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, path.join(publicDir, dst));
            fs.copyFileSync(src, path.join(process.cwd(), dst)); // Copy to root too
            console.log(`[Asset Copier] Synced ${dst}`);
          } catch (e) {
            console.error(`[Asset Copier] Failed to sync ${dst}:`, e);
          }
        } else {
          console.warn(`[Asset Copier] Source not found: ${src}`);
        }
      });

      // Also sync root documents to public
      const docs = ['README.md', 'Pavan-Datta-Gedila1.pdf', 'pavan Profile.pdf', 'pavan datta.pdf'];
      docs.forEach(doc => {
        const srcPath = path.resolve(process.cwd(), doc);
        if (fs.existsSync(srcPath)) {
          try {
            fs.copyFileSync(srcPath, path.join(publicDir, doc));
          } catch (e) {
            console.error(`[Asset Copier] Failed to copy doc ${doc}:`, e);
          }
        }
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/g.pavn-datta/',
  plugins: [react(), assetCopier()],
  server: {
    port: 3000,
    open: true
  }
});
