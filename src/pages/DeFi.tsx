import Navbar from "@/components/Navbar";
import { ArrowLeftRight, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ComingSoonCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
      <Icon className="h-10 w-10 text-primary" />
    </div>
    <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
    <p className="mt-4 max-w-md text-lg text-muted-foreground">{description}</p>
    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2 text-sm text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      In Development
    </div>
  </div>
);

const DeFi = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-24">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-foreground">DeFi</h1>
        <Tabs defaultValue="swap" className="mx-auto max-w-2xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="bridge">Bridge</TabsTrigger>
          </TabsList>
          <TabsContent value="swap">
            <ComingSoonCard
              icon={ArrowLeftRight}
              title="Swap is Coming Soon"
              description="We're building a seamless token swap experience. Stay tuned — it'll be worth the wait."
            />
          </TabsContent>
          <TabsContent value="bridge">
            <ComingSoonCard
              icon={Globe}
              title="Bridge is Coming Soon"
              description="Cross-chain bridging is on the way. Move your assets seamlessly across networks."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeFi;
