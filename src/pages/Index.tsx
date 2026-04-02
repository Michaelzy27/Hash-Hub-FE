import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import BountyCard from "@/components/BountyCard";
import { Bounty } from "@/data/bounties";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { useBounties } from "@/contexts/BountyContext";

const Index = () => {
  const { token } = useAuth();
  const { bounties, setBounties } = useBounties();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch("/bounty", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch bounties (${res.status})`);
        const result = await res.json();
        console.log("Bounties: ", result.data.bounties);
        
        setBounties(result.data.bounties);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);


  const filteredBounties = useMemo(() => {
    //if (!bounties) return [];
    return bounties.filter((b) => {
      const categoryMatch = activeCategory === "All" || b.category === activeCategory;
      const statusMatch = activeStatus === "all" || b.status === activeStatus;
      return categoryMatch && statusMatch;
    });
  }, [bounties, activeCategory, activeStatus]);

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
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-destructive">{error}</p>
              <button
                className="mt-4 text-sm text-muted-foreground underline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : bounties.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No bounties available yet.</p>
            </div>
          ) : filteredBounties.length > 0 ? (
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