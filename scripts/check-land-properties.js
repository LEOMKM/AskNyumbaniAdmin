const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yqilhwaexdehmrcdblgz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaWxod2FleGRlaG1yY2RibGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODk3MDAsImV4cCI6MjA3NTY2NTcwMH0.aZhWBpB1EfckSU82hEi_c5tKptjcCMChDETCPjAVESs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkLandProperties() {
  console.log('🔍 Checking for land properties...\n')

  // Check all land properties
  const { data: landProperties, error: landError } = await supabase
    .from('properties')
    .select('id, title, property_type, created_at, land_details')
    .eq('property_type', 'land')

  if (landError) {
    console.error('❌ Error fetching land properties:', landError)
    return
  }

  console.log(`📊 Total land properties: ${landProperties?.length || 0}\n`)

  if (!landProperties || landProperties.length === 0) {
    console.log('⚠️  No land properties found in database')
    return
  }

  // Check each land property for images
  for (const property of landProperties) {
    console.log(`\n📍 Property: ${property.title}`)
    console.log(`   ID: ${property.id}`)
    console.log(`   Type: ${property.property_type}`)
    console.log(`   Created: ${property.created_at}`)
    console.log(`   Land Details: ${property.land_details ? JSON.stringify(property.land_details) : 'NULL'}`)

    // Check for images
    const { data: images, error: imgError } = await supabase
      .from('property_images')
      .select('id, admin_approved, created_at')
      .eq('property_id', property.id)

    if (imgError) {
      console.error(`   ❌ Error fetching images: ${imgError.message}`)
    } else {
      console.log(`   🖼️  Images: ${images?.length || 0}`)
      if (images && images.length > 0) {
        images.forEach(img => {
          const status = img.admin_approved === null ? 'PENDING' : img.admin_approved ? 'APPROVED' : 'REJECTED'
          console.log(`      - Image ${img.id}: ${status}`)
        })
      }
    }
  }

  // Check properties with pending images
  console.log('\n\n🔍 Checking properties with pending images (admin query)...\n')

  const { data: pendingData, error: pendingError } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      property_type,
      property_images!inner(id, admin_approved)
    `)
    .is('property_images.admin_approved', null)

  if (pendingError) {
    console.error('❌ Error:', pendingError)
  } else {
    console.log(`📊 Properties with pending images: ${pendingData?.length || 0}`)

    // Count by property type
    const typeCounts = {}
    pendingData?.forEach(p => {
      typeCounts[p.property_type] = (typeCounts[p.property_type] || 0) + 1
    })

    console.log('\nBy property type:')
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })
  }
}

checkLandProperties()
  .then(() => {
    console.log('\n✅ Check complete')
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ Fatal error:', err)
    process.exit(1)
  })
