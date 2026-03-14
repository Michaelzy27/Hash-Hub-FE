import { motion } from "framer-motion";
import heroPattern from "@/assets/hero-pattern.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroPattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="container relative py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            Build the Hashgraph.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Contribute to the most sustainable ecosystem in Web3. Earn HBAR for your craft.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <Stat value="$2.4M+" label="Total Rewarded" />
            <div className="h-8 w-px bg-border" />
            <Stat value="340+" label="Bounties Completed" />
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <Stat value="1.2K+" label="Contributors" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="text-xl font-semibold text-foreground font-mono">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default HeroSection;
