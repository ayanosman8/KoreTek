import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"></div>
        <div className="relative w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <h1 className="text-xl font-extralight tracking-tight text-white">
                KoreLnx
              </h1>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-white/70 hover:text-blue-400 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-12">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-white/50 text-sm mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8 text-white/70">
              <section>
                <h2 className="text-2xl font-light text-white mb-4">1. Information We Collect</h2>
                <p className="mb-3">
                  When you use KoreLnx services, we collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address (via Google OAuth)</li>
                  <li>Profile information from your Google account</li>
                  <li>Project and blueprint data you create in our applications</li>
                  <li>Usage data and interactions with our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Authenticate your account and provide secure access</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">3. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely using industry-standard encryption.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">4. Third-Party Services</h2>
                <p className="mb-3">
                  We use the following third-party services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google OAuth:</strong> For authentication</li>
                  <li><strong>Supabase:</strong> For database and authentication services</li>
                  <li><strong>Stripe:</strong> For payment processing</li>
                  <li><strong>Vercel:</strong> For hosting services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">5. Your Rights</h2>
                <p className="mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent at any time</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">6. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">7. Children's Privacy</h2>
                <p>
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">8. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">9. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-3">
                  <a href="mailto:aosman@korelnx.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    aosman@korelnx.com
                  </a>
                </p>
                <p className="mt-1 text-white/50">
                  KoreLnx<br />
                  Software Development Agency
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
