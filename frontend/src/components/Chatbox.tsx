import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import api from "../api";
import { socket } from "../socket";
import MarkdownMessage from "./MarkdownMessage";

interface Message {
  _id: string;
  content: string;
  sender: "user" | "model" | "system";
}

export default function Chatbox() {
  const { activeChatId, setActiveChat } = useChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages or streaming updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Handle incoming socket messages
  useEffect(() => {
    const handleReceive = (ans: any) => {
      if (ans.chunk) {
        // Build streaming message progressively
        setStreamingMessage((prev) => {
          if (!prev) {
            return {
              _id: ans._id ?? Date.now().toString(),
              content: ans.chunk,
              sender: "model",
            };
          }
          return { ...prev, content: prev.content + ans.chunk };
        });
      } else {
        // Final message received
        setStreamingMessage(null);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            _id: ans._id ?? Date.now().toString(),
            content: ans.content ?? ans,
            sender: ans.sender ?? "model",
          },
        ]);
      }
    };

    socket.on("receive", handleReceive);

    return () => {
      socket.off("receive", handleReceive);
    };
  }, []);

  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    socket.emit("join", { room: activeChatId });

    const fetchMessages = async () => {
      try {
        const { data } = await api.get<{ messages?: Message[] }>(
          `/messages?id=${activeChatId}`
        );

        setMessages(
          (data.messages ?? []).map((msg) => ({
            _id: msg._id,
            content: msg.content,
            sender: msg.sender,
          }))
        );
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();

    return () => {
      socket.emit("leave", { room: activeChatId });
    };
  }, [activeChatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { _id: Date.now().toString(), content: input, sender: "user" },
    ]);

    setInput("");
    setIsTyping(true); // show typing immediately

    let room = activeChatId;
    if (!activeChatId) {
      const { data } = await api.post("/chats/create");
      room = data.chat._id;
      setActiveChat(room);
      socket.emit("join", { room });
      setTimeout(() => {
        socket.emit("change", { room });
      }, 1500);
    }

    socket.emit("send", { room, content: input });
  };

  return (
    <div className="relative w-3/4 flex flex-col">
      {/* Messages / Greeting area */}
      <div className="h-screen flex flex-col items-center justify-start overflow-y-auto p-5 space-y-4 bg-gray-50 pb-32 w-full">
        {!activeChatId && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold mb-3">
              Welcome to Your AI Assistant
            </h1>
            <p className="text-gray-600 text-lg">
              Type a message below or select a chat from the sidebar to get
              started.
            </p>
          </div>
        ) : messages.length === 0 && !isTyping ? (
          <div className="text-gray-400 text-center mt-10">
            Start the conversation...
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={msg._id ?? `${msg.sender}-${index}-${Date.now()}`}
                className={`w-[77%] rounded-lg p-5 my-3 
                  ${msg.sender === "user" ? "bg-amber-300" : "bg-white"}
                  shadow-sm border
                `}
              >
                {msg.sender === "model" ? (
                  <MarkdownMessage content={msg.content} />
                ) : (
                  <div className="text-black whitespace-pre-wrap">
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {/* Streaming message */}
            {streamingMessage && (
              <div className="w-[77%] rounded-lg p-5 my-3 bg-white shadow-sm border italic text-gray-500">
                <MarkdownMessage content={streamingMessage.content} />
                <span className="animate-pulse">|</span>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && !streamingMessage && (
              <div className="w-[77%] rounded-lg p-5 my-3 bg-white shadow-sm border italic text-gray-500">
                AI is typing<span className="animate-pulse">...</span>
              </div>
            )}

            {/* Dummy div to scroll to */}
            <div ref={messagesEndRef}></div>
          </>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center justify-between w-1/2 border-2 border-black p-2 rounded-full absolute z-10 bottom-5 left-1/2 -translate-x-1/2 bg-white">
        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="w-full focus:border-0 focus:outline-none ml-4"
        />
        <input
          type="button"
          value="send"
          onClick={sendMessage}
          className="py-2.5 px-4 rounded-full cursor-pointer bg-black text-white"
        />
      </div>
    </div>
  );
}
