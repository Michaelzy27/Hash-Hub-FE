import { createContext, useContext, useState, ReactNode } from "react";
import { Bounty } from "@/data/bounties";

interface BountyContextType {
  bounties: Bounty[];
  setBounties: (bounties: Bounty[]) => void;
}

const BountyContext = createContext<BountyContextType>({ bounties: [], setBounties: () => {} });

export const BountyProvider = ({ children }: { children: ReactNode }) => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  return (
    <BountyContext.Provider value={{ bounties, setBounties }}>
      {children}
    </BountyContext.Provider>
  );
};

export const useBounties = () => useContext(BountyContext);
