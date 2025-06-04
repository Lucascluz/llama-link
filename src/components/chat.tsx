import { Channel, invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"; // Updated import
import { cn } from "@/lib/utils"; // For conditional class names

interface ChatMessage {
    role: string;
    content: string;
}

interface ChatResponse {
    message: string;
}

function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const fetchedModels = await invoke("get_models");
                if (Array.isArray(fetchedModels)) {
                    setModels(fetchedModels);
                    if (fetchedModels.length > 0) {
                        setSelectedModel(fetchedModels[0]);
                    } else {
                        console.warn("No models available");
                    }
                } else {
                    console.error("Expected an array of models, but received:", fetchedModels);
                }
            }
            catch (error) {
                console.error("Error fetching models:", error);
            }
        };
        fetchModels();
    }, []);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedModel) return;

        const userMessage: ChatMessage = {
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        const channel = new Channel<ChatResponse>();
        let assistantMessageId: number | null = null;

        channel.onmessage = (data: ChatResponse) => {
            const messageContent = data.message;
            setMessages(prev => {
                // Check if the last message is from the assistant and part of the current stream
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === "assistant" && assistantMessageId !== null && prev.length - 1 === assistantMessageId) {
                    // Append to existing assistant message
                    const updatedMessages = [...prev];
                    updatedMessages[prev.length - 1] = { ...lastMsg, content: lastMsg.content + messageContent };
                    return updatedMessages;
                } else {
                    // Add new assistant message
                    assistantMessageId = prev.length; // Store the index of this new message
                    return [...prev, { role: "assistant", content: messageContent }];
                }
            });
        }
        try {
            // Pass the user message along with previous messages for context
            await invoke("chat", {
                request: {
                    model: selectedModel,
                    // Send all messages up to and including the new user message
                    messages: [...messages, userMessage],
                },
                onStream: channel,
            });
        } catch (error) {
            console.error("Error sending chat message:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Error: " + (error instanceof Error ? error.message : String(error)) }]);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handleSelectChange = (value: string) => {
        setSelectedModel(value);
        setMessages([]); // Clear messages when model changes
    }

    return (
        <Card className="max-w-3xl w-full h-[calc(100vh-10rem)] mx-auto shadow-xl flex flex-col bg-[var(--card)] text-[var(--card-foreground)]">
            <CardHeader className="border-b border-[var(--border)] p-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Llama Link Chat</CardTitle>
                    <Select value={selectedModel} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-[180px] bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]">
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        {models.length > 0 && (
                            <SelectContent className="bg-[var(--popover)] text-[var(--popover-foreground)] border-[var(--border)]">
                                {models.map((model) => (
                                    <SelectItem key={model} value={model} className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">
                                        {model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        )}
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    {messages.length > 0 ? messages.map((msg, index) => (
                        <div key={index} className={cn(
                            "mb-3 flex",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}>
                            <div className={cn(
                                "p-3 rounded-lg max-w-[70%]",
                                msg.role === "user" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                            )}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M12 18H12.01" /><path d="M12 10a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z" /></svg>
                            <h2 className="text-2xl font-semibold">Ask anything!</h2>
                            <p>Select a model from the dropdown above and start your conversation.</p>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
                <form onSubmit={sendMessage} className="flex items-center w-full space-x-2">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                        className="flex-1 h-10 px-3 bg-[var(--input)] text-[var(--foreground)] border-[var(--border)] focus:ring-[var(--ring)]"
                    />
                    <Button type="submit" className="h-10 px-6 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">
                        Send
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}

export default Chat;