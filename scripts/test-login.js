/**
 * Test Login Script
 *
 * This script tests both login methods:
 * 1. Email/Password login
 * 2. PIN login
 *
 * Usage: node scripts/test-login.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test credentials
const TEST_EMAIL = 'admin@asknyumbani.com';
const TEST_PASSWORD = 'Admin@2025';
const TEST_PIN = '2025';

console.log('\n🧪 TESTING ADMIN LOGIN SYSTEM');
console.log('═══════════════════════════════════════════════\n');

async function testEmailPasswordLogin() {
  console.log('📧 Test 1: Email/Password Login');
  console.log('─────────────────────────────────────────────');
  console.log(`   Email:    ${TEST_EMAIL}`);
  console.log(`   Password: ${TEST_PASSWORD}\n`);

  try {
    const { data, error } = await supabase.rpc('admin_login', {
      p_email: TEST_EMAIL,
      p_password: TEST_PASSWORD
    });

    if (error) {
      console.error('   ❌ FAILED:', error.message);
      console.error('   Details:', error);
      return false;
    }

    if (data && data.length > 0) {
      const user = data[0];
      console.log('   ✅ SUCCESS! Login working perfectly!');
      console.log('   ─────────────────────────────────────────');
      console.log(`   Admin ID:       ${user.admin_user_id}`);
      console.log(`   Email:          ${user.email}`);
      console.log(`   Full Name:      ${user.full_name}`);
      console.log(`   Role:           ${user.role}`);
      console.log(`   Is Active:      ${user.is_active}`);
      console.log(`   First Login:    ${user.is_first_login}`);
      console.log(`   Session Token:  ${user.session_token.substring(0, 20)}...`);
      console.log('   ─────────────────────────────────────────\n');
      return true;
    } else {
      console.error('   ❌ FAILED: No data returned\n');
      return false;
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message);
    return false;
  }
}

async function testPinLogin() {
  console.log('📌 Test 2: PIN Login');
  console.log('─────────────────────────────────────────────');
  console.log(`   PIN: ${TEST_PIN}\n`);

  try {
    const { data, error } = await supabase.rpc('admin_login_with_pin', {
      p_pin: TEST_PIN
    });

    if (error) {
      console.error('   ❌ FAILED:', error.message);
      console.error('   Details:', error);
      return false;
    }

    if (data && data.length > 0) {
      const user = data[0];
      console.log('   ✅ SUCCESS! PIN login working perfectly!');
      console.log('   ─────────────────────────────────────────');
      console.log(`   Admin ID:       ${user.admin_user_id}`);
      console.log(`   Email:          ${user.email}`);
      console.log(`   Full Name:      ${user.full_name}`);
      console.log(`   Role:           ${user.role}`);
      console.log(`   Session Token:  ${user.session_token.substring(0, 20)}...`);
      console.log('   ─────────────────────────────────────────\n');
      return true;
    } else {
      console.error('   ❌ FAILED: No data returned\n');
      return false;
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message);
    return false;
  }
}

async function testInvalidCredentials() {
  console.log('🔒 Test 3: Invalid Credentials (Security Check)');
  console.log('─────────────────────────────────────────────');

  try {
    const { data, error } = await supabase.rpc('admin_login', {
      p_email: TEST_EMAIL,
      p_password: 'WrongPassword123'
    });

    if (error) {
      console.log('   ✅ PASS: Invalid credentials properly rejected');
      console.log(`   Error Message: "${error.message}"\n`);
      return true;
    } else {
      console.error('   ❌ FAIL: Invalid credentials were accepted!\n');
      return false;
    }
  } catch (error) {
    console.log('   ✅ PASS: Invalid credentials properly rejected\n');
    return true;
  }
}

async function checkAdminUser() {
  console.log('👤 Test 4: Verify Admin User in Database');
  console.log('─────────────────────────────────────────────');

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, full_name, role, is_active, pin_hash, created_at')
      .eq('email', TEST_EMAIL)
      .single();

    if (error) {
      console.error('   ❌ FAILED:', error.message);
      return false;
    }

    if (data) {
      console.log('   ✅ Admin user exists in database');
      console.log('   ─────────────────────────────────────────');
      console.log(`   Email:      ${data.email}`);
      console.log(`   Full Name:  ${data.full_name}`);
      console.log(`   Role:       ${data.role}`);
      console.log(`   Is Active:  ${data.is_active}`);
      console.log(`   PIN Set:    ${data.pin_hash ? 'Yes ✓' : 'No ✗'}`);
      console.log(`   Created:    ${new Date(data.created_at).toLocaleString()}`);
      console.log('   ─────────────────────────────────────────\n');
      return true;
    } else {
      console.error('   ❌ FAILED: Admin user not found in database\n');
      return false;
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message);
    return false;
  }
}

async function runAllTests() {
  const results = {
    userExists: false,
    emailLogin: false,
    pinLogin: false,
    security: false
  };

  // Test 4: Check if admin user exists
  results.userExists = await checkAdminUser();

  if (!results.userExists) {
    console.log('\n⚠️  WARNING: Admin user does not exist!');
    console.log('Please run the migration script first:\n');
    console.log('   1. Go to Supabase SQL Editor');
    console.log('   2. Run: scripts/run-all-migrations.sql\n');
    return;
  }

  // Test 1: Email/Password login
  results.emailLogin = await testEmailPasswordLogin();

  // Test 2: PIN login
  results.pinLogin = await testPinLogin();

  // Test 3: Security check
  results.security = await testInvalidCredentials();

  // Summary
  console.log('═══════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════\n');

  const tests = [
    { name: 'Admin User Exists', passed: results.userExists },
    { name: 'Email/Password Login', passed: results.emailLogin },
    { name: 'PIN Login', passed: results.pinLogin },
    { name: 'Security (Invalid Creds)', passed: results.security }
  ];

  tests.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status}  ${test.name}`);
  });

  const allPassed = Object.values(results).every(r => r === true);

  console.log('\n═══════════════════════════════════════════════');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Login system is working!');
    console.log('\n💡 You can now login with:');
    console.log(`   • Quick PIN: ${TEST_PIN}`);
    console.log(`   • Email: ${TEST_EMAIL}`);
    console.log(`   • Password: ${TEST_PASSWORD}`);
  } else {
    console.log('⚠️  SOME TESTS FAILED!');
    console.log('\n🔧 Troubleshooting:');
    if (!results.userExists) {
      console.log('   • Run the migration: scripts/run-all-migrations.sql');
    }
    if (!results.emailLogin || !results.pinLogin) {
      console.log('   • Check that admin_login functions exist');
      console.log('   • Verify Supabase permissions are set');
    }
  }
  console.log('═══════════════════════════════════════════════\n');
}

// Run all tests
runAllTests().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
