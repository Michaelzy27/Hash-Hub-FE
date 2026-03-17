import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Plus, X, Info } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUGGESTED_SKILLS = [
  "Frontend",
  "Backend",
  "UI/UX Design",
  "Writing",
  "Digital Marketing",
  "Smart Contracts",
  "Data Science",
  "DevOps",
  "Mobile Development",
  "Community Management",
];

const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "India",
  "Germany",
  "Canada",
  "Ghana",
  "Kenya",
  "South Africa",
  "Brazil",
  "Other",
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { token, setProfileComplete } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !location) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (skills.length === 0) {
      toast.error("Please select at least one skill.");
      return;
    }
    if (!twitterUsername.trim()) {
      toast.error("Please enter your Twitter/X username.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username.trim(),
          location,
          skills,
          twitterUsername: twitterUsername.trim(),
          referralCode: referralCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setProfileComplete(true);
      toast.success("Profile completed! You can now register for bounties.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Finish Your Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            It takes less than a minute to start earning in global standards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar upload */}
          <div className="flex items-start gap-6">
            <label
              htmlFor="avatar-upload"
              className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>

            <div className="grid flex-1 grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">
                  First Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">
                  Last Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Username & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">
                Username<span className="text-destructive">*</span>
              </Label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  className="rounded-l-none"
                  placeholder="your-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">
                Location<span className="text-destructive">*</span>
              </Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <Label className="text-foreground">
                Your Skills<span className="text-destructive">*</span>
              </Label>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Get notified of new listings based on your skills
            </p>

            {/* Selected skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Skill input */}
            <Input
              placeholder="Select skills..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
            />

            {/* Suggested skills */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map(
                (skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {skill} <Plus className="h-3 w-3" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold text-foreground">
                  Socials
                </Label>
                <p className="text-sm text-muted-foreground">
                  Fill at least one, but more the merrier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">𝕏</span>
              <span className="text-destructive">*</span>
              <div className="flex flex-1">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">
                  x.com/
                </span>
                <Input
                  className="rounded-l-none"
                  placeholder="Enter your Twitter username"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Have a Referral Code?</Label>
            <Input
              className="max-w-[200px]"
              placeholder="Enter code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating Profile..." : "Create Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
