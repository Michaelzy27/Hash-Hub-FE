import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MessageSquare, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import BountySubmitDialog from "@/components/BountySubmitDialog";
import { MOCK_BOUNTIES } from "@/data/bounties";

const getTimeRemaining = (dueDate: string) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days}d left`;
};

const getProjectInitials = (name: string) => {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
};

const BountyDetail = () => {
  const { id } = useParams();
  const [submitOpen, setSubmitOpen] = useState(false);
  const bounty = MOCK_BOUNTIES.find((b) => b.id === id);

  if (!bounty) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Bounty not found.</p>
          <Link to="/" className="text-primary mt-4 inline-block hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const statusClass: Record<string, string> = {
    open: "status-badge-open",
    "in-review": "status-badge-in-review",
    completed: "status-badge-open",
    expired: "status-badge-closed",
  };

  const statusLabel: Record<string, string> = {
    open: "Open",
    "in-review": "In Review",
    completed: "Completed",
    expired: "Expired",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Header */}
          <div className="bounty-card !cursor-default mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-base font-semibold text-primary">
                {getProjectInitials(bounty.project)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{bounty.project}</span>
                  {bounty.verified && <Shield className="h-3.5 w-3.5 text-primary" />}
                  <span className={statusClass[bounty.status]}>{statusLabel[bounty.status]}</span>
                </div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  {bounty.title}
                </h1>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="metadata-text flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {getTimeRemaining(bounty.dueDate)}
                  </span>
                  <span className="metadata-text flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {bounty.submissions} submissions
                  </span>
                  <span className="category-pill category-pill-active">{bounty.category}</span>
                  <span className="category-pill">{bounty.difficulty}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="reward-amount text-2xl">
                  {bounty.reward.toLocaleString()}
                </div>
                <div className="metadata-text font-mono text-sm">{bounty.currency}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Description */}
            <div className="md:col-span-2 space-y-6">
              <div className="bounty-card !cursor-default">
                <h2 className="text-base font-semibold text-foreground mb-3">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bounty.description}
                </p>
              </div>

              <div className="bounty-card !cursor-default">
                <h2 className="text-base font-semibold text-foreground mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {bounty.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bounty-card !cursor-default">
                <h3 className="text-sm font-semibold text-foreground mb-4">Apply for this Bounty</h3>
                <Button className="w-full" size="lg">
                  Submit Application
                </Button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Sign up or log in to apply
                </p>
              </div>

              <div className="bounty-card !cursor-default">
                <h3 className="text-sm font-semibold text-foreground mb-3">About {bounty.project}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-xs font-semibold text-primary">
                    {getProjectInitials(bounty.project)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{bounty.project}</div>
                    <div className="text-xs text-muted-foreground">Hedera Ecosystem</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Project
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BountyDetail;
