import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sprout, 
  Package, 
  ArrowLeft, 
  Info, 
  GitBranch, 
  Clock, 
  User, 
  MapPin, 
  Activity, 
  FileText
} from "lucide-react";

export default function TraceBatch() {
  const [batchId, setBatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [traceData, setTraceData] = useState<any>(null);

  const fetchTrace = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setTraceData(null);
    try {
      const res = await fetch(`http://localhost:5000/api/trace/${id.trim()}`);
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to locate batch traceability records.");
      }
      const data = await res.json();
      setTraceData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to connect to the traceability server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrace(batchId);
  };

  // Helper to get owner styling classes
  const getRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
      case "FARMER":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "PROCESSOR":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "DISTRIBUTOR":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "RETAILER":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-stone-500/10 text-stone-400 border-stone-500/20";
    }
  };

  // Helper to map log actions to friendly labels and tags
  const getActionBadge = (action: string) => {
    switch (action) {
      case "BATCH_CREATED":
        return { label: "Batch Created", style: "bg-green-500/10 text-green-400" };
      case "PAYMENT_LOCKED":
        return { label: "Escrow Locked", style: "bg-amber-500/10 text-amber-400" };
      case "OWNERSHIP_TRANSFERRED":
        return { label: "Transferred", style: "bg-blue-500/10 text-blue-400" };
      case "PAYMENT_RELEASED":
        return { label: "Escrow Cleared", style: "bg-emerald-500/10 text-emerald-400" };
      case "PROCESSING_COMPLETED":
        return { label: "Processed", style: "bg-purple-500/10 text-purple-400" };
      case "BATCH_SPLIT":
        return { label: "Batch Split", style: "bg-cyan-500/10 text-cyan-400" };
      case "BATCH_MERGED":
        return { label: "Batch Merged", style: "bg-indigo-500/10 text-indigo-400" };
      default:
        return { label: action, style: "bg-stone-500/10 text-stone-400" };
    }
  };

  /* ==========================================================================
     RECURSIVE TREE NODE RENDERING COMPONENT
     ========================================================================== */
  const TreeNode = ({ node }: { node: any }) => {
    if (!node) return null;

    return (
      <div className="flex flex-col items-center">
        {/* Node Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-xl text-left max-w-sm w-[300px] sm:w-[320px] space-y-3 hover:border-[#00d26a] transition-all hover:scale-[1.02] duration-300 relative group overflow-hidden"
        >
          {/* Subtle background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d26a]/0 via-transparent to-[#00d26a]/5 group-hover:from-[#00d26a]/5 transition-all duration-300" />
          
          <div className="flex justify-between items-start relative z-10">
            <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border ${getRoleBadge(node.currentOwnerRole)}`}>
              {node.currentOwnerRole}
            </span>
            <span className="font-mono text-[10px] text-stone-500 select-all font-bold">{node.batchId}</span>
          </div>

          <div className="space-y-1 relative z-10">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Package className="h-4 w-4 text-[#00d26a] shrink-0" />
              {node.cropName}
            </h4>
            <p className="text-xs text-stone-300 font-bold">Quantity: {node.quantity} {node.unit}</p>
            <p className="text-[10px] text-stone-400 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-stone-500 shrink-0" />
              {node.location}
            </p>
          </div>

          <div className="pt-2.5 mt-2.5 border-t border-white/5 text-[10px] space-y-1 relative z-10 text-stone-400">
            <p className="flex items-center gap-1">
              <User className="h-3 w-3 text-stone-500 shrink-0" />
              Owner: <span className="font-bold text-stone-300">{node.currentOwnerName}</span>
            </p>
            {node.harvestDate && (
              <p className="flex items-center gap-1 text-[9px] text-stone-500">
                <Clock className="h-3 w-3 shrink-0" />
                Date: {new Date(node.harvestDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>

        {/* Connectors & Parents */}
        {node.parents && node.parents.length > 0 && (
          <div className="w-full flex flex-col items-center mt-8 relative">
            {/* Vertical line from child card to horizontal fork */}
            <div className="w-[2px] h-8 bg-gradient-to-b from-[#00d26a] to-white/10" />

            {/* Horizontal bridge line for merges */}
            {node.parents.length > 1 && (
              <div className="absolute top-8 left-1/4 right-1/4 h-[2px] bg-white/10 rounded-full" />
            )}

            {/* Parent nodes container */}
            <div className="flex flex-row justify-center gap-10 sm:gap-16 mt-2 items-start flex-wrap">
              {node.parents.map((parent: any) => (
                <TreeNode key={parent.batchId} node={parent} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen text-white pt-24 pb-20 relative bg-cover bg-center bg-fixed font-sans"
      style={{ backgroundImage: "url('/images/bg.png')" }}
    >
      <div className="absolute inset-0 bg-[#0c0c0d]/95 backdrop-blur-[5px]"></div>

      <Head>
        <title>Batch Traceability Tree | Seed2Shelf</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#00d26a] font-black mb-1">Decentralized Lineage Verification</p>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-[#00d26a]" />
              Traceability Tree Visualizer
            </h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Recursively track processing splits, mergers, and ownership changes to find the harvest origins of any batch.
            </p>
          </div>
          <Link 
            href="/buy" 
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exchange
          </Link>
        </div>

        {/* Input & Testing Cards Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider">Search Batch ID</h3>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-stone-500" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. BATCH2026000004"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-[#00d26a] transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#00d26a] hover:bg-[#00b25a] disabled:opacity-50 text-black font-black px-8 rounded-2xl text-sm transition shadow-lg flex items-center justify-center cursor-pointer"
              >
                {loading ? "Querying..." : "Trace Product"}
              </button>
            </form>

            {/* Test buttons helper */}
            <div className="space-y-2.5">
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Quick Trace Demo Seeds:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "BATCH2026000001", label: "Farmer A Alphonso Mangoes" },
                  { id: "BATCH2026000002", label: "Farmer B Alphonso Mangoes" },
                  { id: "BATCH2026000003", label: "Processor Mango Pulp (Merged)" },
                  { id: "BATCH2026000004", label: "Distributor Pulp (Split)" },
                  { id: "BATCH2026000005", label: "Retailer Jars (Split)" }
                ].map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      setBatchId(demo.id);
                      fetchTrace(demo.id);
                    }}
                    className="bg-white/5 hover:bg-white/10 hover:border-white/20 border border-white/5 px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-white font-bold transition flex flex-col items-start gap-0.5 cursor-pointer text-left"
                  >
                    <span className="text-[9px] text-[#00d26a] font-mono font-black">{demo.id}</span>
                    <span>{demo.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="h-4 w-4 text-[#00d26a]" />
              How Traceability Works
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Whenever crops are processed, packaged, split, or merged:
            </p>
            <ul className="text-xs text-stone-400 space-y-2 list-disc list-inside">
              <li>A new unique <b>Batch ID</b> is issued automatically.</li>
              <li>The new batch records list the predecessor <b>Parent Batch IDs</b> in an array.</li>
              <li>A digital ledger log verifies actions on-chain.</li>
              <li>Scanning a retail batch recursively traverses parents to track ingredients back to the original farmers.</li>
            </ul>
          </div>
        </div>

        {/* Tree visualizer container */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl text-sm font-bold text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center py-24 space-y-4"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d26a]"></div>
              <p className="text-sm text-stone-500 font-bold uppercase tracking-wider">Retrieving Blockchain Lineage...</p>
            </motion.div>
          )}

          {traceData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-stretch"
            >
              {/* Recursive Tree Diagram Grid Area */}
              <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl xl:col-span-3 overflow-x-auto shadow-inner relative flex justify-center items-start min-h-[500px]">
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-stone-500 font-bold uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                  <Activity className="h-3.5 w-3.5 text-[#00d26a]" />
                  Lineage Map (Harvest Origin at Bottom)
                </div>
                <div className="pt-12 w-full flex justify-center">
                  <TreeNode node={traceData} />
                </div>
              </div>

              {/* Blockchain Ledgers Logs Timeline */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-[#00d26a]" />
                    Blockchain Logs
                  </h3>
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                    {traceData.logs && traceData.logs.length > 0 ? (
                      traceData.logs.map((log: any, index: number) => {
                        const actionInfo = getActionBadge(log.action);
                        return (
                          <div key={log._id || index} className="relative pl-5 border-l border-white/10 last:border-transparent pb-3 space-y-1">
                            <span className="absolute left-0 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00d26a]" />
                            <div className="flex justify-between items-start">
                              <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${actionInfo.style}`}>
                                {actionInfo.label}
                              </span>
                              <span className="text-[9px] text-stone-500 font-mono font-bold">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-400 break-all font-mono leading-relaxed">
                              Tx Hash: <span className="text-stone-500 font-bold">{log.transactionHash}</span>
                            </p>
                            <p className="text-[9px] text-stone-500">
                              By: <span className="font-bold">{log.performedBy}</span>
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-stone-500 text-center py-10 font-bold">No blockchain ledger logs generated for this batch.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Active Batch:</span>
                    <span className="font-mono font-bold text-white text-[10px]">{traceData.batchId}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Total Predecessors:</span>
                    <span className="font-bold text-[#00d26a]">{traceData.parentBatchIds ? traceData.parentBatchIds.length : 0} parents</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
