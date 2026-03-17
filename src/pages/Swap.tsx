import Navbar from "@/components/Navbar";
import { ArrowLeftRight } from "lucide-react";

const Swap = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <ArrowLeftRight className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Swap is Coming Soon
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          We're building a seamless token swap experience. Stay tuned — it'll be worth the wait.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          In Development
        </div>
      </div>
    </div>
  );
};

export default Swap;
