import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import BountyCard from "@/components/BountyCard";
import { MOCK_BOUNTIES } from "@/data/bounties";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("all");

  const filteredBounties = useMemo(() => {
    return MOCK_BOUNTIES.filter((b) => {
      const categoryMatch = activeCategory === "All" || b.category === activeCategory;
      const statusMatch = activeStatus === "all" || b.status === activeStatus;
      return categoryMatch && statusMatch;
    });
  }, [activeCategory, activeStatus]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <main className="container py-8">
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
        <div className="mt-6 flex flex-col gap-2">
          {filteredBounties.length > 0 ? (
            filteredBounties.map((bounty, i) => (
              <BountyCard key={bounty.id} bounty={bounty} index={i} />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No bounties found matching your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
