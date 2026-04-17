import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

console.log('🔍 Testing Cloudinary Connection...\n');

console.log('Configuration:');
console.log(`  Cloud Name: ${process.env.CLOUDINARY_NAME}`);
console.log(`  API Key: ${process.env.CLOUDINARY_API_KEY}`);
console.log(`  API Secret: ${process.env.CLOUDINARY_SECRET_KEY}\n`);

// Try to ping Cloudinary
try {
    const result = await cloudinary.api.resources_by_tag('test', { max_results: 1 });
    console.log('✅ Cloudinary Connection: SUCCESS');
    console.log('📊 Account Status:', {
        total_files: result.total_count || 0,
        resources: result.resources ? result.resources.length : 0
    });
} catch (error) {
    console.error('❌ Cloudinary Connection: FAILED');
    console.error('Error:', error.message);
    console.error('Status:', error.http_code);
    console.error('Full Error:', error);
}
