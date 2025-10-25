/**
 * Test Approval and Rejection Functions
 *
 * This script tests if the approve and reject functions work correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n🧪 TESTING APPROVAL & REJECTION FUNCTIONS');
console.log('═══════════════════════════════════════════════════════════\n');

async function testApprovalRejection() {
  try {
    // Step 1: Get admin user ID
    console.log('📝 Step 1: Getting admin user ID...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', 'admin@asknyumbani.com')
      .single();

    if (adminError || !adminUsers) {
      console.log('❌ Failed to get admin user:', adminError?.message);
      return;
    }

    const adminUserId = adminUsers.id;
    console.log(`✅ Admin User ID: ${adminUserId}\n`);

    // Step 2: Check if approve function exists
    console.log('📝 Step 2: Testing approve_property_image function...');

    // Get a pending image
    const { data: pendingImages, error: pendingError } = await supabase
      .from('property_images')
      .select('id, image_url')
      .is('admin_approved', null)
      .limit(1);

    if (pendingError) {
      console.log('❌ Error fetching pending images:', pendingError.message);
      return;
    }

    if (!pendingImages || pendingImages.length === 0) {
      console.log('⚠️  No pending images found to test with');
      console.log('   Upload some images in the mobile app first\n');
    } else {
      const testImageId = pendingImages[0].id;
      console.log(`Found test image: ${testImageId}`);

      // Test approve function signature
      console.log('\n🔍 Testing approve_property_image function signature...');
      const { data: approveResult, error: approveError } = await supabase.rpc(
        'approve_property_image',
        {
          p_image_id: testImageId,
          p_admin_user_id: adminUserId
        }
      );

      if (approveError) {
        console.log('❌ Approve function error:', approveError.message);
        console.log('   Code:', approveError.code);
        console.log('   Details:', approveError.details);
        console.log('   Hint:', approveError.hint);
      } else {
        console.log('✅ Approve function works!');
        console.log('   Result:', approveResult);

        // Verify the image was approved
        const { data: approvedImage } = await supabase
          .from('property_images')
          .select('admin_approved, admin_reviewed_by')
          .eq('id', testImageId)
          .single();

        console.log('   Image approved:', approvedImage?.admin_approved);
        console.log('   Reviewed by:', approvedImage?.admin_reviewed_by);
      }
    }

    // Step 3: Test reject function
    console.log('\n📝 Step 3: Testing reject_property_image function...');

    const { data: moreImages, error: moreError } = await supabase
      .from('property_images')
      .select('id, image_url')
      .is('admin_approved', null)
      .limit(1);

    if (moreError) {
      console.log('❌ Error:', moreError.message);
    } else if (!moreImages || moreImages.length === 0) {
      console.log('⚠️  No more pending images to test rejection');
    } else {
      const rejectImageId = moreImages[0].id;
      console.log(`Testing with image: ${rejectImageId}`);

      const { data: rejectResult, error: rejectError } = await supabase.rpc(
        'reject_property_image',
        {
          p_image_id: rejectImageId,
          p_admin_user_id: adminUserId,
          p_rejection_reason: 'Test rejection - checking if function works'
        }
      );

      if (rejectError) {
        console.log('❌ Reject function error:', rejectError.message);
        console.log('   Code:', rejectError.code);
        console.log('   Details:', rejectError.details);
        console.log('   Hint:', rejectError.hint);
      } else {
        console.log('✅ Reject function works!');
        console.log('   Result:', rejectResult);

        // Verify the image was deleted
        const { data: deletedImage } = await supabase
          .from('property_images')
          .select('id')
          .eq('id', rejectImageId)
          .single();

        console.log('   Image deleted:', deletedImage === null);
      }
    }

    // Step 4: Check function signatures
    console.log('\n📝 Step 4: Checking function signatures in database...');
    const { data: functions, error: funcError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          p.proname as function_name,
          pg_get_function_arguments(p.oid) as arguments
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN ('approve_property_image', 'reject_property_image')
        ORDER BY p.proname;
      `
    });

    if (!funcError && functions) {
      console.log('Function signatures:');
      functions.forEach(f => {
        console.log(`  ${f.function_name}(${f.arguments})`);
      });
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

testApprovalRejection();
