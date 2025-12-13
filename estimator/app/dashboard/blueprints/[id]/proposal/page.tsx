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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push(`/dashboard/blueprints/${blueprintId}`)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Generate Proposal
            </h1>
            <p className="text-white/60 mt-1">{blueprint.project_name}</p>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Client Company</label>
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Inc."
              />
            </div>
          </div>
        </div>

        {/* Feature Pricing */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Feature Pricing</h2>

          <div className="space-y-3">
            {blueprint.features?.map((feature: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 p-3 bg-black/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">$</span>
                  <input
                    type="number"
                    value={featurePrices[index] || 0}
                    onChange={(e) => setFeaturePrices({ ...featurePrices, [index]: parseFloat(e.target.value) || 0 })}
                    className="w-28 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mt-4">
              <p className="text-lg font-bold">Total Investment</p>
              <p className="text-2xl font-bold text-blue-300">${totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Pricing</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Total Project Price</label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-black/30 border border-white/20 rounded-lg">
                  <span className="text-white/60 text-lg">$</span>
                  <input
                    type="number"
                    value={projectPrice || ''}
                    onChange={(e) => setProjectPrice(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-transparent text-white text-lg focus:outline-none"
                    placeholder="25000"
                    min="0"
                    step="1000"
                  />
                </div>
                <button
                  onClick={handleDistributePayments}
                  disabled={distributingPayments || !projectPrice || projectPrice <= 0}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-emerald-500/50 disabled:to-teal-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  {distributingPayments ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Auto-distribute
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-white/40 mt-2">
                AI will intelligently distribute this amount across your milestones based on their complexity
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Timeline & Milestones</h2>

          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Estimated Duration</label>
            <input
              type="text"
              value={estimatedTimeline}
              onChange={(e) => setEstimatedTimeline(e.target.value)}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8-10 weeks"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-white/70 mb-2">Milestones</label>
            {milestones.map((milestone, index) => (
              <div key={index} className="p-3 bg-black/30 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index].name = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Milestone name"
                  />
                  <div className="flex items-center gap-1 bg-black/50 border border-white/20 rounded-lg px-3">
                    <span className="text-white/60 text-sm">$</span>
                    <input
                      type="number"
                      value={milestone.payment || 0}
                      onChange={(e) => {
                        const updated = [...milestones];
                        updated[index].payment = parseFloat(e.target.value) || 0;
                        setMilestones(updated);
                      }}
                      className="w-24 py-2 bg-transparent text-white text-sm focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={milestone.duration}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index].duration = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Duration"
                  />
                  <input
                    type="text"
                    value={milestone.deliverables}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index].deliverables = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deliverables"
                  />
                </div>
              </div>
            ))}

            {/* Milestone Payment Summary */}
            {milestones.some(m => m.payment && m.payment > 0) && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Total Milestone Payments:</span>
                  <span className="text-lg font-bold text-blue-300">
                    ${milestones.reduce((sum, m) => sum + (m.payment || 0), 0).toLocaleString()}
                  </span>
                </div>
                {projectPrice > 0 && (
                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-blue-500/20">
                    <span className="text-white/50">Project Price:</span>
                    <span className="text-white/70">${projectPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push(`/dashboard/blueprints/${blueprintId}`)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateProposal}
            disabled={generating || !clientName}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
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
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-200">
            <strong>Tip:</strong> Set up your company information in{' '}
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="underline hover:text-yellow-100"
            >
              Settings
            </button>{' '}
            to automatically include your logo, contact details, and terms in all proposals.
          </p>
        </div>
      </div>
    </div>
  );
}
