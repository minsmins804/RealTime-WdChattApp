import { useRef, useState } from "react";
import { useChatStore } from "../store/UseChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = [];
        files.forEach((file) => {
            if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
            }        

            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);

                if (newPreviews.length === files.length) {
                    setImagePreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (isSending) return; // Prevent multiple submissions
        if (!text.trim() && !imagePreviews) return;

        try {
            setIsSending(true);
            await sendMessage({
                text: text.trim(),
                images: imagePreviews,
            });

            // Clear form
            setText("");
            setImagePreviews([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false); 
        }
    };

    return (
        <div className="p-4 w-full">
        {imagePreviews.length > 0 && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
            {imagePreviews.map((img, index) => (
            <div key={index} className="relative">
                <img
                src={img}
                alt={`preview-${index}`}
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
                <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                    flex items-center justify-center"
                >
                <X className="size-3" />
                </button>
            </div>
            ))}
        </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
            <input
                type="text"
                className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSending}
            />
            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
            />

            <button
                type="button"
                className={`hidden sm:flex btn btn-circle
                        ${imagePreviews ? "text-emerald-500" : "text-zinc-400"}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <Image size={20} />
            </button>
            </div>
            <button
            type="submit"
            className={`btn btn-sm btn-circle ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSending || (!text.trim() && !imagePreviews)}
            >
            <Send size={22} />
            </button>
        </form>
        </div>
    );
};
export default MessageInput;