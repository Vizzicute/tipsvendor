import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddStaffForm from "./AddStaffForm";
const AddStaff = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50%] sm:max-h-[90%] sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-center text-stone-600">
            Add Staff
          </DialogTitle>
        </DialogHeader>
        <AddStaffForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddStaff;
