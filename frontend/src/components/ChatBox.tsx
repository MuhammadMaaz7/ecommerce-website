import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", isBot: true },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { text: message, isBot: false }]);
    setMessage("");
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for your message! Our team will respond shortly.", isBot: true },
      ]);
    }, 1000);
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-xl bg-primary hover:bg-primary-dark"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-40 w-96 max-w-[calc(100vw-4rem)]"
          >
            <Card className="overflow-hidden shadow-2xl">
              <div className="gradient-primary p-4">
                <h3 className="text-lg font-semibold text-primary-foreground">
                  Customer Support
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  We're here to help!
                </p>
              </div>

              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-secondary/20">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.isBot ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.isBot
                          ? "bg-card text-card-foreground"
                          : "gradient-primary text-primary-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon" className="gradient-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
