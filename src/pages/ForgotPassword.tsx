import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import logo from "@/assets/hash-hub-logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call your backend password reset endpoint
    console.log("Forgot password:", { email });
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <Card className="border-border bg-card">
          {submitted ? (
            <CardHeader className="text-center space-y-4 py-10">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl text-foreground">Check your email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>
              </CardDescription>
              <Link to="/login">
                <Button variant="ghost" className="mt-2 text-primary">
                  Back to login
                </Button>
              </Link>
            </CardHeader>
          ) : (
            <>
              <CardHeader className="text-center space-y-3">
                <div className="flex justify-center">
                  <img src={logo} alt="Hash Hub" className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-foreground">Reset password</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                      Log in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
