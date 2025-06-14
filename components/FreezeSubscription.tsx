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

interface FreezeSubscriptionProps {
  subscriptionId: string;
  text: string;
}

const FreezeSubscription = ({
  subscriptionId,
  text,
}: FreezeSubscriptionProps) => {
  const [open, setOpen] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
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
      setIsFreezing(true);
      await freezeSubscription(subscriptionId, true);
      toast.success("Subscription Frozen");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setOpen(false);
    } catch {
      toast("Failed. Please try again.");
    } finally {
      setIsFreezing(false);
    }
  }

  return (
    <>
      <DropdownMenuItem className="text-yellow-600" onSelect={handleOpenDialog}>
        Freeze {text}
      </DropdownMenuItem>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze {text}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to Freeze this {text}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isFreezing}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={() => handleDelete()}
              loading={isFreezing}
              className="text-white bg-amber-600"
            >
              Freeze
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreezeSubscription;
