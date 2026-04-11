import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthPromptDialog = ({ open, onOpenChange }: AuthPromptDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <DialogTitle className="text-xl">Please Login or Signup to continue</DialogTitle>
          <DialogDescription>
            You need an account to submit a bounty application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              onOpenChange(false);
              navigate("/login");
            }}
          >
            Login
          </Button>
          <Button
            size="lg"
            onClick={() => {
              onOpenChange(false);
              navigate("/signup");
            }}
          >
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptDialog;
