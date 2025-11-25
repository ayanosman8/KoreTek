#!/usr/bin/env node

// Script to create Stripe payment links for all packages
// Run with: node scripts/create-payment-links.js

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

const packages = [
  {
    name: 'Lightning',
    fullPrice: 2000,
    description: 'Perfect for startups and small businesses needing a polished mobile or web app',
    features: [
      'Landing pages & small web apps',
      'Simple mobile apps (iOS or Android)',
      'Custom UI/UX design',
      'Responsive design',
      'Basic integrations',
      '2-4 week delivery',
    ],
  },
  {
    name: 'Bolt',
    fullPrice: 8000,
    description: 'For growing businesses that need robust, feature-rich applications',
    features: [
      'Full web applications with backend',
      'Cross-platform mobile apps (iOS & Android)',
      'User authentication & authorization',
      'Database architecture & API development',
      'Admin dashboard',
      'Third-party integrations',
      '4-8 week delivery',
    ],
  },
  {
    name: 'Alpha',
    fullPrice: 30000,
    description: 'Enterprise-grade solutions for complex business requirements',
    features: [
      'Complete web + mobile ecosystem',
      'Advanced API architecture',
      'Real-time data synchronization',
      'Scalable cloud infrastructure',
      'Custom integrations & workflows',
      'Dedicated support & maintenance',
      'Security & compliance features',
      'Ongoing partnership & iteration',
    ],
  },
];

async function createPaymentLinks() {
  console.log('🚀 Creating Stripe Payment Links...\n');

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY is not set in .env.local');
    console.error('Please add your Stripe secret key to .env.local and try again.');
    process.exit(1);
  }

  const paymentLinks = [];

  for (const pkg of packages) {
    console.log(`\n📦 Creating payment links for ${pkg.name} Package ($${pkg.fullPrice.toLocaleString()})...`);

    const depositAmount = pkg.fullPrice / 2;

    try {
      // Create 50% Deposit Product & Price
      const depositProduct = await stripe.products.create({
        name: `${pkg.name} Package - 50% Deposit`,
        description: `${pkg.description}\n\n50% deposit ($${depositAmount.toLocaleString()}) to start your project.\n\nIncludes:\n${pkg.features.map(f => `• ${f}`).join('\n')}`,
      });

      const depositPrice = await stripe.prices.create({
        product: depositProduct.id,
        unit_amount: depositAmount * 100, // Convert to cents
        currency: 'usd',
      });

      const depositPaymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: depositPrice.id, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: 'https://korelnx.com/checkout/success',
          },
        },
      });

      console.log(`  ✅ 50% Deposit Link: ${depositPaymentLink.url}`);

      // Create Final Payment Product & Price
      const finalProduct = await stripe.products.create({
        name: `${pkg.name} Package - Final Payment`,
        description: `${pkg.description}\n\nFinal 50% payment ($${depositAmount.toLocaleString()}) due upon project approval.`,
      });

      const finalPrice = await stripe.prices.create({
        product: finalProduct.id,
        unit_amount: depositAmount * 100, // Convert to cents
        currency: 'usd',
      });

      const finalPaymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: finalPrice.id, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: 'https://korelnx.com/checkout/success',
          },
        },
      });

      console.log(`  ✅ Final Payment Link: ${finalPaymentLink.url}`);

      paymentLinks.push({
        package: pkg.name,
        fullPrice: pkg.fullPrice,
        depositAmount: depositAmount,
        depositLink: depositPaymentLink.url,
        finalLink: finalPaymentLink.url,
      });

    } catch (error) {
      console.error(`  ❌ Error creating ${pkg.name} payment links:`, error.message);
    }
  }

  // Print summary
  console.log('\n\n' + '='.repeat(80));
  console.log('✨ ALL PAYMENT LINKS CREATED SUCCESSFULLY!');
  console.log('='.repeat(80) + '\n');

  paymentLinks.forEach(link => {
    console.log(`📦 ${link.package.toUpperCase()} PACKAGE - $${link.fullPrice.toLocaleString()}`);
    console.log(`   💰 50% Deposit ($${link.depositAmount.toLocaleString()}):`);
    console.log(`   ${link.depositLink}\n`);
    console.log(`   💰 Final Payment ($${link.depositAmount.toLocaleString()}):`);
    console.log(`   ${link.finalLink}\n`);
    console.log('-'.repeat(80) + '\n');
  });

  console.log('💡 TIP: Save these links somewhere safe for easy access when clients inquire!\n');
}

createPaymentLinks().catch(error => {
  console.error('❌ Fatal Error:', error.message);
  process.exit(1);
});
