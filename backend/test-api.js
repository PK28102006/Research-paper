// Quick API Test Script
// Run with: node test-api.js

const API_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Research Paper Portal API\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Check...');
    const healthRes = await fetch(API_URL);
    const healthData = await healthRes.json();
    console.log('✅ Health Check:', healthData.message);

    // Test 2: Login
    console.log('\n2️⃣ Testing Login...');
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@journal.com',
        password: 'admin'
      })
    });
    const loginData = await loginRes.json();
    
    if (loginData.success) {
      console.log('✅ Login successful!');
      console.log('   User:', loginData.user.name);
      console.log('   Role:', loginData.user.role);
      console.log('   Token:', loginData.token.substring(0, 20) + '...');

      const token = loginData.token;

      // Test 3: Get Papers
      console.log('\n3️⃣ Testing Get Papers...');
      const papersRes = await fetch(`${API_URL}/api/papers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const papersData = await papersRes.json();
      
      if (papersData.success) {
        console.log('✅ Papers retrieved!');
        console.log('   Count:', papersData.count);
      } else {
        console.log('❌ Failed to get papers:', papersData.message);
      }

      // Test 4: Get Users (Admin only)
      console.log('\n4️⃣ Testing Get Users (Admin only)...');
      const usersRes = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersRes.json();
      
      if (usersData.success) {
        console.log('✅ Users retrieved!');
        console.log('   Count:', usersData.count);
      } else {
        console.log('❌ Failed to get users:', usersData.message);
      }

      // Test 5: Get Current User
      console.log('\n5️⃣ Testing Get Current User...');
      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const meData = await meRes.json();
      
      if (meData.success) {
        console.log('✅ Current user retrieved!');
        console.log('   Name:', meData.user.name);
        console.log('   Email:', meData.user.email);
      } else {
        console.log('❌ Failed to get current user:', meData.message);
      }

    } else {
      console.log('❌ Login failed:', loginData.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n⚠️  Make sure the server is running on port 5000');
    console.log('   Run: cd server && npm run dev\n');
  }
}

testAPI();
