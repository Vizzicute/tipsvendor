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
import { useDeleteSubscription } from "@/lib/react-query/queriesAndMutations";

interface CancelSubscriptionProps {
  subscriptionId: string;
  text: string;
}

const CancelSubscription = ({
  subscriptionId,
  text,
}: CancelSubscriptionProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSubscription, isPending: isDeleting } =
    useDeleteSubscription();

  function handleOpenChange(open: boolean) {
    if (!open || !isDeleting) {
      setOpen(false);
    }
  }

  const handleOpenDialog = (e: Event) => {
    e.preventDefault();
    setTimeout(() => setOpen(true), 10);
  };

  async function handleDelete() {
    try {
      await deleteSubscription(subscriptionId);
      toast.success("Subscription Cancelled");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setOpen(false);
    } catch {
      toast("Failed. Please try again.");
    }
  }

  return (
    <>
      <DropdownMenuItem className="text-red-600" onSelect={handleOpenDialog}>
        Cancel {text}
      </DropdownMenuItem>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel {text}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this {text}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              No
            </Button>
            <LoadingButton
              variant="destructive"
              onClick={() => handleDelete()}
              loading={isDeleting}
              className="text-white"
            >
              Yes
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CancelSubscription;
