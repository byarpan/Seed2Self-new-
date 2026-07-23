import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { 
  ShieldCheck, 
  User, 
  MapPin, 
  Sprout, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  ExternalLink,
  ChevronRight,
  UserCheck2
} from "lucide-react";

export default function AdminKYCDashboard() {
  const { data: session } = useSession();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review modal states
  const [selectedFarmer, setSelectedFarmer] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFarmers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/kyc");
    if (res.ok) {
      setFarmers(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleKycDecision = async (userId: string, action: "APPROVE" | "REJECT") => {
    setErrorMessage("");
    setSuccessMessage("");
    
    if (action === "REJECT" && !rejectionReason.trim()) {
      setErrorMessage("Please enter a rejection reason");
      return;
    }

    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action,
          reason: action === "REJECT" ? rejectionReason : null
        })
      });

      if (res.ok) {
        setSuccessMessage(`KYC request successfully ${action === "APPROVE" ? "Approved" : "Rejected"}!`);
        setSelectedFarmer(null);
        setRejectionReason("");
        fetchFarmers();
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to submit decision");
      }
    } catch (err) {
      setErrorMessage("Internal server error.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white pt-10 pb-20">
      <Head>
        <title>Admin KYC Portal | Seed2Shelf</title>
      </Head>



      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-[#00d26a]" />
              KYC Verification <span className="text-[#00d26a]">Portal</span>
            </h1>
            <p className="text-stone-400 mt-2 font-medium">Review and verify farmer credentials, Aadhaar cards, and farm details to secure the on-chain supply chain.</p>
          </div>
          
          <div className="bg-stone-900/60 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-2.5">
            <UserCheck2 className="h-5 w-5 text-[#00d26a]" />
            <span className="text-sm font-bold text-stone-200">Admin Mode Enabled</span>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-sm text-[#00d26a] font-bold">
            {successMessage}
          </div>
        )}

        {/* Stakeholder KYC Review Table */}
        <div className="matte-glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Registered Stakeholders list ({farmers.length})</h3>
          </div>

          {loading ? (
            <div className="p-20 text-center text-stone-500 font-bold uppercase tracking-wider">Loading Requests...</div>
          ) : farmers.length === 0 ? (
            <div className="p-20 text-center text-stone-500 font-bold uppercase tracking-wider">No stakeholders found in verification log</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 text-xs font-black uppercase bg-black/10">
                    <th className="p-5">Stakeholder Details</th>
                    <th className="p-5">ID</th>
                    <th className="p-5">State / District</th>
                    <th className="p-5">KYC Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map((farmer) => (
                    <tr key={farmer.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-5">
                        <div>
                          <p className="font-extrabold text-white text-base flex items-center gap-2">
                            {farmer.name}
                            <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-stone-400 uppercase font-black tracking-wider">
                              {farmer.role}
                            </span>
                          </p>
                          <p className="text-stone-500 font-medium text-xs mt-0.5">{farmer.email}</p>
                        </div>
                      </td>
                      <td className="p-5 font-mono text-stone-300 font-bold">{farmer.farmerId || farmer.processorId || "N/A"}</td>
                      <td className="p-5">
                        <p className="text-stone-300 font-semibold">{farmer.state || "N/A"}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{farmer.district || "N/A"}</p>
                      </td>
                      <td className="p-5">
                        <span className={`text-[10px] px-2.5 py-1.5 rounded-full font-black border uppercase tracking-wider ${
                          farmer.kycStatus === "Verified"
                            ? "bg-[#00d26a]/15 text-[#00d26a] border-[#00d26a]/20"
                            : farmer.kycStatus === "Rejected"
                              ? "bg-red-500/15 text-red-400 border-red-500/20"
                              : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                        }`}>
                          {farmer.kycStatus}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => setSelectedFarmer(farmer)}
                          className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-[#00d26a] text-white hover:text-black border border-white/10 hover:border-transparent px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          Review KYC
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => setSelectedFarmer(null)} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="relative z-10 matte-glass border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl custom-scrollbar text-left">
            <h3 className="text-2xl font-black mb-6 border-b border-white/5 pb-4 text-green-300">
              Review KYC: {selectedFarmer.name}
            </h3>

            {errorMessage && (
              <div className="p-4 mb-4 bg-red-500/15 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              
              {/* Stakeholder Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-3">Stakeholder Information</h4>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-sm"><span className="text-stone-400 font-bold">Role:</span> <span className="text-white font-bold">{selectedFarmer.role}</span></p>
                    <p className="text-sm"><span className="text-stone-400 font-bold">ID:</span> <span className="font-mono text-white font-bold">{selectedFarmer.farmerId || selectedFarmer.processorId || "N/A"}</span></p>
                    <p className="text-sm"><span className="text-stone-400 font-bold">Mobile:</span> <span className="text-white font-bold">{selectedFarmer.mobileNumber || "N/A"}</span></p>
                    <p className="text-sm"><span className="text-stone-400 font-bold">DOB:</span> <span className="text-white font-bold">{selectedFarmer.dob || "N/A"}</span></p>
                    <p className="text-sm"><span className="text-stone-400 font-bold">Gender:</span> <span className="text-white font-bold">{selectedFarmer.gender || "N/A"}</span></p>
                  </div>
                </div>

                {selectedFarmer.role === "FARMER" && (
                  <div>
                    <h4 className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-3">Farm Details</h4>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                      <p className="text-sm"><span className="text-stone-400 font-bold">Name:</span> <span className="text-white font-bold">{selectedFarmer.farmName || "N/A"}</span></p>
                      <p className="text-sm"><span className="text-stone-400 font-bold">Location:</span> <span className="text-white font-bold">{selectedFarmer.farmLocation || "N/A"}</span></p>
                      <p className="text-sm"><span className="text-stone-400 font-bold">Land Area:</span> <span className="text-white font-bold">{selectedFarmer.landArea ? `${selectedFarmer.landArea} Acres` : "N/A"}</span></p>
                      <p className="text-sm"><span className="text-stone-400 font-bold">Main Crops:</span> <span className="text-white font-bold">{selectedFarmer.mainCrops || "N/A"}</span></p>
                      <p className="text-sm"><span className="text-stone-400 font-bold">Type:</span> <span className="text-white font-bold">{selectedFarmer.farmingType || "N/A"}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Aadhaar Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-3">Aadhaar Verification</h4>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-sm"><span className="text-stone-400 font-bold">Aadhaar Number:</span> <span className="font-mono text-white font-bold">{selectedFarmer.aadhaarNumber || "N/A"}</span></p>
                    <p className="text-sm"><span className="text-stone-400 font-bold">Current Status:</span> <span className="font-bold text-yellow-400">{selectedFarmer.kycStatus}</span></p>
                    {selectedFarmer.rejectionReason && (
                      <p className="text-sm text-red-400"><span className="font-bold">Prior Rejection Reason:</span> {selectedFarmer.rejectionReason}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-3">Aadhaar Document Previews</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-stone-500 font-bold uppercase mb-1">Front Image</p>
                      {selectedFarmer.aadhaarFront ? (
                        <a href={selectedFarmer.aadhaarFront} target="_blank" rel="noreferrer" className="block border border-white/10 rounded-lg overflow-hidden relative group">
                          <img src={selectedFarmer.aadhaarFront} alt="Front" className="w-full h-24 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <ExternalLink className="h-4 w-4 text-white" />
                          </div>
                        </a>
                      ) : <span className="text-xs text-stone-500 italic">Not Uploaded</span>}
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 font-bold uppercase mb-1">Back Image</p>
                      {selectedFarmer.aadhaarBack ? (
                        <a href={selectedFarmer.aadhaarBack} target="_blank" rel="noreferrer" className="block border border-white/10 rounded-lg overflow-hidden relative group">
                          <img src={selectedFarmer.aadhaarBack} alt="Back" className="w-full h-24 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <ExternalLink className="h-4 w-4 text-white" />
                          </div>
                        </a>
                      ) : <span className="text-xs text-stone-500 italic">Not Uploaded</span>}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Decision Controls */}
            {selectedFarmer.kycStatus === "Pending Verification" && (
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div>
                  <label className="text-xs text-stone-400 font-bold uppercase block mb-2">Rejection Reason (Required only if rejecting)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a clear reason if rejecting, e.g. Documents are blurry or incorrect."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition h-20 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleKycDecision(selectedFarmer.id, "REJECT")}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer"
                  >
                    Reject KYC
                  </button>
                  <button
                    onClick={() => handleKycDecision(selectedFarmer.id, "APPROVE")}
                    disabled={actionLoading}
                    className="bg-[#00d26a] hover:bg-[#00b25a] disabled:opacity-50 text-black font-extrabold px-6 py-3 rounded-xl transition cursor-pointer"
                  >
                    Approve KYC
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedFarmer(null)} 
                className="text-stone-400 hover:text-white transition font-medium cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user.role !== "ADMIN") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};
