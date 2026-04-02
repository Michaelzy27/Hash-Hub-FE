import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, MapPin, AtSign, Twitter, Edit2, Save, X, Plus, ArrowLeft, Wallet, Copy } from "lucide-react";
import { apiFetch } from "@/config/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { toImageSrc } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import placeholder from "@/assets/placeholder-gradient.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  "Nigeria", "United States", "United Kingdom", "India",
  "Germany", "Canada", "Ghana", "Kenya", "South Africa", "Brazil", "Other",
];

const SUGGESTED_SKILLS = [
  "Frontend", "Backend", "UI/UX Design", "Writing",
  "Digital Marketing", "Smart Contracts", "Data Science",
  "DevOps", "Mobile Development", "Community Management",
];

const Profile = () => {
  const navigate = useNavigate();
  const { token, userProfile, setUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState(userProfile?.firstName || "");
  const [lastName, setLastName] = useState(userProfile?.lastName || "");
  const [username, setUsername] = useState(userProfile?.username || "");
  const [location, setLocation] = useState(userProfile?.location || "");
  const [skills, setSkills] = useState<string[]>(userProfile?.skills || []);
  const [twitterUsername, setTwitterUsername] = useState(userProfile?.twitterUsername || "");
  const [skillInput, setSkillInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(toImageSrc(userProfile?.avatarUrl) || null);
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

  const cancelEdit = () => {
    setFirstName(userProfile?.firstName || "");
    setLastName(userProfile?.lastName || "");
    setUsername(userProfile?.username || "");
    setLocation(userProfile?.location || "");
    setSkills(userProfile?.skills || []);
    setTwitterUsername(userProfile?.twitterUsername || "");
    setAvatarPreview(toImageSrc(userProfile?.avatarUrl) || null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      toast.error("Name and username are required.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("username", username.trim());
      formData.append("location", location);
      formData.append("skills", JSON.stringify(skills));
      formData.append("twitterUsername", twitterUsername.trim());
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await apiFetch("/auth/complete-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      const updatedProfile = {
        ...userProfile,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        location,
        skills,
        twitterUsername: twitterUsername.trim(),
        avatarUrl: data.avatarUrl || userProfile?.avatarUrl,
      };

      setUserProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = `${(firstName || "?")[0]}${(lastName || "?")[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Profile Header */}
        <div className="rounded-2xl border border-border bg-card p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-5">
              {isEditing ? (
                <label
                  htmlFor="avatar-edit"
                  className="group relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-secondary transition-all hover:border-primary overflow-hidden"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <img src={placeholder} alt="Avatar" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4 text-foreground" />
                  </div>
                  <input id="avatar-edit" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <img src={placeholder} alt="Avatar" className="h-full w-full object-cover" />
                  )}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">{firstName} {lastName}</h1>
                <p className="text-muted-foreground">@{username}</p>
                {userProfile?.email && (
                  <p className="text-sm text-muted-foreground mt-0.5">{userProfile.email}</p>
                )}
              </div>
            </div>

            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={cancelEdit} className="gap-1">
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading} className="gap-1">
                  <Save className="h-3.5 w-3.5" /> {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Name */}
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
            ) : null}

            {/* Username */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AtSign className="h-4 w-4" /> Username
              </div>
              {isEditing ? (
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">@</span>
                  <Input className="rounded-l-none" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              ) : (
                <p className="text-foreground font-medium">@{username}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location
              </div>
              {isEditing ? (
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-foreground font-medium">{location || "Not set"}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" /> Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
                    {skill}
                    {isEditing && (
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {skills.length === 0 && !isEditing && (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
              {isEditing && (
                <>
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" /> {skill}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Twitter className="h-4 w-4" /> Twitter / X
              </div>
              {isEditing ? (
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">x.com/</span>
                  <Input className="rounded-l-none" value={twitterUsername} onChange={(e) => setTwitterUsername(e.target.value)} />
                </div>
              ) : (
                <p className="text-foreground font-medium">
                  {twitterUsername ? (
                    <a href={`https://x.com/${twitterUsername}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      @{twitterUsername}
                    </a>
                  ) : "Not set"}
                </p>
              )}
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" /> Wallet Address
              </div>
              {userProfile?.hederaWalletId ? (
                <div className="flex items-center gap-2">
                  <code className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm font-mono text-foreground">
                    {userProfile.hederaWalletId}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(userProfile.hederaWalletId!);
                      toast.success("Wallet address copied!");
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No wallet address assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
