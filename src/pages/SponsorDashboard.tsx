import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/config/api";
import { toast } from "@/hooks/use-toast";
import { toImageSrc } from "@/lib/utils";
import CreateBountyDialog from "@/components/CreateBountyDialog";
import {
  Building2,
  Globe,
  Twitter,
  Plus,
  Clock,
  MessageSquare,
  Shield,
  Briefcase,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Bounty } from "@/data/bounties";

interface SponsorProfile {
  companyName: string;
  companyUsername: string;
  companyUrl: string;
  companyTwitter: string;
  companyLogo: string;
  companyBio: string;
  industry: string;
  entityName: string;
}

const getTimeRemaining = (dueDate: string) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days}d left`;
};

const statusLabel: Record<string, string> = {
  open: "Open",
  "in-review": "In Review",
  completed: "Completed",
  expired: "Expired",
};

const statusClass: Record<string, string> = {
  open: "status-badge-open",
  "in-review": "status-badge-in-review",
  completed: "status-badge-open",
  expired: "status-badge-closed",
};

const SponsorDashboard = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [sponsor, setSponsor] = useState<SponsorProfile | null>(null);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSponsorData();
  }, [isAuthenticated]);

  const fetchSponsorData = async () => {
    try {
      setLoading(true);
      const [sponsorRes, bountiesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/sponsors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/sponsors/me/bounties`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!sponsorRes.ok) {
        navigate("/become-sponsor");
        return;
      }

      const sponsorData = await sponsorRes.json();
      setSponsor(sponsorData);

      if (bountiesRes.ok) {
        const bountiesData = await bountiesRes.json();
        setBounties(Array.isArray(bountiesData) ? bountiesData : []);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load sponsor dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openBounties = bounties.filter((b) => b.status === "open");
  const totalRewards = bounties.reduce((sum, b) => sum + (b.reward || 0), 0);
  const totalSubmissions = bounties.reduce((sum, b) => sum + (b.submissions || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center text-muted-foreground">
          Loading dashboard…
        </div>
      </div>
    );
  }

  const logoSrc = toImageSrc(sponsor?.companyLogo ?? null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10 max-w-6xl">
        {/* Company header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Logo */}
            <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={sponsor?.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-primary" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {sponsor?.companyName}
              </h1>
              {sponsor?.companyBio && (
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  {sponsor.companyBio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-3">
                {sponsor?.industry && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Briefcase className="h-3 w-3" />
                    {sponsor.industry}
                  </span>
                )}
                {sponsor?.companyUrl && (
                  <a
                    href={sponsor.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {sponsor.companyUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {sponsor?.companyTwitter && (
                  <a
                    href={`https://x.com/${sponsor.companyTwitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    @{sponsor.companyTwitter}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Bounties",
              value: bounties.length,
              icon: Briefcase,
            },
            {
              label: "Total Rewards",
              value: `${totalRewards.toLocaleString()} HBAR`,
              icon: TrendingUp,
            },
            {
              label: "Total Submissions",
              value: totalSubmissions,
              icon: Users,
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bounties section */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Your Bounties</h2>
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create a Bounty
          </Button>
        </div>

        {bounties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              You haven't created any bounties yet.
            </p>
            <Button
              className="mt-4 gap-1.5"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Your First Bounty
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bounties.map((bounty, i) => (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => navigate(`/bounty/${bounty.id}`)}
                className="bounty-card flex items-center gap-4 cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {bounty.title}
                    </h3>
                    {bounty.verified && (
                      <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={statusClass[bounty.status]}>
                      {statusLabel[bounty.status]}
                    </span>
                    <span className="metadata-text">·</span>
                    <span className="metadata-text flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(bounty.dueDate)}
                    </span>
                    <span className="metadata-text">·</span>
                    <span className="metadata-text flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {bounty.submissions} submissions
                    </span>
                    <span className="metadata-text">·</span>
                    <span className="category-pill">{bounty.category}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="reward-amount text-lg">
                    {bounty.reward.toLocaleString()}
                  </div>
                  <div className="metadata-text font-mono">{bounty.currency}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <CreateBountyDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={() => {
            setCreateOpen(false);
            fetchSponsorData();
          }}
        />
      </div>
    </div>
  );
};

export default SponsorDashboard;
