/**
 * Script to Add Admin User with PIN
 *
 * Usage: node scripts/add-admin.js
 *
 * This script creates an admin user with a predefined PIN (2025)
 */

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hash function matching the database function
// Note: Both passwords and PINs use the same hash function
function hashPassword(password) {
  const salt = 'admin_salt_2025';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

async function addAdminUser() {
  console.log('🚀 Starting admin user creation...\n');

  // Admin details - you can modify these
  const adminData = {
    email: 'admin@asknyumbani.com',
    password: 'Admin@2025',  // Initial password
    pin: '2025',              // 4-digit PIN
    full_name: 'Ask Nyumbani Admin',
    role: 'super_admin'       // 'admin' or 'super_admin'
  };

  console.log('Admin Details:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Email:       ${adminData.email}`);
  console.log(`🔑 Password:    ${adminData.password}`);
  console.log(`📌 PIN:         ${adminData.pin}`);
  console.log(`👤 Full Name:   ${adminData.full_name}`);
  console.log(`🎭 Role:        ${adminData.role}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Step 1: Check if admin already exists
    console.log('🔍 Checking if admin already exists...');
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', adminData.email)
      .single();

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with this email!');
      console.log('💡 Use a different email or delete the existing admin first.');
      process.exit(0);
    }

    // Step 2: Create admin user with hashed password and PIN
    console.log('✨ Creating admin user...');

    const { data: newAdmin, error: insertError } = await supabase
      .from('admin_users')
      .insert([
        {
          email: adminData.email,
          password_hash: hashPassword(adminData.password),
          pin_hash: hashPassword(adminData.pin), // PIN uses same hash function
          full_name: adminData.full_name,
          role: adminData.role,
          is_active: true,
          is_first_login: false, // Set to false since we're creating PIN directly
          failed_login_attempts: 0,
          pin_created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError.message);
      process.exit(1);
    }

    // Step 3: Log the activity
    console.log('📝 Logging admin creation activity...');

    const { error: logError } = await supabase
      .from('admin_activity_log')
      .insert([
        {
          admin_user_id: newAdmin.id,
          activity_type: 'account_created',
          description: 'Admin account created via script',
          metadata: {
            created_by: 'setup_script',
            has_pin: true
          }
        }
      ]);

    if (logError) {
      console.warn('⚠️  Warning: Could not log activity:', logError.message);
    }

    // Success!
    console.log('\n✅ SUCCESS! Admin user created successfully!\n');
    console.log('Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log(`📌 PIN:      ${adminData.pin}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Tips:');
    console.log('   • You can log in using either email/password OR just the PIN');
    console.log('   • PIN login is faster for daily use');
    console.log('   • Change your password after first login for security\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the script
addAdminUser();
