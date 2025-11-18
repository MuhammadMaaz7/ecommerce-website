import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Gift, X } from "lucide-react";

const prizes = [
  { label: "10% OFF", color: "bg-primary" },
  { label: "Free Shipping", color: "bg-accent" },
  { label: "5% OFF", color: "bg-primary-light" },
  { label: "$20 Voucher", color: "bg-accent-light" },
  { label: "15% OFF", color: "bg-primary" },
  { label: "Try Again", color: "bg-muted" },
];

export const SpinWheel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const spins = 5;
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + randomDegree;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      const prizeIndex = Math.floor((360 - (randomDegree % 360)) / 60);
      setResult(prizes[prizeIndex].label);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-8 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-xl gradient-primary hover:scale-110 transition-transform"
        >
          <Gift className="h-8 w-8" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 max-w-md w-full relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Spin to Win!
                </h2>

                <div className="relative w-64 h-64 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4, ease: "easeOut" }}
                    className="w-full h-full rounded-full overflow-hidden relative"
                    style={{ transformOrigin: "center" }}
                  >
                    {prizes.map((prize, index) => (
                      <div
                        key={index}
                        className={`absolute w-full h-full ${prize.color} text-white`}
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((index * 60 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((index * 60 - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos(((index + 1) * 60 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((index + 1) * 60 - 90) * Math.PI / 180)}%)`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold transform rotate-[30deg]">
                            {prize.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-foreground" />
                </div>

                {result && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-4"
                  >
                    <p className="text-xl font-bold text-primary">
                      You won: {result}!
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full gradient-primary"
                  size="lg"
                >
                  {isSpinning ? "Spinning..." : "Spin Now!"}
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
