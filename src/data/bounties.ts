export interface Bounty {
  id: string;
  title: string;
  project: string;
  projectLogo: string;
  category: "Development" | "Design" | "Content" | "Community" | "Other";
  reward: number;
  currency: string;
  status: "open" | "in-review" | "completed" | "expired";
  dueDate: string;
  submissions: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  requirements: string[];
  verified: boolean;
}

export const MOCK_BOUNTIES: Bounty[] = [
  {
    id: "1",
    title: "Build a DeFi Dashboard for Hedera Token Service",
    project: "HashPort",
    projectLogo: "",
    category: "Development",
    reward: 15000,
    currency: "HBAR",
    status: "open",
    dueDate: "2026-03-28",
    submissions: 5,
    difficulty: "Advanced",
    description: "Create a comprehensive DeFi dashboard that integrates with Hedera Token Service (HTS) to display token balances, transaction history, and staking information.",
    requirements: [
      "Experience with Hedera SDK",
      "React/TypeScript proficiency",
      "DeFi protocol knowledge",
      "Must support HTS tokens"
    ],
    verified: true,
  },
  {
    id: "2",
    title: "Design Brand Identity for Hedera NFT Marketplace",
    project: "SentX",
    projectLogo: "",
    category: "Design",
    reward: 8000,
    currency: "HBAR",
    status: "open",
    dueDate: "2026-04-05",
    submissions: 12,
    difficulty: "Intermediate",
    description: "Design a complete brand identity for a new NFT marketplace built on Hedera, including logo, color palette, and UI component library.",
    requirements: [
      "Portfolio with branding projects",
      "Figma proficiency",
      "Deliver source files and style guide"
    ],
    verified: true,
  },
  {
    id: "3",
    title: "Write Technical Documentation for Hedera Smart Contracts",
    project: "Hedera Foundation",
    projectLogo: "",
    category: "Content",
    reward: 5000,
    currency: "HBAR",
    status: "open",
    dueDate: "2026-03-22",
    submissions: 3,
    difficulty: "Intermediate",
    description: "Create comprehensive technical documentation covering Hedera smart contract deployment, testing, and best practices.",
    requirements: [
      "Technical writing experience",
      "Solidity/Smart contract knowledge",
      "Hedera ecosystem familiarity"
    ],
    verified: true,
  },
  {
    id: "4",
    title: "Community Ambassador Program - Africa Region",
    project: "Hedera Foundation",
    projectLogo: "",
    category: "Community",
    reward: 10000,
    currency: "HBAR",
    status: "open",
    dueDate: "2026-04-15",
    submissions: 22,
    difficulty: "Beginner",
    description: "Represent Hedera across African developer communities. Host meetups, create educational content, and onboard new developers.",
    requirements: [
      "Active in Web3 community",
      "Based in Africa",
      "English fluency",
      "Social media presence"
    ],
    verified: false,
  },
  {
    id: "5",
    title: "Audit Hedera DeFi Protocol Smart Contracts",
    project: "SaucerSwap",
    projectLogo: "",
    category: "Development",
    reward: 25000,
    currency: "HBAR",
    status: "in-review",
    dueDate: "2026-03-10",
    submissions: 8,
    difficulty: "Advanced",
    description: "Perform a comprehensive security audit of SaucerSwap's smart contracts deployed on Hedera.",
    requirements: [
      "Smart contract auditing experience",
      "Solidity expertise",
      "Published audit reports"
    ],
    verified: true,
  },
  {
    id: "6",
    title: "Create Video Tutorials for Hedera SDK",
    project: "HashPack",
    projectLogo: "",
    category: "Content",
    reward: 6000,
    currency: "HBAR",
    status: "completed",
    dueDate: "2026-02-28",
    submissions: 15,
    difficulty: "Beginner",
    description: "Produce a series of 5 video tutorials covering the basics of Hedera SDK integration for JavaScript developers.",
    requirements: [
      "Video production skills",
      "JavaScript/TypeScript knowledge",
      "Clear spoken English"
    ],
    verified: true,
  },
  {
    id: "7",
    title: "Build Cross-Chain Bridge UI for Hedera",
    project: "HashPort",
    projectLogo: "",
    category: "Development",
    reward: 20000,
    currency: "HBAR",
    status: "open",
    dueDate: "2026-04-20",
    submissions: 2,
    difficulty: "Advanced",
    description: "Design and implement a user-friendly interface for the HashPort cross-chain bridge, supporting Ethereum and Polygon bridging.",
    requirements: [
      "Cross-chain bridge experience",
      "React/Next.js proficiency",
      "Web3 wallet integration"
    ],
    verified: true,
  },
  {
    id: "8",
    title: "Hedera Ecosystem Infographic Series",
    project: "HBAR Foundation",
    projectLogo: "",
    category: "Design",
    reward: 3500,
    currency: "HBAR",
    status: "expired",
    dueDate: "2026-03-01",
    submissions: 34,
    difficulty: "Beginner",
    description: "Create a set of 10 infographics explaining the Hedera ecosystem, including consensus, token service, and file service.",
    requirements: [
      "Infographic design experience",
      "Data visualization skills",
      "Deliver in SVG and PNG"
    ],
    verified: false,
  },
];

export const CATEGORIES = ["All", "Development", "Design", "Content", "Community", "Other"] as const;
