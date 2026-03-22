import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Plus, X, ChevronRight, ChevronLeft, User, Briefcase, Share2, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { toImageSrc } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUGGESTED_SKILLS = [
  "Frontend", "Backend", "UI/UX Design", "Writing",
  "Digital Marketing", "Smart Contracts", "Data Science",
  "DevOps", "Mobile Development", "Community Management",
];

const COUNTRIES = [
  "Nigeria", "United States", "United Kingdom", "India",
  "Germany", "Canada", "Ghana", "Kenya", "South Africa", "Brazil", "Other",
];

const STEPS = [
  { label: "Identity", icon: User },
  { label: "Skills", icon: Briefcase },
  { label: "Connect", icon: Share2 },
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { token, setProfileComplete, setUserProfile, userProfile } = useAuth();
  const [step, setStep] = useState(0);

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    if (step === 0) {
      if (!firstName.trim() || !lastName.trim() || !username.trim() || !location) {
        toast.error("Please fill in all required fields.");
        return false;
      }
    }
    if (step === 1 && skills.length === 0) {
      toast.error("Please select at least one skill.");
      return false;
    }
    if (step === 2 && !twitterUsername.trim()) {
      toast.error("Please enter your Twitter/X username.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("username", username.trim());
      formData.append("location", location);
      formData.append("skills", JSON.stringify(skills));
      formData.append("twitterUsername", twitterUsername.trim());
      if (referralCode.trim()) formData.append("referralCode", referralCode.trim());
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const  { data } = await res.json();
      const user = data.user;
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setProfileComplete(true);
      setUserProfile({
        ...userProfile,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        location,
        skills,
        twitterUsername: twitterUsername.trim(),
        avatarUrl: user.avatarUrl || undefined,
        hederaWalletId: user.hederaWalletId,
        walletAddress: user.walletAddress
      });
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
      <div className="container max-w-xl py-12">
        {/* Progress stepper */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={s.label} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : isDone
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card container */}
        <div className="rounded-2xl border border-border bg-card p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 0: Identity */}
            {step === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Who are you?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Let the community know who's behind the screen.
                  </p>
                </div>

                {/* Avatar */}
                <div className="flex justify-center">
                  <label
                    htmlFor="avatar-upload"
                    className="group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-secondary transition-all hover:border-primary hover:bg-primary/5"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="h-full w-full rounded-2xl object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        <span className="text-[10px] text-muted-foreground group-hover:text-primary">Upload</span>
                      </div>
                    )}
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">First Name <span className="text-destructive">*</span></Label>
                    <Input placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Last Name <span className="text-destructive">*</span></Label>
                    <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Username <span className="text-destructive">*</span></Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">@</span>
                    <Input className="rounded-l-none" placeholder="your-username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Location <span className="text-destructive">*</span></Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger><SelectValue placeholder="Where are you based?" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 1: Skills */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">What do you do?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick your skills so we can match you with the right bounties.
                  </p>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} className="gap-1.5 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <Input
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                />

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" /> {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Connect */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Almost there!</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Link your socials and drop a referral code if you have one.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Twitter / X <span className="text-destructive">*</span></Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">x.com/</span>
                    <Input className="rounded-l-none" placeholder="your_handle" value={twitterUsername} onChange={(e) => setTwitterUsername(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Referral Code</Label>
                  <Input placeholder="Got a code? Enter it here" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Optional — but your referrer will thank you.</p>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Profile Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{firstName} {lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Username</span>
                      <span className="text-foreground font-medium">@{username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="text-foreground font-medium">{location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skills</span>
                      <span className="text-foreground font-medium">{skills.length} selected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 gap-1">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 2 ? (
                <Button type="button" onClick={nextStep} className="flex-1 gap-1">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creating Profile..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
