import { redirect } from "next/navigation";
import { getUser } from "@repo/auth/server";
import { supabase } from "@repo/database/client";
import { LogOut, BarChart3, Users, FileText } from "lucide-react";
import LogoutButton from "./components/LogoutButton";

export const dynamic = "force-dynamic";

async function getEstimates() {
  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching estimates:", error);
    return [];
  }

  return data || [];
}

async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  return data || [];
}

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const estimates = await getEstimates();
  const leads = await getLeads();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extralight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  Scope AI
                </span>
                <span className="text-white/40 ml-2">/ Admin</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60 font-light">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-3xl font-light text-white mb-1">{estimates.length}</p>
              <p className="text-sm text-white/60 font-light">Total Estimates</p>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-3xl font-light text-white mb-1">{leads.length}</p>
              <p className="text-sm text-white/60 font-light">Qualified Leads</p>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-3xl font-light text-white mb-1">
                {estimates.length > 0 ? Math.round((leads.length / estimates.length) * 100) : 0}%
              </p>
              <p className="text-sm text-white/60 font-light">Conversion Rate</p>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-light text-white mb-6">Recent Leads</h2>
            {leads.length === 0 ? (
              <p className="text-white/40 font-light text-center py-8">No leads yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Project</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead: any) => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-sm text-white font-light">{lead.name || "N/A"}</td>
                        <td className="py-3 px-4 text-sm text-white/70 font-light">{lead.email}</td>
                        <td className="py-3 px-4 text-sm text-white/50 font-light max-w-md truncate">
                          {lead.project_description?.substring(0, 80)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-white/40 font-light">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Estimates Table */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-light text-white mb-6">Recent Estimates</h2>
            {estimates.length === 0 ? (
              <p className="text-white/40 font-light text-center py-8">No estimates yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Project</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimates.map((estimate: any) => (
                      <tr key={estimate.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-sm text-white font-light">
                          {estimate.estimate?.projectName || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-white/70 font-light max-w-md truncate">
                          {estimate.project_description?.substring(0, 100)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-white/40 font-light">
                          {new Date(estimate.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
