import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Creates the OG image file from the logo with proper dimensions
async function createOGImage() {
  try {
    // Check if ImageMagick is installed
    try {
      execSync('magick -version', { stdio: 'ignore' });
      console.log('ImageMagick is installed, creating OG image...');
    } catch (error) {
      console.error('ImageMagick is not installed. Please install it to generate OG images.');
      console.error('You can download it from: https://imagemagick.org/script/download.php');
      return;
    }

    const publicDir = path.resolve('./public');
    const logoPath = path.join(publicDir, 'logo.png');
    const ogImagePath = path.join(publicDir, 'og-image.png');
    const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');

    // Check if logo exists
    try {
      await fs.access(logoPath);
    } catch (error) {
      console.error('Logo file not found. Please add a logo.png file in the public directory.');
      return;
    }

    // Create OG image (1200x630 is the recommended size for most platforms)
    execSync(`magick ${logoPath} -background "#1a1625" -gravity center -extent 1200x630 ${ogImagePath}`);
    console.log(`Created OG image at ${ogImagePath}`);

    // Create Apple Touch Icon (180x180)
    execSync(`magick ${logoPath} -background "#1a1625" -gravity center -extent 180x180 ${appleTouchIconPath}`);
    console.log(`Created Apple Touch Icon at ${appleTouchIconPath}`);

    console.log('OG images created successfully!');
  } catch (error) {
    console.error('Error creating OG images:', error);
  }
}

createOGImage();
