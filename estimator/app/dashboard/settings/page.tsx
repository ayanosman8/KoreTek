"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, UserX, LogOut, Trash2, Code2, Save, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/auth/client";

// Popular tech options for dropdowns
const TECH_OPTIONS = {
  frontend: [
    'Next.js 15', 'Next.js 14', 'React 19', 'React 18', 'TypeScript', 'JavaScript',
    'Tailwind CSS v4', 'Tailwind CSS v3', 'shadcn/ui', 'Framer Motion',
    'Vue.js', 'Svelte', 'SvelteKit', 'Nuxt', 'Remix', 'Astro'
  ],
  backend: [
    'Next.js API Routes', 'tRPC', 'Hono', 'Node.js', 'Express',
    'Fastify', 'Nest.js', 'GraphQL', 'REST API', 'WebSockets',
    'Deno', 'Bun'
  ],
  database: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Prisma ORM', 'Drizzle ORM',
    'TypeORM', 'Mongoose', 'Redis', 'SQLite', 'Supabase Database',
    'PlanetScale', 'Neon', 'Turso'
  ],
  auth: [
    'Supabase Auth', 'Clerk', 'Auth.js', 'NextAuth', 'Firebase Auth',
    'Auth0', 'Lucia', 'Kinde', 'AWS Cognito', 'Passport.js'
  ],
  infrastructure: [
    'Vercel', 'Railway', 'Fly.io', 'Netlify', 'AWS', 'Google Cloud',
    'Azure', 'DigitalOcean', 'Render', 'Cloudflare Workers', 'Supabase'
  ],
  services: [
    'Resend', 'Uploadthing', 'Stripe', 'PayPal', 'Cloudinary',
    'AWS S3', 'SendGrid', 'Mailgun', 'Twilio', 'Pusher', 'Ably'
  ]
};

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [techPreferences, setTechPreferences] = useState({
    frontend: [] as string[],
    backend: [] as string[],
    database: [] as string[],
    auth: [] as string[],
    infrastructure: [] as string[],
    payment_apis: [] as string[],
    ai_apis: [] as string[],
    services: [] as string[],
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesSuccess, setPreferencesSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'account' | 'tech-stack' | 'subscription' | 'danger'>('account');
  const router = useRouter();

  useEffect(() => {
    checkAuth();

    // Check for success parameter in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      // Remove the success param from URL
      window.history.replaceState({}, '', '/settings');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setUser(user);

    // Fetch subscription status and tech preferences from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, has_paid, tech_preferences')
      .eq('id', user.id)
      .single();

    if (profile) {
      const status = profile.subscription_status || (profile.has_paid ? 'active' : null);
      setSubscriptionStatus(status);

      // Load tech preferences if they exist
      if (profile.tech_preferences) {
        setTechPreferences(profile.tech_preferences);
      }
    }

    setIsLoading(false);
  };

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setIsUpgrading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and all your blueprints will be permanently deleted.')) {
      return;
    }

    const finalConfirm = prompt('Type "DELETE" to confirm account deletion:');
    if (finalConfirm !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    // TODO: Implement actual account deletion API
    alert('Account deletion will be implemented soon');
  };

  const handleSaveTechPreferences = async () => {
    setIsSavingPreferences(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ tech_preferences: techPreferences })
        .eq('id', user.id);

      if (error) throw error;

      setPreferencesSuccess(true);
      setTimeout(() => setPreferencesSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving tech preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const addTechItem = (category: keyof typeof techPreferences, item: string) => {
    if (!item.trim()) return;
    if (techPreferences[category].includes(item.trim())) return;

    setTechPreferences({
      ...techPreferences,
      [category]: [...techPreferences[category], item.trim()]
    });
  };

  const removeTechItem = (category: keyof typeof techPreferences, item: string) => {
    setTechPreferences({
      ...techPreferences,
      [category]: techPreferences[category].filter(i => i !== item)
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extralight text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account and preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Side Navigation */}
          <div className="w-56">
            <div className="sticky top-24 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-3">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('account')}
                  className={`w-full px-4 py-2.5 rounded-lg text-left transition-all ${
                    activeSection === 'account'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">Account</span>
                </button>
                <button
                  onClick={() => setActiveSection('tech-stack')}
                  className={`w-full px-4 py-2.5 rounded-lg text-left transition-all ${
                    activeSection === 'tech-stack'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">Tech Stack</span>
                </button>
                <button
                  onClick={() => setActiveSection('subscription')}
                  className={`w-full px-4 py-2.5 rounded-lg text-left transition-all ${
                    activeSection === 'subscription'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">Subscription</span>
                </button>
                <button
                  onClick={() => setActiveSection('danger')}
                  className={`w-full px-4 py-2.5 rounded-lg text-left transition-all ${
                    activeSection === 'danger'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">Danger Zone</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

        {/* Account Info */}
        {activeSection === 'account' && (
        <div className="animate-fadeIn bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-light text-white mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/50 mb-1">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
            {user?.user_metadata?.full_name && (
              <div>
                <p className="text-sm text-white/50 mb-1">Name</p>
                <p className="text-white">{user.user_metadata.full_name}</p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Tech Stack Preferences */}
        {activeSection === 'tech-stack' && (
        <div className="animate-fadeIn bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-light text-white mb-2">Tech Stack Preferences</h2>
              <p className="text-white/60 text-sm">Set your default technologies for AI blueprint generation</p>
            </div>
            <Code2 className="w-6 h-6 text-blue-400" />
          </div>

          <div className="space-y-6">
            {/* Frontend */}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Frontend</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techPreferences.frontend.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeTechItem('frontend', item)}
                      className="text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTechItem('frontend', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="" className="bg-gray-900">Select frontend technology...</option>
                {TECH_OPTIONS.frontend
                  .filter(tech => !techPreferences.frontend.includes(tech))
                  .map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))
                }
              </select>
            </div>

            {/* Backend */}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Backend/API</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techPreferences.backend.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeTechItem('backend', item)}
                      className="text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTechItem('backend', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="" className="bg-gray-900">Select backend technology...</option>
                {TECH_OPTIONS.backend
                  .filter(tech => !techPreferences.backend.includes(tech))
                  .map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))
                }
              </select>
            </div>

            {/* Database */}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Database</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techPreferences.database.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeTechItem('database', item)}
                      className="text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTechItem('database', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="" className="bg-gray-900">Select database technology...</option>
                {TECH_OPTIONS.database
                  .filter(tech => !techPreferences.database.includes(tech))
                  .map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))
                }
              </select>
            </div>

            {/* Auth */}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Authentication</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techPreferences.auth.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeTechItem('auth', item)}
                      className="text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTechItem('auth', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="" className="bg-gray-900">Select auth provider...</option>
                {TECH_OPTIONS.auth
                  .filter(tech => !techPreferences.auth.includes(tech))
                  .map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))
                }
              </select>
            </div>

            {/* Infrastructure */}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Infrastructure</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techPreferences.infrastructure.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeTechItem('infrastructure', item)}
                      className="text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTechItem('infrastructure', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="" className="bg-gray-900">Select infrastructure...</option>
                {TECH_OPTIONS.infrastructure
                  .filter(tech => !techPreferences.infrastructure.includes(tech))
                  .map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))
                }
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Preferred Services</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techPreferences.services.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeTechItem('services', item)}
                      className="text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTechItem('services', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="" className="bg-gray-900">Select service...</option>
                {TECH_OPTIONS.services
                  .filter(tech => !techPreferences.services.includes(tech))
                  .map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-white/10">
            {preferencesSuccess && (
              <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-green-400 text-sm">Preferences saved successfully!</p>
              </div>
            )}
            <button
              onClick={handleSaveTechPreferences}
              disabled={isSavingPreferences}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSavingPreferences ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Tech Preferences
                </>
              )}
            </button>
          </div>
        </div>
        )}

        {/* Subscription */}
        {activeSection === 'subscription' && (
        <div className="animate-fadeIn">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-green-400 text-sm font-medium">
              Successfully upgraded to Pro! Your subscription is now active.
            </p>
          </div>
        )}

        {/* Subscription Management */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-light text-white mb-2">Subscription</h2>
              <p className="text-white/60 text-sm">Manage your billing and subscription</p>
            </div>
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>

          {/* Current Plan */}
          <div className="bg-black/30 border border-white/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Current Plan</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                subscriptionStatus === 'active'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-white/10 text-white/60'
              }`}>
                {subscriptionStatus === 'active' ? 'Pro' : 'Free'}
              </span>
            </div>
            {subscriptionStatus === 'active' ? (
              <p className="text-white/60 text-sm">You have access to all Pro features</p>
            ) : (
              <p className="text-white/60 text-sm">Upgrade to Pro for unlimited blueprints and advanced features</p>
            )}
          </div>

          {/* Pro Tier Card */}
          {subscriptionStatus !== 'active' && (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Spark Pro</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-light text-white">$29</span>
                    <span className="text-white/60 text-sm">/month</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Unlimited blueprint generation</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Save unlimited blueprints to library</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Advanced blueprint enhancements</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Target audience analysis</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Monetization strategies</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>MVP comparison & roadmap</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button
                onClick={handleUpgradeToPro}
                disabled={isUpgrading}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpgrading ? 'Redirecting to checkout...' : 'Upgrade to Pro'}
              </button>
            </div>
          )}

          {/* Manage Subscription Button (for Pro users) */}
          {subscriptionStatus === 'active' && (
            <button
              onClick={() => {
                // TODO: Implement customer portal
                alert('Customer portal coming soon! You can manage your subscription from Stripe.');
              }}
              className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all"
            >
              Manage Subscription
            </button>
          )}
        </div>
        </div>
        )}

        {/* Danger Zone */}
        {activeSection === 'danger' && (
        <div className="animate-fadeIn bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-xl p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-light text-red-400 mb-2">Danger Zone</h2>
              <p className="text-white/60 text-sm">Irreversible and destructive actions</p>
            </div>
            <UserX className="w-6 h-6 text-red-400" />
          </div>

          <div className="space-y-4">
            {/* Logout */}
            <div className="bg-black/30 border border-white/10 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium mb-1">Log Out</h3>
                  <p className="text-white/60 text-sm">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-red-400 font-medium mb-1">Delete Account</h3>
                  <p className="text-white/60 text-sm">Permanently delete your account and all data</p>
                  <p className="text-red-400/80 text-xs mt-2">This action cannot be undone!</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}
