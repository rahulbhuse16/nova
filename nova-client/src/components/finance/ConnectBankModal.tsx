"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link, Shield, CheckCircle, Lock } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (bankName: string) => void;
}

export function ConnectBankModal({ isOpen, onClose, onConnect }: ConnectBankModalProps) {
  const [selectedBank, setSelectedBank] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [step, setStep] = React.useState<"select" | "verify" | "success">("select");

  const banks = [
    { id: "hdfc", name: "HDFC Bank", logo: "🏦", color: "bg-blue-500/20" },
    { id: "icici", name: "ICICI Bank", logo: "🏦", color: "bg-yellow-500/20" },
    { id: "sbi", name: "State Bank of India", logo: "🏦", color: "bg-blue-600/20" },
    { id: "axis", name: "Axis Bank", logo: "🏦", color: "bg-red-500/20" },
    { id: "kotak", name: "Kotak Mahindra", logo: "🏦", color: "bg-pink-500/20" },
  ];

  const handleConnect = async () => {
    if (!selectedBank) return;

    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnecting(false);
    setStep("verify");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStep("success");
  };

  const handleComplete = () => {
    const bank = banks.find((b) => b.id === selectedBank);
    if (bank) {
      onConnect(bank.name);
    }
    setStep("select");
    setSelectedBank("");
    onClose();
  };

  const handleClose = () => {
    setStep("select");
    setSelectedBank("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <PremiumCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-semibold text-white">Connect Bank Account</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {step === "select" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-white">Secure Connection</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Your data is encrypted and secure. We use bank-level security to protect your information.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Select Your Bank
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {banks.map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedBank === bank.id
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-slate-700/50 hover:border-slate-600/50 bg-slate-800/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{bank.logo}</span>
                              <span className="text-sm font-medium text-white">{bank.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <SecondaryButton onClick={handleClose} className="flex-1">
                        Cancel
                      </SecondaryButton>
                      <PrimaryButton
                        onClick={handleConnect}
                        disabled={!selectedBank || isConnecting}
                        loading={isConnecting}
                        className="flex-1"
                      >
                        Connect
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                {step === "verify" && (
                  <div className="space-y-5 py-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-indigo-400 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-white">Verifying Connection</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Establishing secure connection with your bank...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {step === "success" && (
                  <div className="space-y-5 py-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-white">Bank Connected!</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Your account has been successfully linked
                        </p>
                      </div>
                    </div>

                    <PrimaryButton onClick={handleComplete} className="w-full">
                      Done
                    </PrimaryButton>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
