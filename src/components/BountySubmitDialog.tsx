import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

interface BountySubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bountyId: string;
}

const BountySubmitDialog = ({ open, onOpenChange, bountyId }: BountySubmitDialogProps) => {
  const [submissionLink, setSubmissionLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [otherLinks, setOtherLinks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!submissionLink.trim()) {
      toast.error("Submission link is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/bounty/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bountyId,
          submissionLink: submissionLink.trim(),
          twitterLink: twitterLink.trim(),
          otherLinks: otherLinks.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Submission failed");
      }

      toast.success("Bounty submitted successfully!");
      setSubmissionLink("");
      setTwitterLink("");
      setOtherLinks("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Bounty</DialogTitle>
          <DialogDescription>
            Fill the forms below to complete your submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="submission-link">Submission Link</Label>
            <Input
              id="submission-link"
              placeholder="https://your-submission-link.com"
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter-link">Twitter Link</Label>
            <Input
              id="twitter-link"
              placeholder="https://x.com/your-tweet"
              value={twitterLink}
              onChange={(e) => setTwitterLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other-links">Other Links</Label>
            <Input
              id="other-links"
              placeholder="Any additional links"
              value={otherLinks}
              onChange={(e) => setOtherLinks(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BountySubmitDialog;
