import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/config/apiClient";
import { toast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

const CATEGORIES = ["Development", "Design", "Content", "Community", "Other"] as const;
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

interface CreateBountyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const CreateBountyDialog = ({ open, onOpenChange, onCreated }: CreateBountyDialogProps) => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [reward, setReward] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRequirement = () => setRequirements([...requirements, ""]);
  const removeRequirement = (i: number) =>
    setRequirements(requirements.filter((_, idx) => idx !== i));
  const updateRequirement = (i: number, value: string) => {
    const updated = [...requirements];
    updated[i] = value;
    setRequirements(updated);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setDifficulty("");
    setReward("");
    setDueDate("");
    setRequirements([""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredReqs = requirements.filter((r) => r.trim() !== "");
    if (!title || !description || !category || !difficulty || !reward || !dueDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch("/bounties/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          reward: Number(reward),
          currency: "HBAR",
          dueDate,
          requirements: filteredReqs,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create bounty");
      }

      toast({ title: "Bounty created! 🎉" });
      resetForm();
      onCreated();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Bounty</DialogTitle>
          <DialogDescription>
            Fill in the details for your new bounty listing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="bounty-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bounty-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build a DeFi Dashboard"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bounty-desc">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bounty-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the bounty entails…"
              className="resize-none min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Difficulty <span className="text-destructive">*</span>
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bounty-reward">
                Reward (HBAR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bounty-reward"
                type="number"
                min="1"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="5000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bounty-due">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bounty-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label>Requirements</Label>
            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder={`Requirement ${i + 1}`}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 mt-1"
              onClick={addRequirement}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Requirement
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating…" : "Create Bounty"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBountyDialog;
