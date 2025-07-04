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
import { useDeleteBlog } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateCollectionCounts } from "@/lib/appwrite/update";
import { getCollectionCounts } from "@/lib/appwrite/fetch";

interface DeleteBlogDialogProps {
  blogId: string;
  text: string;
}

const DeleteBlogDialog = ({
  blogId,
  text,
}: DeleteBlogDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {data: oldData} = useQuery({
    queryKey: ["collectionCounts"],
    queryFn: () => getCollectionCounts("blog"),
  });
  const { mutateAsync: deleteBlog, isPending: isDeleting } =
    useDeleteBlog();

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
      await deleteBlog(blogId);
      toast.success("Blog Deleted");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      if (oldData) {
        await updateCollectionCounts({
          blogs: oldData?.counts - 1
        }, oldData?.$id);
      }
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

export default DeleteBlogDialog;
