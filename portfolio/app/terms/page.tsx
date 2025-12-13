import Link from "next/link";

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-white/50 text-sm mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8 text-white/70">
              <section>
                <h2 className="text-2xl font-light text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using KoreLnx services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">2. Description of Service</h2>
                <p className="mb-3">
                  KoreLnx provides software development services and tools, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Project estimation and blueprint generation tools</li>
                  <li>Collaborative project management features</li>
                  <li>Software development consulting services</li>
                  <li>Custom application development</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">3. User Accounts</h2>
                <p className="mb-3">
                  To use certain features of our services, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Have a valid Google account for authentication</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">4. Acceptable Use</h2>
                <p className="mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use our services for any illegal purpose</li>
                  <li>Violate any laws or regulations</li>
                  <li>Infringe upon intellectual property rights</li>
                  <li>Transmit malicious code or viruses</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Use automated systems to access our services without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">5. Intellectual Property</h2>
                <p className="mb-3">
                  All content, features, and functionality of KoreLnx services are owned by KoreLnx and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of any content you create using our services. By using our services, you grant us a license to host, store, and display your content as necessary to provide the services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">6. Payment Terms</h2>
                <p className="mb-3">
                  For paid services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fees are charged in advance on a subscription basis</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We use Stripe for payment processing</li>
                  <li>You authorize us to charge your payment method</li>
                  <li>Prices may change with 30 days notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">7. Termination</h2>
                <p className="mb-3">
                  We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Suspend or terminate your account at any time</li>
                  <li>Refuse service to anyone for any reason</li>
                  <li>Modify or discontinue services with notice</li>
                </ul>
                <p className="mt-3">
                  You may cancel your account at any time through your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">8. Disclaimers</h2>
                <p className="mb-3">
                  OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Accuracy or reliability of results</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">9. Limitation of Liability</h2>
                <p>
                  KoreLnx shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services, even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">10. Indemnification</h2>
                <p>
                  You agree to indemnify and hold KoreLnx harmless from any claims, damages, losses, liabilities, and expenses arising from your use of our services or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">11. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">12. Governing Law</h2>
                <p>
                  These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-light text-white mb-4">13. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us at:
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
