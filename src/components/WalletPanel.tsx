import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  X,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Layers,
  ActivitySquare,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ASSETS = [
  // { symbol: "HBAR", name: "Hedera", balance: 1_240.5, usdValue: 62.03, change: +3.2 },
  // { symbol: "USDC", name: "USD Coin", balance: 85.0, usdValue: 85.0, change: 0 },
  // { symbol: "SAUCE", name: "SaucerSwap", balance: 3_500, usdValue: 14.0, change: -1.4 },
];

const MOCK_ACTIVITY = [
  // { type: "received", label: "Bounty Reward", amount: "+500 HBAR", date: "Mar 20", usd: "$25.00" },
  // { type: "sent", label: "Withdrawal", amount: "-200 HBAR", date: "Mar 15", usd: "$10.00" },
  // { type: "received", label: "Bounty Reward", amount: "+740.5 HBAR", date: "Mar 10", usd: "$37.03" },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface WalletPanelProps {
  open: boolean;
  onClose: () => void;
}

const WalletPanel = ({ open, onClose }: WalletPanelProps) => {
  const { userProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"assets" | "activity">("assets");

  const walletId = userProfile?.hederaWalletId ?? null;
  const totalUsd = MOCK_ASSETS.reduce((s, a) => s + a.usdValue, 0);

  const copyWallet = () => {
    if (!walletId) return;
    navigator.clipboard.writeText(walletId);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-background flex flex-col shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {userProfile?.firstName
                      ? `${userProfile.firstName}'s Wallet`
                      : "My Wallet"}
                  </p>
                  {walletId && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {walletId}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Balance card ── */}
            <div className="mx-4 mt-4 rounded-xl bg-primary/5 border border-primary/10 p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Total Balance
              </p>
              <p className="text-3xl font-bold text-foreground tracking-tight">
                ${totalUsd.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground ml-1">USD</span>
              </p>

              {/* Wallet address row */}
              {walletId ? (
                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-mono text-foreground truncate">
                    {walletId}
                  </code>
                  <button
                    onClick={copyWallet}
                    className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">No wallet address assigned yet</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className="gap-1.5 w-full"
                  disabled={!walletId}
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Withdraw
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 w-full"
                  disabled={!walletId}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Explorer
                </Button>
              </div>
            </div>

            {/* ── Info text ── */}
            <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your rewards won from bounties will be paid into this wallet.
              </p>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 mx-4 mt-4 rounded-lg bg-secondary/50 p-1">
              {(["assets", "activity"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all capitalize ${
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "assets" ? (
                    <Layers className="h-3.5 w-3.5" />
                  ) : (
                    <ActivitySquare className="h-3.5 w-3.5" />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Tab content ── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {activeTab === "assets" && (
                <>
                  {walletId ? (
                    MOCK_ASSETS.map((asset) => (
                      <motion.div
                        key={asset.symbol}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            {asset.balance.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">${asset.usdValue.toFixed(2)}</p>
                          <p
                            className={`text-xs font-medium ${
                              asset.change > 0
                                ? "text-green-500"
                                : asset.change < 0
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {asset.change > 0 ? "+" : ""}
                            {asset.change}%
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <EmptyState
                      icon={Layers}
                      title="Your wallet is empty"
                      description="Your rewards will show up here when you're paid by a sponsor for a win."
                    />
                  )}
                </>
              )}

              {activeTab === "activity" && (
                <>
                  {walletId && MOCK_ACTIVITY.length > 0 ? (
                    MOCK_ACTIVITY.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                            item.type === "received"
                              ? "bg-green-500/10"
                              : "bg-red-500/10"
                          }`}
                        >
                          {item.type === "received" ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              item.type === "received" ? "text-green-500" : "text-red-400"
                            }`}
                          >
                            {item.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.usd}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <EmptyState
                      icon={ActivitySquare}
                      title="No activity yet"
                      description="All earnings and withdrawals from your wallet will show up here."
                    />
                  )}
                </>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-3 border-t border-border">
              <p className="text-center text-xs text-muted-foreground">
                Powered by{" "}
                <span className="text-primary font-medium">Hedera</span> network
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Empty state helper ───────────────────────────────────────────────────────
const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
      <Icon className="h-7 w-7 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">{description}</p>
  </div>
);

export default WalletPanel;