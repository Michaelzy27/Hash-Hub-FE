import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileEdit,
  Users,
  Trophy,
  BadgeCheck,
  Zap,
  Globe,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: FileEdit,
    title: "Create Your Sponsor Profile",
    description:
      "Set up your company profile in minutes. Add your logo, bio, and links so builders know exactly who you are.",
  },
  {
    step: "02",
    icon: Zap,
    title: "Post a Bounty",
    description:
      "Define a task, set a reward in HBAR, and publish it to the Hash Hub community. You're in full control of scope and timeline.",
  },
  {
    step: "03",
    icon: Users,
    title: "Receive Submissions",
    description:
      "Builders from across the Hedera ecosystem discover your bounty and submit their work directly on the platform.",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Pick a Winner & Pay",
    description:
      "Review submissions, select the best one, and reward the winner. Payment is handled seamlessly on-chain via Hedera.",
  },
];

const BENEFITS = [
  {
    icon: Globe,
    title: "Reach Hedera-native talent",
    description:
      "Tap into a focused pool of developers, designers, and creators who are already building in the Hedera ecosystem.",
  },
  {
    icon: BadgeCheck,
    title: "Verified project listings",
    description:
      "Sponsors are vetted and verified, giving your bounties credibility and attracting higher-quality submissions.",
  },
  {
    icon: Zap,
    title: "Fast & lightweight",
    description:
      "No bloated processes. Post a bounty, get results. Hash Hub is built for teams that want to move quickly.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const SponsorInfo = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative container max-w-3xl py-24 text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Hedera Ecosystem · Sponsors
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight"
          >
            Get Things Built by{" "}
            <span className="text-primary">Hedera's Best</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Post bounties, attract skilled builders, and grow your project —
            all within the Hedera ecosystem.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/become-sponsor">
              <Button size="lg" className="gap-2 px-8">
                Become a Sponsor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="px-8">
                Browse Bounties
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="container max-w-4xl py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
            The Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How it works
          </h2>
        </motion.div>

        <div className="relative">
          {/* vertical connector line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-px bg-border hidden sm:block" />

          <div className="space-y-6">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex gap-5 rounded-xl border border-border bg-card p-5 sm:p-6"
              >
                {/* Step number circle */}
                <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 z-10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-primary/60 font-semibold">
                      {item.step}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="border-t border-border bg-card/30">
        <div className="container max-w-4xl py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
              Why Hash Hub
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Built for Hedera teams
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container max-w-2xl py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Ready to find your builder?
          </h2>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto">
            Set up your sponsor profile and post your first bounty in under 5 minutes.
          </p>
          <Link to="/become-sponsor">
            <Button size="lg" className="gap-2 px-10">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default SponsorInfo;
