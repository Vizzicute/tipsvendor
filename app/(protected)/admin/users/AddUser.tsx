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
import AddUserForm from "./AddUserForm";
const AddUser = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50%] sm:max-h-[70%] sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-center text-stone-600">
            Add User
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <AddUserForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
