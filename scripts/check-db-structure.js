/**
 * Check Database Structure for Properties and Images
 *
 * Usage: node scripts/check-db-structure.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n🔍 CHECKING DATABASE STRUCTURE\n');
console.log('═══════════════════════════════════════════════════════════\n');

async function checkDatabase() {
  // Check properties table
  console.log('📊 Checking properties table...');
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('*')
    .limit(1);

  if (propError) {
    console.log(`❌ Error: ${propError.message}\n`);
  } else {
    console.log('✅ Properties table exists');
    if (properties && properties.length > 0) {
      console.log('   Sample property structure:');
      console.log('   ', JSON.stringify(Object.keys(properties[0]), null, 2));
    }
    console.log();
  }

  // Check property_images table
  console.log('🖼️  Checking property_images table...');
  const { data: images, error: imgError } = await supabase
    .from('property_images')
    .select('*')
    .limit(1);

  if (imgError) {
    console.log(`❌ Error: ${imgError.message}\n`);
  } else {
    console.log('✅ Property images table exists');
    if (images && images.length > 0) {
      console.log('   Sample image structure:');
      console.log('   ', JSON.stringify(Object.keys(images[0]), null, 2));
    }
    console.log();
  }

  // Try to get properties with their images
  console.log('🔗 Checking relationship between properties and images...');
  const { data: propsWithImages, error: joinError } = await supabase
    .from('properties')
    .select(`
      *,
      property_images(*)
    `)
    .limit(2);

  if (joinError) {
    console.log(`❌ Error: ${joinError.message}\n`);
  } else {
    console.log('✅ Successfully joined properties with images');
    console.log(`   Found ${propsWithImages?.length || 0} properties`);
    if (propsWithImages && propsWithImages.length > 0) {
      console.log(`   First property has ${propsWithImages[0].property_images?.length || 0} images`);
    }
    console.log();
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

checkDatabase().catch(console.error);
