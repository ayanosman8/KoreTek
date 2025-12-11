#!/usr/bin/env node

// Script to create TEST MODE Stripe payment links for testing
// Run with: node scripts/create-test-payment-links.js

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

// Use test mode key
const testKey = process.env.STRIPE_SECRET_KEY.replace('sk_live_', 'sk_test_');
const stripe = new Stripe(testKey, {
  apiVersion: '2025-10-29.clover',
});

const packages = [
  { name: 'Lightning', fullPrice: 10000 },
  { name: 'Bolt', fullPrice: 17500 },
  { name: 'Alpha', fullPrice: 37500 },
];

async function createTestPaymentLinks() {
  console.log('🧪 Creating TEST MODE Payment Links...\n');
  console.log('⚠️  These links use TEST mode - you can pay with fake credit cards!\n');

  const paymentLinks = [];

  for (const pkg of packages) {
    console.log(`\n📦 Creating test links for ${pkg.name} Package ($${pkg.fullPrice.toLocaleString()})...`);

    const depositAmount = pkg.fullPrice / 2;

    try {
      // Create 50% Deposit Product & Price
      const depositProduct = await stripe.products.create({
        name: `[TEST] ${pkg.name} Package - 50% Deposit`,
        description: `TEST MODE - 50% deposit ($${depositAmount.toLocaleString()}) to start your project.`,
      });

      const depositPrice = await stripe.prices.create({
        product: depositProduct.id,
        unit_amount: depositAmount * 100,
        currency: 'usd',
      });

      const depositPaymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: depositPrice.id, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: 'http://localhost:3000/checkout/success',
          },
        },
      });

      console.log(`  ✅ 50% Deposit Link: ${depositPaymentLink.url}`);

      paymentLinks.push({
        package: pkg.name,
        depositLink: depositPaymentLink.url,
      });

    } catch (error) {
      console.error(`  ❌ Error creating ${pkg.name} test links:`, error.message);
    }
  }

  // Print summary with test card info
  console.log('\n\n' + '='.repeat(80));
  console.log('✨ TEST MODE PAYMENT LINKS CREATED!');
  console.log('='.repeat(80) + '\n');

  paymentLinks.forEach(link => {
    console.log(`📦 ${link.package.toUpperCase()} PACKAGE - 50% DEPOSIT (TEST MODE)`);
    console.log(`   ${link.depositLink}\n`);
  });

  console.log('='.repeat(80));
  console.log('🧪 HOW TO TEST:');
  console.log('='.repeat(80));
  console.log('\n1. Open any link above in your browser');
  console.log('2. Use these FAKE credit card numbers:\n');
  console.log('   ✅ Success: 4242 4242 4242 4242');
  console.log('   ❌ Decline: 4000 0000 0000 0002');
  console.log('   🔐 3D Secure: 4000 0025 0000 3155\n');
  console.log('   Expiry: Any future date (e.g., 12/34)');
  console.log('   CVC: Any 3 digits (e.g., 123)');
  console.log('   ZIP: Any 5 digits (e.g., 12345)\n');
  console.log('3. Complete the payment');
  console.log('4. You\'ll be redirected to success page\n');
  console.log('💡 View test payments at: https://dashboard.stripe.com/test/payments\n');
}

createTestPaymentLinks().catch(error => {
  console.error('❌ Fatal Error:', error.message);
  process.exit(1);
});
