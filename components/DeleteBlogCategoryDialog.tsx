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
import { useDeleteBlogCategory } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteBlogCategoryDialogProps {
  blogCategoryId: string;
  text: string;
}

const DeleteBlogCategoryDialog = ({
  blogCategoryId,
  text,
}: DeleteBlogCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteBlogCategory, isPending: isDeleting } =
    useDeleteBlogCategory();

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
      await deleteBlogCategory(blogCategoryId);
      toast.success("Blog Category Deleted");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setOpen(false);
    } catch {
      toast("Failed. Please try again.");
    }
  }

  return (
    <>
      <DropdownMenuItem className="text-red-600" onSelect={handleOpenDialog}>
        Delete
      </DropdownMenuItem>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {text}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {text}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="destructive"
              onClick={() => handleDelete()}
              loading={isDeleting}
              className="text-white"
            >
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteBlogCategoryDialog;
