#!/usr/bin/env node

import { build } from 'vite';
import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function buildExtension() {
  console.log('🚀 Building Chrome Extension...');
  
  try {
    // Build the app
    await build();
    console.log('✅ App built successfully');
    
    // Copy extension manifest to dist folder
    await copyFile('manifest.json', 'dist/manifest.json');
    console.log('✅ Extension manifest copied');
    
    // Copy icons for extension
    await mkdir('dist/icons', { recursive: true });
    await copyFile('icons/icon16.png', 'dist/icons/icon16.png');
    await copyFile('icons/icon32.png', 'dist/icons/icon32.png');
    await copyFile('icons/icon48.png', 'dist/icons/icon48.png');
    await copyFile('icons/icon128.png', 'dist/icons/icon128.png');
    console.log('✅ Extension icons copied');
    
    // Copy background script for extension
    await copyFile('background.js', 'dist/background.js');
    console.log('✅ Background script copied');
    
    // Update manifest.json paths for built extension
    const manifestPath = join(process.cwd(), 'dist', 'manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    
    // Update icon paths to point to built assets
    manifest.action.default_icon = {
      "16": "favicon.svg",
      "32": "favicon.svg", 
      "48": "favicon.svg",
      "128": "favicon.svg"
    };
    manifest.icons = {
      "16": "favicon.svg",
      "32": "favicon.svg",
      "48": "favicon.svg", 
      "128": "favicon.svg"
    };
    
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Extension manifest updated with correct paths');
    
    console.log('\n🎉 Chrome Extension built successfully!');
    console.log('📁 Extension files are in the "dist" folder');
    console.log('🔧 To install:');
    console.log('   1. Open chrome://extensions/');
    console.log('   2. Enable Developer mode');
    console.log('   3. Click "Load unpacked"');
    console.log('   4. Select the "dist" folder');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Import fs promises for file operations
import { readFile, writeFile } from 'fs/promises';

buildExtension();
