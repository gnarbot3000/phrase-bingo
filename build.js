const fs = require('fs');
const path = require('path');

// Define paths
const distDir = path.join(__dirname, 'dist');
const filesToCopy = ['index.html', 'style.css', 'script.js', 'env-config.js'];

// Function to copy files and handle errors
const copyFile = (src, dest) => {
  try {
    if (!fs.existsSync(src)) {
      throw new Error(`Source file ${src} does not exist`);
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error.message);
    process.exit(1);
  }
};

// Function to perform environment variable substitution
const substituteEnvVars = (content) => {
  const envVars = {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || ''
  };

  // Log all environment variables for debugging
  console.log("Environment variables available during build:");
  Object.keys(envVars).forEach(key => {
    console.log(`${key}: ${envVars[key] || 'undefined'}`);
  });

  // Check for missing critical environment variables
  const criticalVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_API_KEY', 'FIREBASE_APP_ID'];
  const missingCriticalVars = criticalVars.filter(key => !envVars[key]);
  if (missingCriticalVars.length > 0) {
    throw new Error(`Critical environment variables are missing or empty: ${missingCriticalVars.join(', ')}`);
  }

  // Log non-critical missing variables as a warning
  const nonCriticalVars = Object.keys(envVars).filter(key => !criticalVars.includes(key));
  const missingNonCriticalVars = nonCriticalVars.filter(key => !envVars[key]);
  if (missingNonCriticalVars.length > 0) {
    console.warn(`Warning: The following non-critical environment variables are missing or empty: ${missingNonCriticalVars.join(', ')}`);
  }

  // Substitute environment variables
  let updatedContent = content;
  for (const [key, value] of Object.entries(envVars)) {
    const placeholder = `\${${key}}`;
    console.log(`Replacing placeholder ${placeholder} with value: ${value}`);
    updatedContent = updatedContent.replace(new RegExp(placeholder.replace(/\$/g, '\\$'), 'g'), value);
  }

  // Log the final content for debugging
  console.log("Updated env-config.js content after substitution:");
  console.log(updatedContent);

  return updatedContent;
};

// Main build process
try {
  // Step 1: Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log(`Created dist directory: ${distDir}`);
  } else {
    console.log(`Dist directory already exists: ${distDir}`);
  }

  // Step 2: Copy static files to dist
  filesToCopy.forEach(file => {
    if (file !== 'env-config.js') { // Handle env-config.js separately
      copyFile(file, path.join(distDir, file));
    }
  });

  // Step 3: Process env-config.js with environment variable substitution
  if (!fs.existsSync('env-config.js')) {
    throw new Error('env-config.js does not exist in the project root');
  }

  const envConfigContent = fs.readFileSync('env-config.js', 'utf8');
  const updatedEnvConfig = substituteEnvVars(envConfigContent);
  
  // Write the updated env-config.js to dist
  fs.writeFileSync(path.join(distDir, 'env-config.js'), updatedEnvConfig);
  console.log('Processed and copied env-config.js with environment variables');

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}