import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Twitter, Globe, Building2, User } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const INDUSTRIES = [
  "DeFi",
  "NFTs & Gaming",
  "Infrastructure",
  "DAOs & Governance",
  "Developer Tooling",
  "Payments",
  "Identity & Privacy",
  "Social",
  "Other",
];

const BecomeSponsor = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  // About You
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [telegram, setTelegram] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // About Your Company
  const [companyName, setCompanyName] = useState("");
  const [companyUsername, setCompanyUsername] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyTwitter, setCompanyTwitter] = useState("");
  const [entityName, setEntityName] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [industry, setIndustry] = useState("");
  const [companyBio, setCompanyBio] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum size is 5 MB", variant: "destructive" });
        return;
      }
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("telegram", telegram);
      if (profilePicture) formData.append("profilePicture", profilePicture);
      formData.append("companyName", companyName);
      formData.append("companyUsername", companyUsername);
      formData.append("companyUrl", companyUrl);
      formData.append("companyTwitter", companyTwitter);
      formData.append("entityName", entityName);
      if (companyLogo) formData.append("companyLogo", companyLogo);
      formData.append("industry", industry);
      formData.append("companyBio", companyBio);

      const res = await apiFetch("/sponsors/create", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create sponsor");
      }

      toast({ title: "Sponsor profile created!", description: "Welcome aboard 🎉" });
      navigate("/sponsor/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Hash Hub</h1>
          <p className="text-muted-foreground mt-2">
            Let's start with some basic information about your team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* About You */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              About You
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">
                  Telegram <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@johndoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Profile Picture <span className="text-destructive">*</span>
              </Label>
              <input
                type="file"
                ref={profileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, setProfilePicture, setProfilePreview)}
              />
              <div
                onClick={() => profileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors bg-card"
              >
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Choose or drag and drop media</p>
                    <p className="text-xs text-muted-foreground">Maximum size 5 MB</p>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* About Your Company */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              About Your Company
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyUsername">
                  Company Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyUsername"
                  value={companyUsername}
                  onChange={(e) => setCompanyUsername(e.target.value)}
                  placeholder="acmeinc"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyUrl">
                  Company URL <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyUrl"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="https://acme.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyTwitter">
                  Company X <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyTwitter"
                    value={companyTwitter}
                    onChange={(e) => setCompanyTwitter(e.target.value)}
                    placeholder="acmeinc"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityName">Entity Name</Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Full Entity Name"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Company Logo <span className="text-destructive">*</span>
              </Label>
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, setCompanyLogo, setLogoPreview)}
              />
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors bg-card"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-20 w-20 rounded-lg object-cover" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Choose or drag and drop media</p>
                    <p className="text-xs text-muted-foreground">Maximum size 5 MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Industry <span className="text-destructive">*</span>
              </Label>
              <Select value={industry} onValueChange={setIndustry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyBio">
                Company Short Bio <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="companyBio"
                value={companyBio}
                onChange={(e) => setCompanyBio(e.target.value)}
                placeholder="What does your company do?"
                maxLength={180}
                required
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {180 - companyBio.length} characters left
              </p>
            </div>
          </section>

          {/* Agreement */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
            />
            <Label htmlFor="agree" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">
              I understand and acknowledge that this project is built on, or supports, the Hedera blockchain and
              that Hash Hub is a platform exclusively for teams and projects within the Hedera ecosystem.
            </Label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || !agreed}
          >
            {isSubmitting ? "Creating..." : "Create Sponsor"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSponsor;
