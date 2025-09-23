import api from "../api";
import { useState, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { socket } from "../socket";

interface Chat {
  _id: string;
  user: string;
  name: string;
}

interface User {
  username: string;
}

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);

  const { chats, activeChatId, setChats, addChat, setActiveChat } =
    useChatStore();

  const getChats = async () => {
    const { data } = await api.get<{ chats: Chat[] }>("/chats/get-chats");
    setChats(data.chats);
  };

  useEffect(() => {
    getChats();
    const handleUpdate = () => {
      getChats();
    };

    socket.on("update", handleUpdate);
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [activeChatId]);

  const createChat = async () => {
    const { data } = await api.post(`/chats/create`);
    addChat(data.chat);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const changeChat = (id: string) => {
    if (activeChatId) {
      socket.emit("leaveRoom", { room: activeChatId });
    }
    setActiveChat(id);
    socket.emit("join", { room: id });
  };

  return (
    <div className="w-1/4 border-r-2 border-r-gray-300 flex flex-col items-center justify-between p-5 h-screen">
      <div className="w-full flex items-center justify-center">
        <button
          className="bg-black w-full text-white py-2 rounded-4xl"
          onClick={createChat}
        >
          New Chat
        </button>
      </div>

      <div className="h-[83%] w-full overflow-y-auto mt-5">
        <p className="mb-5">chats</p>
        {chats.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No chats yet</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 cursor-pointer rounded-lg mb-1
              ${
                activeChatId === chat._id
                  ? "border border-dashed border-gray-400 bg-gray-50"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => changeChat(chat._id)}
            >
              {chat.name}
            </div>
          ))
        )}
      </div>

      {/* User island */}
      <div className="flex items-center justify-start w-full border-2 border-black rounded-full p-3">
        <div>
          <img
            className="h-10 object-cover rounded-full"
            src="https://images.unsplash.com/photo-1658227387870-6b7d4d6ff031?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="userprofile"
          />
        </div>
        <div className="flex items-center justify-between w-[80%] ml-4">
          <div>{user?.username ?? "Guest"}</div>
          <button className="text-red-500" onClick={logout}>
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
