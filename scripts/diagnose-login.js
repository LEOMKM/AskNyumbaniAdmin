/**
 * COMPREHENSIVE LOGIN DIAGNOSTIC SCRIPT
 *
 * This script checks EVERYTHING to find out why login isn't working
 *
 * Usage: node scripts/diagnose-login.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 COMPREHENSIVE LOGIN DIAGNOSTICS');
console.log('═══════════════════════════════════════════════════════════\n');

// Test 1: Check Environment Variables
console.log('📋 Test 1: Environment Variables');
console.log('─────────────────────────────────────────────────────────');
console.log(`Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`Supabase Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
if (supabaseUrl) console.log(`URL Value: ${supabaseUrl}`);
if (supabaseKey) console.log(`Key Value: ${supabaseKey.substring(0, 20)}...`);
console.log();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ FATAL: Missing environment variables!');
  console.log('\nCheck your .env.local file has:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
  let issuesFound = [];

  // Test 2: Check Database Connection
  console.log('🔌 Test 2: Database Connection');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
      issuesFound.push('Cannot connect to database');
    } else {
      console.log('✅ PASS: Database connection works');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('Database connection error');
  }
  console.log();

  // Test 3: Check if admin_users table exists
  console.log('🗄️  Test 3: Check admin_users Table');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
      issuesFound.push('admin_users table does not exist or no access');
    } else {
      console.log('✅ PASS: admin_users table exists and is accessible');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('Cannot access admin_users table');
  }
  console.log();

  // Test 4: Check if admin user exists
  console.log('👤 Test 4: Check Admin User Exists');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, full_name, role, is_active, pin_hash')
      .eq('email', 'admin@asknyumbani.com')
      .single();

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
      issuesFound.push('Admin user does not exist');
      console.log('\n⚠️  YOU NEED TO RUN THE MIGRATION SCRIPT!');
      console.log('   Go to: https://supabase.com/dashboard/project/yqilhwaexdehmrcdblgz/sql');
      console.log('   Run: scripts/MINIMAL-FIX.sql\n');
    } else {
      console.log('✅ PASS: Admin user exists');
      console.log(`   Email: ${data.email}`);
      console.log(`   Name: ${data.full_name}`);
      console.log(`   Role: ${data.role}`);
      console.log(`   Active: ${data.is_active}`);
      console.log(`   PIN Set: ${data.pin_hash ? 'Yes ✓' : 'No ✗'}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('Cannot query admin user');
  }
  console.log();

  // Test 5: Check if admin_login function exists
  console.log('⚙️  Test 5: Check admin_login Function');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase.rpc('admin_login', {
      p_email: 'test@test.com',
      p_password: 'test'
    });

    // We expect an error (invalid credentials) but NOT a "function doesn't exist" error
    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('❌ FAILED: admin_login function does not exist');
        issuesFound.push('admin_login function missing - THIS IS YOUR MAIN PROBLEM!');
        console.log('\n⚠️  THE admin_login FUNCTION IS MISSING!');
        console.log('   This is why you get 400 Bad Request!');
        console.log('\n   FIX: Run scripts/MINIMAL-FIX.sql in Supabase SQL Editor');
        console.log('   URL: https://supabase.com/dashboard/project/yqilhwaexdehmrcdblgz/sql\n');
      } else if (error.message.includes('Invalid email or password')) {
        console.log('✅ PASS: admin_login function exists and works');
        console.log('   (Got expected "invalid credentials" error)');
      } else {
        console.log(`⚠️  Function exists but error: ${error.message}`);
      }
    } else {
      console.log('⚠️  Unexpected: Test credentials worked (should fail)');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('Error testing admin_login function');
  }
  console.log();

  // Test 6: Check if admin_login_with_pin function exists
  console.log('📌 Test 6: Check admin_login_with_pin Function');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase.rpc('admin_login_with_pin', {
      p_pin: '0000'
    });

    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('❌ FAILED: admin_login_with_pin function does not exist');
        issuesFound.push('admin_login_with_pin function missing');
      } else if (error.message.includes('Invalid PIN')) {
        console.log('✅ PASS: admin_login_with_pin function exists');
        console.log('   (Got expected "invalid PIN" error)');
      } else {
        console.log(`⚠️  Function exists but error: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('Error testing admin_login_with_pin function');
  }
  console.log();

  // Test 7: Try actual login with correct credentials
  console.log('🔑 Test 7: Actual Login Test');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase.rpc('admin_login', {
      p_email: 'admin@asknyumbani.com',
      p_password: 'Admin@2025'
    });

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
      issuesFound.push(`Login failed: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log('✅ PASS: Login successful!');
      console.log(`   Admin ID: ${data[0].admin_user_id}`);
      console.log(`   Email: ${data[0].email}`);
      console.log(`   Session Token: ${data[0].session_token.substring(0, 20)}...`);
      console.log('\n   🎉 YOUR LOGIN WORKS! Try it in the browser!');
    } else {
      console.log('❌ FAILED: No data returned');
      issuesFound.push('Login returned no data');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('Login test error');
  }
  console.log();

  // Test 8: Try PIN login
  console.log('📍 Test 8: PIN Login Test');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const { data, error } = await supabase.rpc('admin_login_with_pin', {
      p_pin: '2025'
    });

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
      issuesFound.push(`PIN login failed: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log('✅ PASS: PIN login successful!');
      console.log(`   Admin ID: ${data[0].admin_user_id}`);
      console.log(`   Email: ${data[0].email}`);
      console.log('\n   🎉 YOUR PIN LOGIN WORKS! Try PIN 2025 in browser!');
    } else {
      console.log('❌ FAILED: No data returned');
      issuesFound.push('PIN login returned no data');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    issuesFound.push('PIN login test error');
  }
  console.log();

  // Final Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (issuesFound.length === 0) {
    console.log('🎉 NO ISSUES FOUND! Everything works!');
    console.log('\n✨ Your login should work in the browser now.');
    console.log('\nLogin Credentials:');
    console.log('   Email: admin@asknyumbani.com');
    console.log('   Password: Admin@2025');
    console.log('   PIN: 2025');
    console.log('\nGo to: http://localhost:3000/login');
  } else {
    console.log(`⚠️  FOUND ${issuesFound.length} ISSUE(S):\n`);
    issuesFound.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🔧 HOW TO FIX:');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (issuesFound.some(i => i.includes('admin_login function missing'))) {
      console.log('⚡ MAIN ISSUE: admin_login function does not exist\n');
      console.log('FIX THIS NOW:');
      console.log('1. Open: https://supabase.com/dashboard/project/yqilhwaexdehmrcdblgz/sql');
      console.log('2. Click "New Query"');
      console.log('3. Copy ALL content from: scripts/MINIMAL-FIX.sql');
      console.log('4. Paste and click "Run"');
      console.log('5. Wait for success message');
      console.log('6. Run this diagnostic script again\n');
    }

    if (issuesFound.some(i => i.includes('Admin user does not exist'))) {
      console.log('⚡ Admin user needs to be created\n');
      console.log('   The MINIMAL-FIX.sql script will create it.');
    }

    if (issuesFound.some(i => i.includes('Cannot connect to database'))) {
      console.log('⚡ Database connection issue\n');
      console.log('   Check your .env.local file has correct credentials');
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

runDiagnostics().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
