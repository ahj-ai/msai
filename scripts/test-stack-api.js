// Test script for the Stack API endpoints
// Run with: node test-stack-api.js

async function testStackAPI() {
  console.log('Testing Stack API endpoints...');
  
  // Get your auth token from a logged-in session
  // (You'll need to manually copy this from browser dev tools)
  const authToken = 'YOUR_AUTH_TOKEN'; // Replace with actual auth token

  // Base URL - adjust if your dev server runs on a different port
  const baseUrl = 'http://localhost:3000';
  
  // Headers for all requests
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };

  try {
    // 1. Test GET endpoint - get current stack balance
    console.log('\n1. Testing GET stack balance endpoint...');
    const getResponse = await fetch(`${baseUrl}/api/user/stacks`, {
      method: 'GET',
      headers
    });
    
    const getResult = await getResponse.json();
    console.log('Current stack balance:', getResult);

    // 2. Test POST endpoint - spend stacks
    console.log('\n2. Testing POST spend stacks endpoint...');
    const spendResponse = await fetch(`${baseUrl}/api/user/stacks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: 1,  // Spend just 1 stack as a test
        operation: 'test_operation'
      })
    });
    
    const spendResult = await spendResponse.json();
    console.log('Spend stacks result:', spendResult);
    
    // 3. Test PATCH endpoint - get transaction history
    console.log('\n3. Testing PATCH transaction history endpoint...');
    const historyResponse = await fetch(`${baseUrl}/api/user/stacks`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        limit: 5  // Get only 5 most recent transactions
      })
    });
    
    const historyResult = await historyResponse.json();
    console.log('Transaction history:', historyResult);
    
    // Note: We're not testing the PUT endpoint which requires admin access
    
    console.log('\nAll tests completed!');
    
  } catch (error) {
    console.error('Error during API testing:', error);
  }
}

// Run the tests
testStackAPI().catch(console.error);

/* 
How to use this script:
1. Start your Next.js development server
2. Log in to your application in the browser
3. Open browser dev tools > Application tab > Cookies
4. Find the __clerk_session_id cookie and copy its value
5. Replace 'YOUR_AUTH_TOKEN' in this script with that value
6. Run this script with: node test-stack-api.js
*/
