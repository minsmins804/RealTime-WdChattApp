import { useChatStore } from "../store/UseChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/UseAuthStore";
import { formatMessageTime } from ".././lib/utils";

const ChatContainer = () => {
    const {
        messages,
        setMessages,
        isMessagesLoading,
        selectedUser,
    } = useChatStore();
    const { AuthUser, socket } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
    if (!socket || !selectedUser) return;

    const handler = (message) => {
        const { senderId, receiverId } = message;
        const isRelevant =
        senderId === selectedUser._id || receiverId === selectedUser._id;

        if (isRelevant) {
        setMessages((prev) => [...prev, message]);
        }
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);

    }, [socket, selectedUser, setMessages]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${
                            message.senderId === AuthUser._id ? "chat-end" : "chat-start"
                        }`}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === AuthUser._id
                                            ? AuthUser.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {Array.isArray(message.images) && message.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {message.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`img-${index}`}
                                        className="max-w-[200px] rounded-md"
                                    />
                                    ))}
                                </div>
                            )}

                            {!message.images && message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
