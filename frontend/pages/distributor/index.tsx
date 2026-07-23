import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import Head from "next/head";

interface Crop {
  id: string;
  name: string;
  quantity: number;
  farmerId: string;
  farmer: { name: string };
  currentOwnerId: string;
  currentOwner?: { role: string };
  isListed: boolean;
}

interface Request {
  id: string;
  crop: Crop;
  sender: { id: string; name: string; role: string };
  receiver: { id: string; name: string; role: string };
  status: string;
  quantity: number;
  deliveryDate: string;
  ratings?: any[];
}

export default function DistributorDashboard({ user }: { user: any }) {
  const [myInventory, setMyInventory] = useState<Crop[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ownerId = user.distributorId || user.id;

      // 1. Fetch Distributor Inventory from MongoDB
      const cropsRes = await fetch("http://localhost:5000/api/products");
      if (cropsRes.ok) {
        const allCrops = await cropsRes.json();
        const filteredCrops = allCrops.filter((p: any) => p.currentOwnerId === ownerId);
        setMyInventory(filteredCrops.map((p: any) => ({
          id: p._id,
          batchId: p.batchId,
          name: p.cropName,
          quantity: p.quantity,
          isListed: p.status === "AVAILABLE"
        })));
      }

      // 2. Fetch Orders for Escrow/Shipment Tracking
      const ordersRes = await fetch("http://localhost:5000/api/orders");
      const usersRes = await fetch("http://localhost:5000/api/users");
      const productsRes = await fetch("http://localhost:5000/api/products");

      if (ordersRes.ok && usersRes.ok && productsRes.ok) {
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        const productsData = await productsRes.json();

        const mapped = ordersData.map((o: any) => {
          const buyer = usersData.find((u: any) => u.farmerId === o.buyerId || u.processorId === o.buyerId || u.id === o.buyerId);
          const seller = usersData.find((u: any) => u.farmerId === o.sellerId || u.processorId === o.sellerId || u.id === o.sellerId);
          const prod = productsData.find((p: any) => p._id === o.productId || p.batchId === o.batchId);
          return {
            id: o._id,
            orderId: o.orderId,
            buyerId: o.buyerId,
            buyerName: buyer ? buyer.name : "Buyer",
            sellerId: o.sellerId,
            sellerName: seller ? seller.name : "Seller",
            cropName: prod ? prod.cropName : "Crop Batch",
            batchId: o.batchId,
            quantity: o.quantityPurchased,
            amount: o.amount,
            orderStatus: o.orderStatus,
            paymentStatus: o.paymentStatus,
            deliveryStatus: o.deliveryStatus
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Error fetching distributor data:", err);
    }
  };

  const handleConfirmDelivery = async (orderId: string) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/confirm-delivery`, {
        method: "PUT"
      });
      fetchData();
    } catch (err) {
      console.error("Error confirming delivery:", err);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/accept`, {
        method: "PUT"
      });
      fetchData();
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  const toggleListing = async (cropId: string, currentStatus: boolean) => {
    try {
      await fetch(`http://localhost:5000/api/products/${cropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isListed: !currentStatus })
      });
      fetchData();
    } catch (err) {
      console.error("Error toggling product listing:", err);
    }
  };

  return (
    <div className="min-h-screen relative text-white">
      <Head>
        <title>Distributor Dashboard | Seed2Shelf</title>
      </Head>


      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-green-400 drop-shadow-md">Distributor Logistics Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* My Inventory */}
          <div className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-green-300">Goods in Transit / Warehouse</h2>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow max-h-[400px]">
              {myInventory.length === 0 ? (
                <p className="text-stone-400 italic">You don't own any batches yet.</p>
              ) : (
                <div className="space-y-4">
                  {myInventory.map(crop => (
                    <div key={crop.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-green-400 text-lg">{crop.name}</h3>
                          <p className="text-sm text-stone-300">Qty: {crop.quantity} kg</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold border ${crop.isListed ? 'bg-green-500/20 text-green-300 border-green-500/20' : 'bg-stone-500/20 text-stone-300 border-stone-500/20'}`}>
                          {crop.isListed ? 'Listed' : 'Unlisted'}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        {crop.quantity > 0 && (
                          <button 
                            onClick={() => toggleListing(crop.id, crop.isListed)}
                            className="w-full bg-stone-100/10 hover:bg-stone-100/20 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg"
                          >
                            {crop.isListed ? 'Take Down from Marketplace' : 'List on Marketplace'}
                          </button>
                        )}
                        {crop.quantity === 0 && (
                           <span className="block text-center text-xs bg-red-500/20 text-red-300 px-3 py-2 rounded-xl font-bold border border-red-500/20">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transfer Requests */}
          <div className="flex flex-col gap-8">
            {/* Incoming Orders */}
            <div className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-green-300">Incoming Orders (Sales)</h2>
              {orders.filter(o => o.sellerId === (user.distributorId || user.id)).length === 0 ? (
                <p className="text-stone-400 italic text-sm">No incoming orders yet.</p>
              ) : (
                <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                  {orders.filter(o => o.sellerId === (user.distributorId || user.id)).map(order => (
                    <div key={order.orderId} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                      <p className="text-lg font-medium text-stone-100 mb-2">
                        <span className="text-green-400 font-bold">{order.buyerName}</span> wants to buy <span className="font-bold text-white">{order.quantity} kg of {order.cropName}</span>
                      </p>
                      <div className="flex gap-4 mb-4">
                        <p className="text-xs font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5">
                          Amount: ₹{order.amount}
                        </p>
                        <p className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          order.orderStatus === "PENDING" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
                          order.orderStatus === "ACCEPTED" ? "text-green-400 border-green-400/30 bg-green-400/10" :
                          "text-blue-400 border-blue-400/30 bg-blue-400/10"
                        }`}>
                          Order: {order.orderStatus === "PENDING" ? "PENDING ACCEPTANCE" : order.orderStatus}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        {order.orderStatus === "PENDING" && (
                          <button 
                            onClick={() => handleAcceptOrder(order.orderId)} 
                            className="w-full py-2 bg-green-600 text-white rounded-xl shadow-lg text-sm font-bold hover:bg-green-500 transition cursor-pointer"
                          >
                            Accept Order
                          </button>
                        )}
                        {order.orderStatus === "ACCEPTED" && (
                          <p className="text-stone-400 text-sm italic py-2">✓ Order Accepted (Awaiting shipping/confirm)</p>
                        )}
                        {order.orderStatus === "COMPLETED" && (
                          <p className="text-[#00d26a] text-sm font-bold py-2">✓ Completed & Payment Released</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing Orders */}
            <div className="matte-glass p-8 rounded-3xl shadow-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-green-300">My Purchases (Outbound)</h2>
              {orders.filter(o => o.buyerId === (user.distributorId || user.id)).length === 0 ? (
                <p className="text-stone-400 italic text-sm">No active purchases.</p>
              ) : (
                <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                  {orders.filter(o => o.buyerId === (user.distributorId || user.id)).map(order => (
                    <div key={order.orderId} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                      <p className="text-lg font-medium text-stone-100 mb-2">
                        You requested to buy <span className="font-bold text-white">{order.quantity} kg of {order.cropName}</span> from <span className="text-green-400 font-bold">{order.sellerName}</span>
                      </p>
                      <div className="flex gap-4 mb-4 flex-wrap">
                        <p className="text-xs font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5">
                          Amount: ₹{order.amount}
                        </p>
                        <p className="text-xs text-stone-300 font-mono bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                          Batch: {order.batchId}
                        </p>
                        <p className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          order.orderStatus === "PENDING" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
                          order.orderStatus === "ACCEPTED" ? "text-green-400 border-green-400/30 bg-green-400/10" :
                          "text-blue-400 border-blue-400/30 bg-blue-400/10"
                        }`}>
                          Order: {order.orderStatus === "PENDING" ? "PENDING ACCEPTANCE" : order.orderStatus}
                        </p>
                        <p className="text-xs text-stone-300 font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5">
                          Delivery: {order.deliveryStatus}
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        {order.orderStatus === "PENDING" && (
                          <p className="text-stone-400 text-sm italic py-2">Waiting for seller to accept...</p>
                        )}
                        {order.orderStatus === "ACCEPTED" && order.deliveryStatus === "PENDING" && (
                          <p className="text-stone-400 text-sm italic py-2">Waiting for seller to dispatch shipment...</p>
                        )}
                        {order.deliveryStatus === "SHIPPED" && (
                          <button 
                            onClick={() => handleConfirmDelivery(order.orderId)} 
                            className="w-full py-2 bg-blue-600 text-white rounded-xl shadow-lg text-sm font-bold hover:bg-blue-500 transition cursor-pointer"
                          >
                            Confirm Delivery
                          </button>
                        )}
                        {order.orderStatus === "COMPLETED" && (
                          <p className="text-[#00d26a] text-sm font-bold py-2">✓ Delivered & Escrow Payment Released</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user?.role !== "DISTRIBUTOR") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: JSON.parse(JSON.stringify(session.user)) } };
};
