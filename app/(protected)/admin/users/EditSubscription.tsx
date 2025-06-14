"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import EditSubscriptionForm from "./EditSubscriptionForm";
import { Models } from "appwrite";

const EditSubscription = ({subscription}: {subscription: Models.Document}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Edit Subscription</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <EditSubscriptionForm sub={subscription} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscription; 