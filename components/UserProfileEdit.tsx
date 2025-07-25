
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import UserProfileForm from "@/app/dashboard/UserProfileForm";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
} from "./ui/drawer";
import { IUser } from "@/types";

interface UserProfileEditProps {
  user: IUser;
}

const UserProfileEdit = ({ user }: UserProfileEditProps) => {
  return (
    <div>
      {/* Show Dialog on md and up */}
      <div className="hidden md:block">
        <Dialog modal={false}>
          <DialogTrigger asChild>
            <Button className="bg-black text-secondary rounded-md px-2">
              Update Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[60%] h-[70%] overflow-y-scroll p-2 rounded-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Update Profile
              </DialogTitle>
            </DialogHeader>
            <UserProfileForm user={user as IUser} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Show Drawer on small screens */}
      <div className="md:hidden">
        <Drawer modal={false}>
          <DrawerTrigger asChild>
            <Button className="bg-black text-secondary rounded-md px-2">
              Update Profile
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full rounded-sm px-2 py-4">
            <div className="w-full h-full flex flex-col p-2 overflow-y-scroll">
              <DrawerHeader>
                <DialogTitle className="text-2xl font-semibold">
                  Update Profile
                </DialogTitle>
              </DrawerHeader>
              <UserProfileForm user={user as IUser} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default UserProfileEdit;
