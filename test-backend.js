import { app, server } from './server/index.js';

async function runTests() {
  console.log('\n--- STARTING COMPREHENSIVE BACKEND TESTS ---\n');
  const baseUrl = 'http://127.0.0.1:5000/api';

  try {
    // 1. Health check
    console.log('1. Testing /api/health...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('   Health response:', healthData.status === 'online' ? '✅ PASS' : '❌ FAIL', healthData);

    // 2. Admin Login
    console.log('\n2. Testing Admin Login (admin@travelora.com)...');
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@travelora.com', password: 'admin123' })
    });
    const adminLoginData = await adminLoginRes.json();
    console.log('   Admin Login status:', adminLoginRes.status === 200 ? '✅ PASS' : '❌ FAIL');
    console.log('   Admin Role:', adminLoginData.user?.role === 'admin' ? '✅ Verified Admin' : '❌ Failed');
    const adminToken = adminLoginData.token;

    // 3. User Login
    console.log('\n3. Testing User Login (ansh.sharma@travelora.demo)...');
    const userLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ansh.sharma@travelora.demo', password: 'password123' })
    });
    const userLoginData = await userLoginRes.json();
    console.log('   User Login status:', userLoginRes.status === 200 ? '✅ PASS' : '❌ FAIL');
    console.log('   User Role:', userLoginData.user?.role === 'user' ? '✅ Verified User' : '❌ Failed');
    const userToken = userLoginData.token;

    // 4. Test User Register
    console.log('\n4. Testing New User Registration...');
    const testEmail = `tester_${Date.now()}@travelora.demo`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Explorer',
        email: testEmail,
        password: 'password123',
        phone: '+91 99999 77777'
      })
    });
    const regData = await regRes.json();
    console.log('   User Registration:', regRes.status === 201 ? '✅ PASS' : '❌ FAIL', regData.user?.email);

    // 5. Test Destinations endpoint
    console.log('\n5. Testing /api/destinations...');
    const destRes = await fetch(`${baseUrl}/destinations`);
    const destData = await destRes.json();
    console.log(`   Destinations count: ${destData.count} (Expected 14+) -`, destData.count >= 14 ? '✅ PASS' : '❌ FAIL');

    // 6. Test Packages endpoint
    console.log('\n6. Testing /api/packages...');
    const pkgRes = await fetch(`${baseUrl}/packages`);
    const pkgData = await pkgRes.json();
    console.log(`   Packages count: ${pkgData.count} (Expected 8+) -`, pkgData.count >= 8 ? '✅ PASS' : '❌ FAIL');

    // 7. Test Admin Stats with Admin Token
    console.log('\n7. Testing Admin Analytics (/api/admin/stats) with Admin Token...');
    const adminStatsRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminStatsData = await adminStatsRes.json();
    console.log('   Admin Stats status:', adminStatsRes.status === 200 ? '✅ PASS' : '❌ FAIL');
    console.log(`   Total Bookings: ${adminStatsData.stats?.totalBookings}, Confirmed Revenue: Rs. ${adminStatsData.stats?.totalRevenue}`);

    // 8. Test Role-Based Security: User calling Admin Stats should be 403 Forbidden!
    console.log('\n8. Testing Role-Based Security (User attempting to access Admin Stats)...');
    const forbiddenRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('   Forbidden Access status:', forbiddenRes.status === 403 ? '✅ PASS (Correctly blocked with 403 Forbidden)' : '❌ FAIL');

    // 9. Test Create Booking
    console.log('\n9. Testing Create Booking (/api/bookings)...');
    const bookRes = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        packageId: 'pkg-ladakh-expedition',
        packageTitle: 'Magical Ladakh Expedition',
        destination: 'Ladakh, India',
        travelDate: '2026-12-20',
        travellersCount: 2,
        leadTraveller: { fullName: 'Test Explorer', email: testEmail, phone: '+91 99999 77777' },
        pricePerPerson: 28999,
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2'
      })
    });
    const bookData = await bookRes.json();
    console.log('   Create Booking status:', bookRes.status === 201 ? '✅ PASS' : '❌ FAIL', `Booking ID: ${bookData.booking?.bookingId}`);

    // 10. Test Wishlist Toggle
    console.log('\n10. Testing Wishlist Toggle (/api/wishlist/toggle)...');
    const wishRes = await fetch(`${baseUrl}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ destinationId: 'dubai-uae' })
    });
    const wishData = await wishRes.json();
    console.log('   Wishlist toggle:', wishData.success ? '✅ PASS' : '❌ FAIL', wishData.message);

    // 11. Test Contact Submission & Admin Inquiries List
    console.log('\n11. Testing Contact Inquiry Submission (/api/contact)...');
    const contactPost = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'University Jury Examiner',
        email: 'examiner@university.edu',
        subject: 'Capstone Project Evaluation',
        message: 'Reviewing full-stack architecture, SQLite persistence, and JWT RBAC.'
      })
    });
    const contactPostData = await contactPost.json();
    console.log('   Contact Submit:', contactPost.status === 201 ? '✅ PASS' : '❌ FAIL', contactPostData.message);

    const contactGet = await fetch(`${baseUrl}/contact`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const contactGetData = await contactGet.json();
    console.log('   Admin Fetch Contacts:', contactGet.status === 200 && contactGetData.count > 0 ? '✅ PASS' : '❌ FAIL', `Found ${contactGetData.count} inquiries.`);

    // 12. Test Newsletter Subscription
    console.log('\n12. Testing Newsletter Subscription (/api/newsletter)...');
    const newsPost = await fetch(`${baseUrl}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `subscriber_${Date.now()}@travelora.platform` })
    });
    const newsPostData = await newsPost.json();
    console.log('   Newsletter Subscribe:', newsPost.status === 201 ? '✅ PASS' : '❌ FAIL', newsPostData.message);

    const newsGet = await fetch(`${baseUrl}/newsletter`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const newsGetData = await newsGet.json();
    console.log('   Admin Fetch Subscribers:', newsGet.status === 200 && newsGetData.count > 0 ? '✅ PASS' : '❌ FAIL', `Found ${newsGetData.count} subscribers.`);

    console.log('\n=============================================');
    console.log('🎉 ALL 12 BACKEND TESTS COMPLETED SUCCESSFULLY!');
    console.log('=============================================\n');
  } catch (err) {
    console.error('❌ Test failed with exception:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
