"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Models } from "node-appwrite";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { updateCommentStatus } from "@/lib/appwrite/update";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { truncate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
interface BlogCommentsProps {
  comments: Models.Document[];
  isLoading: boolean;
}

const BlogComments = ({ comments, isLoading }: BlogCommentsProps) => {
  const queryClient = useQueryClient();
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const totalPages = Math.ceil((comments?.length || 0) / PAGE_SIZE);

  const paginatedData = comments?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const searchedComments = paginatedData?.filter(
    (comment) =>
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprove = async (commentId: string) => {
    setIsApproving(true);
    const response = await updateCommentStatus("approved", commentId);

    if (!response) {
      toast.error("Failed to approve comment");
    } else {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment approved");
    }
    setIsApproving(false);
  };

  const handleReject = async (commentId: string) => {
    setIsRejecting(true);
    const response = await updateCommentStatus("rejected", commentId);

    if (!response) {
      toast.error("Failed to reject comment");
    } else {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment rejected");
    }
    setIsRejecting(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search comments by content or author"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">
              Loading Comments...
            </h3>
          </div>
        ) : searchedComments?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">
              No comments found
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedComments?.map((comment) => (
                  <TableRow key={comment.$id}>
                    <TableCell className="font-medium">
                      {comment.user?.name || comment.guestName}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{truncate(comment.content, 20)}</span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-100 text-slate-800 max-w-70 break-words justify-items-stretch">
                          <span>
                            {comment.content}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(comment.createdAt)}</TableCell>
                    <TableCell>
                      <span
                        className={`capitalize rounded-full px-2 py-1 text-xs ${
                          comment.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : comment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {comment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-more-horizontal"
                            >
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {comment.status !== "approved" && (<DropdownMenuItem
                            onClick={() => handleApprove(comment.$id)}
                            disabled={isApproving}
                            className={
                              isApproving ? "opacity-50 cursor-not-allowed" : ""
                            }
                          >
                            {isApproving ? (
                              <div className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Approving...
                              </div>
                            ) : (
                              "Approve"
                            )}
                          </DropdownMenuItem>)}
                          {comment.status !== "rejected" && (<DropdownMenuItem
                            onClick={() => handleReject(comment.$id)}
                            disabled={isRejecting}
                            className={
                              isRejecting ? "opacity-50 cursor-not-allowed" : ""
                            }
                          >
                            {isRejecting ? (
                              <div className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Rejecting...
                              </div>
                            ) : (
                              "Reject"
                            )}
                          </DropdownMenuItem>)}
                          <DeleteCommentDialog
                            commentId={comment.$id}
                            text="Comment"
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogComments;
