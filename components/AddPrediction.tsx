import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import AddPredictionForm from "@/app/(protected)/admin/predictions/AddPredictionForm";

const AddPrediction = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add Prediction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] sm:max-h-[90%] sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-center text-stone-600">
            Add Prediction
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <AddPredictionForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPrediction;
