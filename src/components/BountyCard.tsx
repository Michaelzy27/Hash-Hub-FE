import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Bounty } from "@/data/bounties";
import { Clock, MessageSquare, Shield } from "lucide-react";

interface BountyCardProps {
  bounty: Bounty;
  index: number;
}

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

const difficultyColor: Record<string, string> = {
  Beginner: "text-success",
  Intermediate: "text-primary",
  Advanced: "text-destructive",
};

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

const BountyCard = ({ bounty, index }: BountyCardProps) => {
  const timeRemaining = getTimeRemaining(bounty.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/bounty/${bounty.id}`} className="bounty-card flex items-center gap-4 group">
        {/* Project Logo */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-semibold text-primary overflow-hidden">
          {bounty.projectLogo ? (
            <img src={bounty.projectLogo} alt={bounty.project} className="w-full h-full object-cover" />
          ) : (
            getProjectInitials(bounty.project)
          )}
        </div>

        {/* Main Content */}
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
            <span className="metadata-text">{bounty.project}</span>
            <span className="metadata-text">·</span>
            <span className={statusClass[bounty.status]}>{statusLabel[bounty.status]}</span>
            <span className="metadata-text">·</span>
            <span className="metadata-text flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </span>
            <span className="metadata-text">·</span>
            <span className="metadata-text flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {bounty.submissions}
            </span>
            <span className="metadata-text">·</span>
            <span className={`text-xs font-medium ${difficultyColor[bounty.difficulty]}`}>
              {bounty.difficulty}
            </span>
          </div>
        </div>

        {/* Reward */}
        <div className="flex-shrink-0 text-right">
          <div className="reward-amount text-lg">
            {Number(bounty.reward).toLocaleString()}
          </div>
          <div className="metadata-text font-mono">{bounty.currency}</div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BountyCard;
