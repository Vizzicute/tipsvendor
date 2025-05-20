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
import { useUpdateBlogStatus } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface BlogStatusDialogProps {
  blogId: string;
  status: string;
  text: string;
  publishedDate: Date;
}

const BlogStatusActionDialog = ({
  blogId,
  text,
  status,
  publishedDate,
}: BlogStatusDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateBlogStatus, isPending } = useUpdateBlogStatus();

  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      setOpen(false);
    }
  }

  const handleOpenDialog = (e: Event) => {
    e.preventDefault();
    setTimeout(() => setOpen(true), 10);
  };

  const [publishedAt, setPublishedAt] = useState<Date>(publishedDate);
  const [newStatus, setNewStatus] = useState(status);

  async function handleUpdateStatus() {
    try {
      const updatedStatus = status !== "published" ? "published" : "draft";
      const updatedPublishedAt =
        updatedStatus === "published" ? new Date() : publishedDate;

      await updateBlogStatus({
        blogId,
        status: updatedStatus,
        publishedAt: updatedPublishedAt,
      });
      toast.success(
        `Blog ${status === "published" ? "Unpublished" : "Published"}`
      );
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setOpen(false);
    } catch {
      toast("Failed. Please try again.");
    }
  }

  return (
    <>
      <DropdownMenuItem onSelect={handleOpenDialog}>
        {status !== "published" ? (
          <span className="text-cyan-500">Publish Now</span>
        ) : (
          <span className="text-orange-500">Unpublish</span>
        )}
      </DropdownMenuItem>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{text} Blog?</DialogTitle>
            <DialogDescription>
              Are you sure you want to {text} this Blog?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={() => handleUpdateStatus()}
              loading={isPending}
              className="text-white bg-cyan-500"
            >
              {text}
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogStatusActionDialog;
