'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Loader2, ArrowLeft } from 'lucide-react';

export default function ProposalGenerator({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [blueprintId, setBlueprintId] = useState<string>('');
  const [blueprint, setBlueprint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Client info
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  // Pricing
  const [featurePrices, setFeaturePrices] = useState<{ [key: number]: number }>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [projectPrice, setProjectPrice] = useState(0);
  const [distributingPayments, setDistributingPayments] = useState(false);
  const [estimatedTimeline, setEstimatedTimeline] = useState('');

  // Milestones
  const [milestones, setMilestones] = useState([
    { name: 'Discovery & Planning', duration: '1-2 weeks', deliverables: 'Requirements document, wireframes', payment: 0 },
    { name: 'Design & Development', duration: '4-6 weeks', deliverables: 'Functional application with core features', payment: 0 },
    { name: 'Testing & Deployment', duration: '1-2 weeks', deliverables: 'Deployed application, documentation', payment: 0 },
  ]);

  // Load params and blueprint
  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setBlueprintId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!blueprintId) return;

    async function fetchBlueprint() {
      try {
        const response = await fetch(`/api/blueprints/${blueprintId}`);
        if (response.ok) {
          const data = await response.json();
          setBlueprint(data);

          // Initialize feature prices
          const initialPrices: { [key: number]: number } = {};
          data.features?.forEach((_: any, index: number) => {
            initialPrices[index] = 0;
          });
          setFeaturePrices(initialPrices);
        } else {
          console.error('Failed to fetch blueprint');
        }
      } catch (error) {
        console.error('Error fetching blueprint:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlueprint();
  }, [blueprintId]);

  // Calculate total when feature prices change
  useEffect(() => {
    const total = Object.values(featurePrices).reduce((sum, price) => sum + (price || 0), 0);
    setTotalPrice(total);
  }, [featurePrices]);

  const handleDistributePayments = async () => {
    if (!projectPrice || projectPrice <= 0) {
      alert('Please enter a valid project price first');
      return;
    }

    setDistributingPayments(true);

    try {
      const response = await fetch('/api/pricing/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPrice: projectPrice,
          milestones: milestones.map(m => ({
            name: m.name,
            duration: m.duration,
            deliverables: m.deliverables,
          })),
        }),
      });

      if (response.ok) {
        const { payments } = await response.json();

        // Update milestones with AI-suggested payments
        const updatedMilestones = milestones.map((m, i) => ({
          ...m,
          payment: payments[i] || 0,
        }));
        setMilestones(updatedMilestones);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to distribute payments');
      }
    } catch (error) {
      console.error('Error distributing payments:', error);
      alert('Failed to distribute payments. Please try again.');
    } finally {
      setDistributingPayments(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!clientName) {
      alert('Please enter client name');
      return;
    }

    setGenerating(true);

    try {
      // Use projectPrice if set, otherwise use feature-based totalPrice
      const finalPrice = projectPrice > 0 ? projectPrice : totalPrice;

      const response = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprintId,
          clientInfo: {
            name: clientName,
            email: clientEmail,
            company: clientCompany,
          },
          pricing: {
            featurePrices,
            totalPrice: finalPrice,
            estimatedTimeline,
            milestones,
          },
        }),
      });

      if (response.ok) {
        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${blueprint?.project_name || 'proposal'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate proposal');
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert('Failed to generate proposal. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Blueprint not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push(`/dashboard/blueprints/${blueprintId}`)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blueprint</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
              <FileText className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extralight text-white mb-1">Generate Proposal</h1>
              <p className="text-white/60">{blueprint.project_name}</p>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-light text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Client Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white font-light focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                placeholder="John Doe"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white font-light focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Client Company</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white font-light focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pricing */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-light text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Feature Pricing
            <span className="text-xs text-white/40 font-normal ml-auto">(Optional)</span>
          </h2>

          <div className="space-y-3">
            {blueprint.features?.map((feature: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 p-4 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div className="flex-1">
                  <p className="font-light text-white">{feature.name}</p>
                  <p className="text-sm text-white/50 mt-0.5 line-clamp-1">{feature.description}</p>
                </div>
                <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-3 min-w-[130px]">
                  <span className="text-white/50 text-sm font-light">$</span>
                  <input
                    type="number"
                    value={featurePrices[index] || ''}
                    onChange={(e) => setFeaturePrices({ ...featurePrices, [index]: parseFloat(e.target.value) || 0 })}
                    className="flex-1 py-2 bg-transparent text-white font-light focus:outline-none placeholder:text-white/30"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between gap-4 p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl mt-4">
              <p className="text-base font-medium text-white/80">Total Feature Pricing</p>
              <p className="text-2xl font-light text-white">${totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-light text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Project Pricing
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Total Project Price</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-black/30 border border-white/20 rounded-xl hover:border-white/30 transition-colors">
                  <span className="text-white/60 text-xl font-light">$</span>
                  <input
                    type="number"
                    value={projectPrice || ''}
                    onChange={(e) => setProjectPrice(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-transparent text-white text-xl font-light focus:outline-none placeholder:text-white/20"
                    placeholder="25,000"
                    min="0"
                    step="1000"
                  />
                </div>
                <button
                  onClick={handleDistributePayments}
                  disabled={distributingPayments || !projectPrice || projectPrice <= 0}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 whitespace-nowrap group"
                >
                  {distributingPayments ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Auto-distribute</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-white/40">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>AI will intelligently distribute this amount across your milestones based on complexity, duration, and industry standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-light text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Timeline & Milestones
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-3">Estimated Duration</label>
            <input
              type="text"
              value={estimatedTimeline}
              onChange={(e) => setEstimatedTimeline(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white font-light focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
              placeholder="8-10 weeks"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/70 mb-3">Milestones</label>
            {milestones.map((milestone, index) => (
              <div key={index} className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index].name = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white font-light focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/30"
                    placeholder="Milestone name"
                  />
                  <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-3 min-w-[140px]">
                    <span className="text-white/50 text-sm font-light">$</span>
                    <input
                      type="number"
                      value={milestone.payment || ''}
                      onChange={(e) => {
                        const updated = [...milestones];
                        updated[index].payment = parseFloat(e.target.value) || 0;
                        setMilestones(updated);
                      }}
                      className="flex-1 py-2.5 bg-transparent text-white font-light focus:outline-none placeholder:text-white/30"
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={milestone.duration}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index].duration = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm font-light focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/30"
                    placeholder="Duration (e.g., 1-2 weeks)"
                  />
                  <input
                    type="text"
                    value={milestone.deliverables}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index].deliverables = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm font-light focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/30"
                    placeholder="Deliverables"
                  />
                </div>
              </div>
            ))}

            {/* Milestone Payment Summary */}
            {milestones.some(m => m.payment && m.payment > 0) && (
              <div className="mt-6 p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/80">Total Milestone Payments</span>
                  <span className="text-2xl font-light text-white">
                    ${milestones.reduce((sum, m) => sum + (m.payment || 0), 0).toLocaleString()}
                  </span>
                </div>
                {projectPrice > 0 && (
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
                    <span className="text-white/50">Project Price:</span>
                    <span className="text-white/70">${projectPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
          <button
            onClick={() => router.push(`/dashboard/blueprints/${blueprintId}`)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateProposal}
            disabled={generating || !clientName}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate PDF Proposal
              </>
            )}
          </button>
        </div>

        {/* Note about company settings */}
        <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-200 mb-1">Pro Tip</p>
              <p className="text-sm text-yellow-100/80">
                Set up your company information in{' '}
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="underline font-medium hover:text-yellow-100 transition-colors"
                >
                  Settings
                </button>{' '}
                to automatically include your logo, contact details, and terms in all proposals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
