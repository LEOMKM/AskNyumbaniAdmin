/**
 * Upload test properties with images to verify the complete flow
 * This simulates what the mobile app does when uploading properties
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Sample image URL (placeholder)
const SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'

async function uploadTestData() {
  console.log('🚀 Starting test data upload...\n')

  try {
    // Step 1: Get or create a test user
    console.log('1️⃣ Setting up test user...')

    // Try to sign up a test user (will fail if exists, that's ok)
    const testEmail = 'testuser@asknyumbani.com'
    const testPassword = 'Test123456!'

    let userId

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (signInData?.user) {
      userId = signInData.user.id
      console.log(`   ✅ Signed in as existing user: ${testEmail}`)
    } else {
      // Sign up new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      })

      if (signUpError) {
        console.error('   ❌ Failed to create user:', signUpError.message)

        // Try to get existing user
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', testEmail)
          .single()

        if (userData) {
          userId = userData.id
          console.log('   ℹ️  Using existing user from database')
        } else {
          throw new Error('Cannot create or find test user')
        }
      } else {
        userId = signUpData.user?.id
        console.log(`   ✅ Created new user: ${testEmail}`)
      }
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    console.log(`   User ID: ${userId}\n`)

    // Step 2: Create test properties
    console.log('2️⃣ Creating test properties...')

    const properties = [
      {
        owner_id: userId,
        title: 'Modern 3BR Apartment in Westlands',
        description: 'Beautiful modern apartment with stunning city views. Features include spacious living room, modern kitchen, and secure parking.',
        property_type: 'APARTMENT',
        deal_type: 'RENT',
        price: 85000,
        price_period: 'MONTH',
        bedrooms: 3,
        bathrooms: 2,
        kitchen_areas: 1,
        square_meters: 120,
        address: 'Westlands Road',
        city: 'Nairobi',
        region: 'Nairobi',
        county: 'Nairobi',
        latitude: -1.2674,
        longitude: 36.8070,
        status: 'AVAILABLE'
      },
      {
        owner_id: userId,
        title: 'Luxurious 4BR Villa in Karen',
        description: 'Exclusive villa in the heart of Karen. Perfect for families. Includes swimming pool and beautiful garden.',
        property_type: 'VILLA',
        deal_type: 'SALE',
        price: 45000000,
        bedrooms: 4,
        bathrooms: 3,
        kitchen_areas: 2,
        square_meters: 350,
        address: 'Karen Road',
        city: 'Nairobi',
        region: 'Nairobi',
        county: 'Nairobi',
        latitude: -1.3197,
        longitude: 36.7076,
        status: 'AVAILABLE'
      },
      {
        owner_id: userId,
        title: 'Cozy Studio in Kilimani',
        description: 'Perfect for young professionals. Fully furnished with modern amenities. Close to shopping centers and public transport.',
        property_type: 'STUDIO',
        deal_type: 'RENT',
        price: 35000,
        price_period: 'MONTH',
        bedrooms: 1,
        bathrooms: 1,
        kitchen_areas: 1,
        square_meters: 45,
        address: 'Kindaruma Road',
        city: 'Nairobi',
        region: 'Nairobi',
        county: 'Nairobi',
        latitude: -1.2921,
        longitude: 36.7856,
        status: 'AVAILABLE'
      }
    ]

    const createdProperties = []

    for (const property of properties) {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single()

      if (error) {
        console.error(`   ❌ Failed to create property "${property.title}":`, error.message)
      } else {
        console.log(`   ✅ Created: ${data.title}`)
        createdProperties.push(data)
      }
    }

    console.log(`\n   Total properties created: ${createdProperties.length}\n`)

    // Step 3: Add images to properties
    console.log('3️⃣ Adding images to properties...')

    const imageData = []

    for (let i = 0; i < createdProperties.length; i++) {
      const property = createdProperties[i]
      const numImages = Math.floor(Math.random() * 3) + 2 // 2-4 images per property

      console.log(`   Property: ${property.title}`)

      for (let j = 0; j < numImages; j++) {
        const image = {
          property_id: property.id,
          image_url: `${SAMPLE_IMAGE_URL}&sig=${i}-${j}`, // Unique URL
          thumbnail_url: `${SAMPLE_IMAGE_URL}&w=200&sig=${i}-${j}`,
          is_primary: j === 0, // First image is primary
          display_order: j,
          admin_approved: null, // Pending review
          caption: `Image ${j + 1} for ${property.title}`
        }

        const { data, error } = await supabase
          .from('property_images')
          .insert(image)
          .select()
          .single()

        if (error) {
          console.error(`     ❌ Failed to add image ${j + 1}:`, error.message)
        } else {
          console.log(`     ✅ Added image ${j + 1} (${data.admin_approved === null ? 'PENDING' : 'status unknown'})`)
          imageData.push(data)
        }
      }

      console.log()
    }

    console.log(`   Total images created: ${imageData.length}\n`)

    // Step 4: Summary
    console.log('=' .repeat(60))
    console.log('✅ TEST DATA UPLOAD COMPLETE')
    console.log('=' .repeat(60))
    console.log(`📊 Summary:`)
    console.log(`   - Properties created: ${createdProperties.length}`)
    console.log(`   - Images created: ${imageData.length}`)
    console.log(`   - All images status: PENDING (admin_approved = NULL)`)
    console.log()
    console.log(`🔍 Next steps:`)
    console.log(`   1. Refresh admin panel at: http://localhost:3000`)
    console.log(`   2. Navigate to "Image Reviews"`)
    console.log(`   3. You should see ${imageData.length} pending images`)
    console.log(`   4. Approve or reject images to test the workflow`)
    console.log()
    console.log(`📱 Mobile App:`)
    console.log(`   - Login with: ${testEmail}`)
    console.log(`   - Password: ${testPassword}`)
    console.log(`   - You should see ${createdProperties.length} properties with pending badges`)
    console.log('=' .repeat(60))

  } catch (error) {
    console.error('\n💥 Error:', error.message)
    console.error(error)
  }
}

// Run the script
uploadTestData()
