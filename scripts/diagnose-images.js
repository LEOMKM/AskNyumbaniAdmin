/**
 * Diagnostic script to check why admin panel shows no images
 * while the mobile app has images
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function diagnoseImages() {
  console.log('🔍 Diagnosing Image Visibility Issue...\n')

  try {
    // 1. Check total images in property_images table
    console.log('1️⃣ Checking property_images table:')
    const { data: allImages, error: allError } = await supabase
      .from('property_images')
      .select('id, property_id, admin_approved, created_at')

    if (allError) {
      console.error('❌ Error:', allError.message)
    } else {
      console.log(`   Total images in database: ${allImages?.length || 0}`)

      const pending = allImages?.filter(img => img.admin_approved === null).length || 0
      const approved = allImages?.filter(img => img.admin_approved === true).length || 0
      const rejected = allImages?.filter(img => img.admin_approved === false).length || 0

      console.log(`   - Pending (admin_approved = NULL): ${pending}`)
      console.log(`   - Approved (admin_approved = TRUE): ${approved}`)
      console.log(`   - Rejected (admin_approved = FALSE): ${rejected}`)
    }
    console.log()

    // 2. Check pending_image_reviews view
    console.log('2️⃣ Checking pending_image_reviews view:')
    const { data: pendingView, error: pendingError } = await supabase
      .from('pending_image_reviews')
      .select('*')

    if (pendingError) {
      console.error('❌ Error:', pendingError.message)
      console.log('   ⚠️  This view might not exist or has permission issues')
    } else {
      console.log(`   ✅ Found ${pendingView?.length || 0} pending images in view`)
    }
    console.log()

    // 3. Check image_review_history view
    console.log('3️⃣ Checking image_review_history view:')
    const { data: historyView, error: historyError } = await supabase
      .from('image_review_history')
      .select('*')

    if (historyError) {
      console.error('❌ Error:', historyError.message)
      console.log('   ⚠️  This view might not exist or has permission issues')
    } else {
      console.log(`   ✅ Found ${historyView?.length || 0} reviewed images in view`)
    }
    console.log()

    // 4. Sample image data
    console.log('4️⃣ Sample image data:')
    if (allImages && allImages.length > 0) {
      const sample = allImages[0]
      console.log('   First image:')
      console.log(`   - ID: ${sample.id}`)
      console.log(`   - Property ID: ${sample.property_id}`)
      console.log(`   - Admin Approved: ${sample.admin_approved}`)
      console.log(`   - Created At: ${sample.created_at}`)
    }
    console.log()

    // 5. Check if views exist
    console.log('5️⃣ Checking database views/tables:')
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_list')
      .catch(() => ({ data: null, error: 'Function not available' }))

    console.log('   Checking manually for views...')

    // Try to query each view
    const viewChecks = [
      { name: 'pending_image_reviews', query: supabase.from('pending_image_reviews').select('id').limit(1) },
      { name: 'image_review_history', query: supabase.from('image_review_history').select('id').limit(1) },
      { name: 'property_images', query: supabase.from('property_images').select('id').limit(1) }
    ]

    for (const check of viewChecks) {
      const { error } = await check.query
      if (error) {
        console.log(`   ❌ ${check.name}: NOT ACCESSIBLE (${error.message})`)
      } else {
        console.log(`   ✅ ${check.name}: EXISTS`)
      }
    }
    console.log()

    // 6. Recommendations
    console.log('📋 DIAGNOSIS SUMMARY:')
    console.log('=' .repeat(60))

    if (!allImages || allImages.length === 0) {
      console.log('❌ No images found in property_images table')
      console.log('   → Images uploaded in app are not reaching the database')
      console.log('   → Check mobile app upload logic and Supabase Storage')
    } else if (pendingError || historyError) {
      console.log('⚠️  Images exist but views are not accessible')
      console.log('   → The admin panel uses database views that may not exist')
      console.log('   → Run the SQL migration to create the views')
      console.log('   → File: supabase/migrations/create_image_review_views.sql')
    } else if (pendingView?.length === 0 && historyView?.length === 0) {
      console.log('⚠️  Views exist but return no data')
      console.log('   → Check if images have admin_approved field set correctly')
      console.log('   → Images might need to be NULL for pending reviews')
    } else {
      console.log('✅ Everything looks good!')
      console.log(`   → ${pendingView?.length || 0} images ready for review`)
      console.log(`   → ${historyView?.length || 0} images already reviewed`)
    }

    console.log('=' .repeat(60))

  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

diagnoseImages()
