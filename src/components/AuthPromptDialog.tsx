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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-2xl">
        {/* Top decorative bar */}
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-primary to-purple-500" />
        
        {/* Icon header */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
        </div>

        <DialogHeader className="px-6 pb-4 space-y-3">
          <DialogTitle className="text-2xl font-bold text-center tracking-tight">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed text-muted-foreground px-2">
            Sign in to your account or create a new one to submit bounty applications and unlock all features.
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="px-6 pb-8 pt-2 space-y-3">
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-cyan-500/40 hover:scale-[1.02] group"
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
            className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all duration-200 group"
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
        <div className="px-6 pb-6">
          <p className="text-xs text-center text-muted-foreground/60">
            Free to join. No credit card required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptDialog;
