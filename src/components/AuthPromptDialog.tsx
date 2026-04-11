import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthPromptDialog = ({ open, onOpenChange }: AuthPromptDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-border/50 shadow-2xl">
        {/* Top decorative bar with gradient */}
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary/80" />
        
        {/* Icon header with glow effect */}
        <div className="pt-10 pb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-muted/50 border border-border flex items-center justify-center shadow-xl">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <DialogHeader className="px-8 pb-6 space-y-4">
          <DialogTitle className="text-2xl font-bold text-center tracking-tight">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed text-muted-foreground px-2">
            Sign in to your account or create a new one to submit bounty applications and unlock all features.
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="px-8 pb-8 pt-2 space-y-4">
          <Button
            size="lg"
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 hover:scale-[1.02] group"
            onClick={() => {
              onOpenChange(false);
              navigate("/login");
            }}
          >
            <LogIn className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Login
            <ArrowRight className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base font-medium border-2 hover:bg-muted transition-all duration-200 group"
            onClick={() => {
              onOpenChange(false);
              navigate("/signup");
            }}
          >
            <UserPlus className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            Create Account
          </Button>
        </div>

        {/* Bottom subtle text */}
        <div className="px-8 pb-8">
          <p className="text-xs text-center text-muted-foreground/70">
            Free to join. No credit card required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptDialog;
