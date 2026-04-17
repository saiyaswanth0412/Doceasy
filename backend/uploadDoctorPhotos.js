import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Unsplash API - Free tier (50 requests/hour)
const UNSPLASH_ACCESS_KEY = 'your_unsplash_key_here'; // Get from https://unsplash.com/developers

// Cloudinary config from env
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;

// Doctor specialties to search
const doctorSearches = [
  'professional doctor portrait male',
  'professional doctor portrait female',
  'doctor in white coat',
  'female physician',
  'male physician',
  'medical professional',
  'confident doctor',
  'healthcare professional'
];

/**
 * Fetch random doctor photo from Unsplash
 */
async function fetchDoctorPhotoUrl(query) {
  try {
    // Using Unsplash Source API (no key needed)
    // This returns a random photo from search results
    const imageUrl = `https://source.unsplash.com/500x500/?${query}`;
    console.log(`✓ Fetched image from Unsplash: ${query}`);
    return imageUrl;
  } catch (error) {
    console.error(`Error fetching from Unsplash: ${error.message}`);
    return null;
  }
}

/**
 * Upload image URL to Cloudinary
 */
async function uploadToCloudinary(imageUrl, publicId) {
  try {
    const form = new FormData();
    form.append('file', imageUrl);
    form.append('public_id', publicId);
    form.append('upload_preset', 'unsigned_preset'); // Or use signature-based upload
    form.append('api_key', CLOUDINARY_API_KEY);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      form,
      { headers: form.getHeaders() }
    );

    console.log(`✓ Uploaded to Cloudinary: ${response.data.secure_url}`);
    return response.data.secure_url;
  } catch (error) {
    console.error(`Error uploading to Cloudinary: ${error.message}`);
    // Fallback: return direct Unsplash URL if upload fails
    return imageUrl;
  }
}

/**
 * Simpler approach: Generate Cloudinary URLs directly from Unsplash
 */
function generateCloudinaryUnsplashUrl(unsplashUrl) {
  // Transform Unsplash URL to Cloudinary fetch URL
  return `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/fetch/w_500,h_500,c_fill,q_auto/${encodeURIComponent(unsplashUrl)}`;
}

/**
 * Get 6 diverse doctor photos
 */
async function generateDoctorPhotos() {
  console.log('📸 Generating diverse doctor photos...\n');

  const queries = [
    'doctor professional male portrait',
    'doctor professional female portrait',
    'female physician white coat',
    'male physician white coat',
    'doctor with stethoscope',
    'healthcare professional'
  ];

  const photos = [];

  for (const query of queries) {
    try {
      const unsplashUrl = `https://source.unsplash.com/500x500/?${query}`;
      const cloudinaryUrl = generateCloudinaryUnsplashUrl(unsplashUrl);
      photos.push(cloudinaryUrl);
      console.log(`✓ ${query}: ${cloudinaryUrl}`);
    } catch (error) {
      console.error(`✗ Error with query "${query}": ${error.message}`);
    }
  }

  return photos;
}

/**
 * Update seedDoctors.js with new photo URLs
 */
async function updateSeedFile() {
  try {
    console.log('\n🔄 Generating doctor photos...\n');

    const photos = await generateDoctorPhotos();

    if (photos.length === 0) {
      console.error('❌ No photos generated');
      return;
    }

    console.log(`\n✅ Generated ${photos.length} doctor photos\n`);
    console.log('📝 Photo URLs:');
    photos.forEach((url, i) => console.log(`${i + 1}. ${url}`));

    // Read current seedDoctors.js
    const seedPath = path.join(__dirname, 'seedDoctors.js');
    let seedContent = fs.readFileSync(seedPath, 'utf-8');

    // Replace image URLs in order
    const imageFields = seedContent.match(/image:\s*['"`](.*?)['"`]/g);

    if (imageFields && imageFields.length >= photos.length) {
      photos.forEach((photoUrl, index) => {
        // Find and replace each image field
        seedContent = seedContent.replace(
          imageFields[index],
          `image: '${photoUrl}'`
        );
      });

      fs.writeFileSync(seedPath, seedContent);
      console.log('\n✅ seedDoctors.js updated with new photo URLs!');
    } else {
      console.log('\n⚠️  Could not match all image fields in seedDoctors.js');
      console.log('\nManually add these URLs to seedDoctors.js:');
      photos.forEach((url, i) => console.log(`${i + 1}. ${url}`));
    }
  } catch (error) {
    console.error('Error updating seed file:', error);
  }
}

// Run the script
updateSeedFile();
