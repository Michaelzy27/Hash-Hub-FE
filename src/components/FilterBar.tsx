import { CATEGORIES } from "@/data/bounties";

interface FilterBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const FilterBar = ({ activeCategory, onCategoryChange, activeStatus, onStatusChange }: FilterBarProps) => {
  const statuses = ["All", "Open", "In Review", "Completed", "Expired"];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">All Listings</h2>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={activeCategory === cat ? "category-pill category-pill-active" : "category-pill"}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status.toLowerCase().replace(" ", "-"))}
            className={
              activeStatus === status.toLowerCase().replace(" ", "-")
                ? "category-pill category-pill-active"
                : "category-pill"
            }
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
