import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME); // Check if the variables are loaded

import cloudinary from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch images from the "Festivals" Cloudinary folder and save as JSON
const getCloudinaryImages = async (folder) => {
  try {
    // Cloudinary API request
    const result = await cloudinary.v2.api.resources({
      type: 'upload',
      prefix: 'Home',  // Specify the folder name
      max_results: 500, // Adjust based on your needs
      // Next cursor for pagination if there are more results
      next_cursor: undefined,
    });

    // Log the Cloudinary API Response to inspect the result
    console.log('Cloudinary API Response:', result);

    if (!result.resources || result.resources.length === 0) {
      console.log(`No images found in the folder "${folder}".`);
      return;
    }

    // Map through the resources to get required image details
    const imageData = result.resources.map((resource) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
    }));

    // Save the data to a JSON file
    fs.writeFileSync(`cloudinary-images-${folder}.json`, JSON.stringify(imageData, null, 2));

    console.log(`JSON file created for folder: ${folder}`);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

// Call the function with the "Festivals" folder name
getCloudinaryImages('Home');
