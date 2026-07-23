import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { notificationService } from "@/services/notification";

export default function ChatAndNotifications() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [activeChatUserName, setActiveChatUserName] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations (Inbox)
  useEffect(() => {
    if (!session?.user?.id || !isOpen || activeChatUserId) return;
    
    const fetchInbox = async () => {
      try {
        const data = await notificationService.getInbox(session.user.id);
        setConversations(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInbox();
    const interval = setInterval(fetchInbox, 10000);
    return () => clearInterval(interval);
  }, [session?.user?.id, isOpen, activeChatUserId]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!session?.user?.id || !activeChatUserId) return;

    const fetchMsg = async () => {
      try {
        const data = await notificationService.getMessages(session.user.id, activeChatUserId);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMsg();
    const interval = setInterval(fetchMsg, 3000);
    return () => clearInterval(interval);
  }, [session?.user?.id, activeChatUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user?.id || !activeChatUserId) return;

    try {
      const sent = await notificationService.sendMessage(session.user.id, activeChatUserId, newMessage);
      setMessages((prev) => [...prev, sent]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00d26a] hover:bg-[#00b25a] text-black font-extrabold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-xs">Chat & Messages</span>
      </button>

      {/* Drawer Container */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#141415] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-96 overflow-hidden text-white font-sans">
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-sm text-green-300">
              {activeChatUserId ? `Chat with ${activeChatUserName}` : "Messages & Inbox"}
            </h3>
            <div className="flex gap-2">
              {activeChatUserId && (
                <button
                  onClick={() => { setActiveChatUserId(null); setActiveChatUserName(null); }}
                  className="text-xs text-stone-400 hover:text-white"
                >
                  ← Back
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>
          </div>

          {/* Inbox View */}
          {!activeChatUserId && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.length === 0 ? (
                <p className="text-stone-400 text-xs italic text-center py-8">No conversations yet.</p>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.otherUser.id}
                    onClick={() => { setActiveChatUserId(c.otherUser.id); setActiveChatUserName(c.otherUser.name); }}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition border border-white/5 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-xs text-white">{c.otherUser.name}</p>
                      <p className="text-[10px] text-stone-400 truncate max-w-[200px]">{c.lastMessage.content}</p>
                    </div>
                    <span className="text-[9px] text-stone-500">{new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Chat Messages View */}
          {activeChatUserId && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMe = m.senderId === session?.user?.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${isMe ? "bg-[#00d26a] text-black font-medium" : "bg-white/10 text-white"}`}>
                        <p>{m.content}</p>
                        <span className={`block text-[8px] mt-1 ${isMe ? "text-stone-800" : "text-stone-400"}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
                />
                <button type="submit" className="bg-[#00d26a] text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#00b25a] transition">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
