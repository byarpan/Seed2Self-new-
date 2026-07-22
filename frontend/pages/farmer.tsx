import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Crop {
  id: string;
  name: string;
  quantity: number;
  harvestDate: string;
  currentOwner: { name: string; role: string };
  isListed: boolean;
  batchId?: string;
  price?: number | string;
}

interface Request {
  id: string;
  crop: Crop;
  sender: { id: string; name: string; role: string };
  receiver: { id: string; name: string; role: string };
  deliveryDate: string;
  quantity: number;
  status: string;
  ratings?: any[];
}

export default function FarmerDashboard({ user }: { user: any }) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [newCrop, setNewCrop] = useState({ name: "", quantity: "", price: "", harvestDate: "" });

  // Edit Mongoose crop states
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editHarvestDate, setEditHarvestDate] = useState("");

  const [blockchainLogs, setBlockchainLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchCrops();
    fetchRequests();
    fetchBlockchainLogs();
  }, []);

  const fetchBlockchainLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blockchain-logs");
      if (res.ok) {
        setBlockchainLogs(await res.json());
      }
    } catch (err) {
      console.error("Error fetching blockchain logs:", err);
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (res.ok) {
        const data = await res.json();
        const ownerId = user.farmerId || user.id;
        setCrops(data.filter((p: any) => p.currentOwnerId === ownerId).map((p: any) => ({
          id: p._id,
          batchId: p.batchId,
          name: p.cropName,
          quantity: p.quantity,
          price: p.pricePerUnit,
          harvestDate: p.harvestDate,
          isListed: p.status === "AVAILABLE",
          currentOwner: { name: user.name, role: "FARMER" }
        })));
      }
    } catch (err) {
      console.error("Error fetching MongoDB products:", err);
    }
  };

  const [incomingOrders, setIncomingOrders] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const sellerId = user.farmerId || user.id;
      const ordersRes = await fetch("http://localhost:5000/api/orders");
      const usersRes = await fetch("http://localhost:5000/api/users");
      const productsRes = await fetch("http://localhost:5000/api/products");
      
      if (ordersRes.ok && usersRes.ok && productsRes.ok) {
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        
        const filtered = ordersData.filter((o: any) => o.sellerId === sellerId);
        const mapped = filtered.map((o: any) => {
          const buyer = usersData.find((u: any) => u.farmerId === o.buyerId || u.processorId === o.buyerId || u.id === o.buyerId);
          const prod = productsData.find((p: any) => p._id === o.productId || p.batchId === o.batchId);
          return {
            id: o._id,
            orderId: o.orderId,
            buyerName: buyer ? buyer.name : "Unknown Buyer",
            cropName: prod ? prod.cropName : "Crop Batch",
            batchId: o.batchId,
            quantity: o.quantityPurchased,
            amount: o.amount,
            orderStatus: o.orderStatus,
            paymentStatus: o.paymentStatus,
            deliveryStatus: o.deliveryStatus
          };
        });
        setIncomingOrders(mapped);
      }
    } catch (err) {
      console.error("Error fetching incoming orders:", err);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/accept`, {
        method: "PUT"
      });
      fetchRequests();
      fetchBlockchainLogs();
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  const handleShipOrder = async (orderId: string) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/ship`, {
        method: "PUT"
      });
      fetchRequests();
      fetchBlockchainLogs();
    } catch (err) {
      console.error("Error shipping order:", err);
    }
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ownerId = user.farmerId || user.id;
      await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: newCrop.name,
          quantity: parseFloat(newCrop.quantity),
          unit: "kg",
          pricePerUnit: parseFloat(newCrop.price),
          harvestDate: newCrop.harvestDate,
          location: user.permanentAddress || "Farmer Farm Location",
          currentOwnerId: ownerId,
          currentOwnerRole: "FARMER",
          description: "Fresh harvest logged from dashboard"
        })
      });
      fetchCrops();
      fetchBlockchainLogs();
      setNewCrop({ name: "", quantity: "", price: "", harvestDate: "" });
    } catch (err) {
      console.error("Error creating crop on MongoDB:", err);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, userId: user.id })
    });
    fetchRequests();
    fetchCrops(); 
  };

  const submitRating = async (requestId: string, revieweeId: string, value: number) => {
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, reviewerId: user.id, revieweeId, requestId })
    });
    fetchRequests();
  };

  const toggleListing = async (cropId: string, currentStatus: boolean) => {
    try {
      await fetch(`http://localhost:5000/api/products/${cropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isListed: !currentStatus })
      });
      fetchCrops();
    } catch (err) {
      console.error("Error toggling listing status:", err);
    }
  };

  const handleStartEdit = (crop: any) => {
    setEditingCropId(crop.id);
    setEditName(crop.name);
    setEditQuantity(String(crop.quantity));
    setEditPrice(String(crop.price || 100));
    setEditHarvestDate(crop.harvestDate.split("T")[0]);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCropId) return;
    try {
      await fetch(`http://localhost:5000/api/products/${editingCropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: editName,
          quantity: parseFloat(editQuantity),
          pricePerUnit: parseFloat(editPrice),
          harvestDate: editHarvestDate
        })
      });
      setEditingCropId(null);
      fetchCrops();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE"
      });
      fetchCrops();
      fetchBlockchainLogs();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
          className="w-full h-full object-cover opacity-30"
          alt=""
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-green-400 drop-shadow-md">Farmer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Crop */}
          <div id="harvest-hub" className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10 transform hover:scale-[1.01] transition-all">
            <h2 className="text-2xl font-bold mb-6 text-green-300">Log New Harvest</h2>
            <form onSubmit={handleAddCrop} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Crop Name</label>
                <input type="text" value={newCrop.name} onChange={e => setNewCrop({...newCrop, name: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="e.g. Alphonso Mangoes" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Quantity (kg)</label>
                <input type="number" value={newCrop.quantity} onChange={e => setNewCrop({...newCrop, quantity: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Price per Unit (₹/kg)</label>
                <input type="number" value={newCrop.price} onChange={e => setNewCrop({...newCrop, price: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="e.g. 120" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Harvest Date</label>
                <input type="date" value={newCrop.harvestDate} onChange={e => setNewCrop({...newCrop, harvestDate: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-green-900/40">
                Log on Blockchain & Save
              </button>
            </form>
          </div>

          {/* My Crops */}
          <div id="inventory" className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-green-300">My Inventory</h2>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow max-h-[400px]">
              {crops.length === 0 ? (
                <p className="text-stone-400 italic">No crops logged yet.</p>
              ) : (
                <div className="space-y-4">
                  {crops.map(crop => (
                    <div key={crop.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-green-400 text-lg">{crop.name}</h3>
                          <span className="text-[10px] text-stone-500 font-mono">({crop.batchId})</span>
                        </div>
                        <p className="text-sm text-stone-300">{crop.quantity} kg • ₹{crop.price}/kg • Harvested: {new Date(crop.harvestDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold border ${crop.isListed ? 'bg-green-500/20 text-green-300 border-green-500/20' : 'bg-stone-500/20 text-stone-300 border-stone-500/20'}`}>
                          {crop.isListed ? 'Listed' : 'Unlisted'}
                        </span>
                        
                        <button 
                          onClick={() => handleStartEdit(crop)}
                          className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCrop(crop.id)}
                          className="text-xs bg-red-650/20 text-red-400 border border-red-500/20 hover:bg-red-600/40 px-2.5 py-1 rounded-lg transition"
                        >
                          Delete
                        </button>

                        {crop.quantity > 0 && (
                          <button 
                            onClick={() => toggleListing(crop.id, crop.isListed)}
                            className="text-xs bg-green-600/20 text-green-400 border border-green-500/20 hover:bg-[#00d26a]/30 px-3 py-1 rounded-lg transition"
                          >
                            {crop.isListed ? 'Take Down' : 'List Product'}
                          </button>
                        )}
                        {crop.quantity === 0 && (
                           <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full font-bold border border-red-500/20">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Incoming Requests */}
          <div id="orders" className="md:col-span-2 matte-glass p-8 rounded-3xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-green-300">Incoming Orders (Sales)</h2>
            {incomingOrders.length === 0 ? (
               <p className="text-stone-400 italic text-sm">No incoming orders yet.</p>
            ) : (
              <div className="space-y-5">
                {incomingOrders.map(order => (
                  <div key={order.orderId} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/10 transition-colors">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/20 px-2 py-0.5 rounded font-mono font-bold">{order.orderId}</span>
                        <span className="text-xs text-stone-500 font-mono">Batch: {order.batchId}</span>
                      </div>
                      <p className="text-lg font-medium text-stone-100 mt-2">
                        <span className="text-green-400 font-bold">{order.buyerName}</span> wants to buy <span className="font-bold text-white">{order.quantity} kg of {order.cropName}</span>
                      </p>
                      <div className="flex gap-4 mt-2">
                        <p className="text-sm text-stone-400">Total Amount: <span className="text-green-400 font-bold">₹{order.amount}</span></p>
                        <p className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          order.orderStatus === "PENDING" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
                          order.orderStatus === "ACCEPTED" ? "text-green-400 border-green-400/30 bg-green-400/10" :
                          "text-blue-400 border-blue-400/30 bg-blue-400/10"
                        }`}>
                          Order: {order.orderStatus === "PENDING" ? "PENDING ACCEPTANCE" : order.orderStatus}
                        </p>
                        <p className="text-xs text-stone-300 font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5">
                          Payment: {order.paymentStatus === "LOCKED" ? "PAYMENT LOCKED" : order.paymentStatus}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 shrink-0">
                      {order.orderStatus === "PENDING" && (
                        <button 
                          onClick={() => handleAcceptOrder(order.orderId)} 
                          className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-lg text-sm font-bold hover:bg-green-500 transition cursor-pointer"
                        >
                          Accept Order
                        </button>
                      )}
                      {order.orderStatus === "ACCEPTED" && order.deliveryStatus === "PENDING" && (
                        <button 
                          onClick={() => handleShipOrder(order.orderId)} 
                          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg text-sm font-bold hover:bg-blue-500 transition cursor-pointer"
                        >
                          Dispatch Shipment
                        </button>
                      )}
                      {order.deliveryStatus === "SHIPPED" && (
                        <p className="text-stone-400 text-sm italic py-2">✓ Shipped (Waiting for delivery confirmation)</p>
                      )}
                      {order.orderStatus === "COMPLETED" && (
                        <p className="text-[#00d26a] text-sm font-bold py-2 font-sans flex items-center gap-1">✓ Completed & Payment Released</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Shipments */}
          <div id="shipments" className="md:col-span-2 matte-glass p-8 rounded-3xl shadow-2xl border border-white/10 mt-4">
            <h2 className="text-2xl font-bold mb-6 text-green-300">Active Shipments & Logistics</h2>
            <div className="space-y-4">
              {incomingOrders.filter(o => o.orderStatus === 'ACCEPTED' || o.deliveryStatus === 'SHIPPED').length === 0 ? (
                <p className="text-stone-400 italic text-sm">No active shipments at the moment.</p>
              ) : (
                incomingOrders.filter(o => o.orderStatus === 'ACCEPTED' || o.deliveryStatus === 'SHIPPED').map(order => (
                  <div key={order.orderId} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-lg">Batch #{order.batchId}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                          order.deliveryStatus === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {order.deliveryStatus === 'SHIPPED' ? 'In Transit' : 'Accepted - Preparing Dispatch'}
                        </span>
                      </div>
                      <p className="text-sm text-stone-400 mt-1">Buyer: {order.buyerName} ({order.quantity} kg)</p>
                      <p className="text-xs text-stone-500 mt-1">Status: Escrow Payment Locked</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-xs text-stone-300">Amount: ₹{order.amount}</span>
                      <div className="w-48 bg-stone-850 h-2 rounded-full overflow-hidden mt-2">
                        <div className={`h-full ${order.deliveryStatus === 'SHIPPED' ? 'bg-blue-500 w-[65%]' : 'bg-yellow-500 w-[20%]'}`}></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Blockchain Transactions */}
          <div id="transactions" className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10 mt-4">
            <h2 className="text-2xl font-bold mb-6 text-green-300">On-Chain Transactions</h2>
            <div className="space-y-3 font-mono text-xs max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {blockchainLogs.filter((log: any) => crops.some(c => c.batchId === log.batchId) || incomingOrders.some(o => o.batchId === log.batchId)).length === 0 ? (
                <p className="text-stone-400 italic text-sm">No on-chain records logged yet.</p>
              ) : (
                blockchainLogs.filter((log: any) => crops.some(c => c.batchId === log.batchId) || incomingOrders.some(o => o.batchId === log.batchId)).slice(0, 10).map((log: any, idx: number) => (
                  <div key={log._id || idx} className="p-3 bg-black/30 rounded-xl border border-white/5 hover:border-white/10 transition">
                    <div className="flex justify-between text-stone-300">
                      <span className="text-[#00d26a] font-bold">✓ {log.action}</span>
                      <span className="text-[10px] text-stone-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-stone-500 mt-1 truncate">Tx: {log.transactionHash}</p>
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                      <span>Block: #{log.blockNumber || "Pending"}</span>
                      <span>Batch: {log.batchId}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reports & Analytics */}
          <div id="reports" className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10 mt-4">
            <h2 className="text-2xl font-bold mb-6 text-green-300">Earnings & Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-stone-400">Total Produce Sold</p>
                <p className="text-2xl font-extrabold text-white mt-1">
                  {incomingOrders.filter(o => o.orderStatus === 'COMPLETED').reduce((acc, o) => acc + o.quantity, 0)} kg
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-stone-400">Total Revenue</p>
                <p className="text-2xl font-extrabold text-[#00d26a] mt-1">
                  ₹{incomingOrders.filter(o => o.orderStatus === 'COMPLETED').reduce((acc, o) => acc + o.amount, 0)}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-stone-400">Escrow Locked</p>
                <p className="text-2xl font-extrabold text-yellow-500 mt-1">
                  ₹{incomingOrders.filter(o => o.orderStatus === 'ACCEPTED' || o.paymentStatus === 'LOCKED').reduce((acc, o) => acc + o.amount, 0)}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-stone-400">Dispute Rate</p>
                <p className="text-2xl font-extrabold text-red-400 mt-1">0.0%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Crop Dialog Modal */}
      {editingCropId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#141415] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-white font-sans">
            <h3 className="text-xl font-bold text-green-300">Edit Harvest Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 font-bold uppercase mb-1">Crop Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500" 
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 font-bold uppercase mb-1">Quantity (kg)</label>
                <input 
                  type="number" 
                  value={editQuantity} 
                  onChange={e => setEditQuantity(e.target.value)} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500" 
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 font-bold uppercase mb-1">Price per Unit (₹/kg)</label>
                <input 
                  type="number" 
                  value={editPrice} 
                  onChange={e => setEditPrice(e.target.value)} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500" 
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 font-bold uppercase mb-1">Harvest Date</label>
                <input 
                  type="date" 
                  value={editHarvestDate} 
                  onChange={e => setEditHarvestDate(e.target.value)} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500" 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setEditingCropId(null)}
                  className="bg-white/5 hover:bg-white/10 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#00d26a] hover:bg-[#00b25a] text-black font-extrabold px-6 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user?.role !== "FARMER") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
};
