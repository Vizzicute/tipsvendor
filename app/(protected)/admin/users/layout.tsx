import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - Admin"
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 