import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { freezeSubscription } from "@/lib/appwrite/update";

interface UnfreezeSubscriptionProps {
  subscriptionId: string;
  text: string;
}

const UnfreezeSubscription = ({
  subscriptionId,
  text,
}: UnfreezeSubscriptionProps) => {
  const [open, setOpen] = useState(false);
  const [isUnfreezing, setIsUnfreezing] = useState(false);
  const queryClient = useQueryClient();

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOpen(false);
    }
  }

  const handleOpenDialog = (e: Event) => {
    e.preventDefault();
    setTimeout(() => setOpen(true), 10);
  };

  async function handleDelete() {
    try {
      setIsUnfreezing(true);
      await freezeSubscription(subscriptionId, false);
      toast.success("Subscription Unfrozen");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setOpen(false);
    } catch {
      toast("Failed. Please try again.");
    } finally {
      setIsUnfreezing(false);
    }
  }

  return (
    <>
      <DropdownMenuItem className="text-cyan-600" onSelect={handleOpenDialog}>
        Unfreeze {text}
      </DropdownMenuItem>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfreeze {text}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to Unfreeze this {text}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUnfreezing}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={() => handleDelete()}
              loading={isUnfreezing}
              className="text-white bg-cyan-600"
            >
              Unfreeze
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnfreezeSubscription;
