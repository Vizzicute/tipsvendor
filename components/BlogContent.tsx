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
import {
  ArrowDownAZ,
  ArrowUpZA,
  CalendarIcon,
  Check,
  Filter,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, truncate } from "@/lib/utils";
import { format } from "date-fns";

import DeleteBlogDialog from "@/components/DeleteBlogDialog";
import Link from "next/link";
import BlogStatusActionDialog from "@/components/BlogStatusActionDialog";
import { Models } from "node-appwrite";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
interface BlogContentProps {
  blog: Models.Document[];
  isLoading: boolean;
}

const BlogContent = ({ blog, isLoading }: BlogContentProps) => {
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [, setOpenDropdown1] = useState(false);
  const closeDropdown1 = (v: boolean | ((prevState: boolean) => boolean)) =>
    setOpenDropdown1(v);

  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const getDateOnly = (input: string | Date) => {
    const date = new Date(input);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    if (startDate && endDate) {
      setFilterBy("custom-date");
    }
  }, [startDate, endDate]);

  const searchedBlog = blog?.filter((data) =>
    data.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlog = searchedBlog?.filter((data) => {
    const today = getDateOnly(new Date());
    const yesterday = getDateOnly(new Date(Date.now() - 86400000));
    const tomorrow = getDateOnly(new Date(Date.now() + 86400000));

    if (filterBy === "") return true;

    const blogDate = getDateOnly(data.$createdAt);

    if (filterBy === "today") return blogDate === today;
    if (filterBy === "yesterday") return blogDate === yesterday;
    if (filterBy === "tomorrow") return blogDate === tomorrow;

    if (filterBy === "custom-date" && startDate && endDate) {
      const start = getDateOnly(startDate);
      const end = getDateOnly(endDate);
      return blogDate >= start && blogDate <= end;
    }

    if (["draft", "scheduled", "published"].includes(filterBy)) {
      return data.status === filterBy;
    }

    return true;
  });

  const sortedBlog = filteredBlog?.sort((a, b) => {
    switch (sortBy) {
      case "":
        return b.$createdAt?.localeCompare(a.$createdAt);
      case "category-asc":
        return a.categories?.localeCompare(b.categories);
      case "category-desc":
        return b.categories?.localeCompare(a.categories);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil((sortedBlog?.length || 0) / PAGE_SIZE);

  const paginatedData = sortedBlog?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

   const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formattedDate = (date: Date): string =>
    date.toISOString().split("T")[0];
  const formattedTime = (date: Date): string =>
    date.toTimeString().split(":").slice(0, 2).join(":");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Blog by Title"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-2 flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex items-start size-auto ${
                      filterBy !== "" && "bg-slate-200"
                    }`}
                  >
                    {filterBy === "" && (
                      <>
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </>
                    )}
                    {filterBy === "yesterday" && (
                      <>Filter By: Yesterday's Blog</>
                    )}
                    {filterBy === "today" && <>Filter By: Today's blog</>}
                    {filterBy === "tomorrow" && <>Filter By: Tomorrow's blog</>}
                    {filterBy === "draft" && <>Filter By: Draft Blogs</>}
                    {filterBy === "scheduled" && (
                      <>Filter By: Scheduled Blogs</>
                    )}
                    {filterBy === "published" && (
                      <>Filter By: Published Blogs</>
                    )}
                    {filterBy === "custom-date" && startDate && endDate && (
                      <>
                        <span className="text-[10px] gap-2 justify-center flex flex-row items-center">
                          <span className="font-semibold text-start">
                            Filter By: Date Range
                          </span>
                          <span className="flex flex-col text-end">
                            <span>from: {getDateOnly(startDate)}</span>
                            <span>to: {getDateOnly(endDate)}</span>
                          </span>
                        </span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit h-fit flex flex-col gap-0">
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("yesterday")}
                  >
                    Yesterday's Blog
                    {filterBy === "yesterday" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("today")}
                  >
                    Today's Blog
                    {filterBy === "today" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("tomorrow")}
                  >
                    Tomorrow's Blog
                    {filterBy === "tomorrow" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("draft")}
                  >
                    Draft Blogs
                    {filterBy === "draft" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("scheduled")}
                  >
                    Scheduled Blogs
                    {filterBy === "scheduled" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("published")}
                  >
                    Published Blogs
                    {filterBy === "published" && <Check />}
                  </Button>
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-sm">Custom Date Filter: </span>
                    <div className="flex flex-col gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>From</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {endDate ? format(endDate, "PPP") : <span>To</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {filterBy === "custom-date" && <Check />}
                  </div>
                  <Button variant={"ghost"} onClick={() => setFilterBy("")}>
                    Reset
                  </Button>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex items-start ${
                      sortBy !== "" && "bg-slate-200"
                    }`}
                  >
                    {sortBy === "" ? (
                      <>
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                        Sort By
                      </>
                    ) : sortBy === "category-asc" ? (
                      <>
                        Sort By: Categories
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Sort By: Categories
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="w-full flex flex-col text-[10px]">
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("category-asc")}
                    >
                      Category Asc
                      {sortBy === "category-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("category-desc")}
                    >
                      Category Desc
                      {sortBy === "category-desc" && <Check />}
                    </Button>
                    <Button variant={"ghost"} onClick={() => setSortBy("")}>
                      Reset
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                Loading Blog...
              </h3>
            </div>
          ) : sortedBlog?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No Blog found
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <Table className="no-scrollbar">
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">CreatedAt</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Added By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData?.map((data) => (
                  <TableRow key={data.$id} className="text-center">
                    <TableCell className="font-normal flex flex-wrap">
                      {formattedDate(new Date(data.$createdAt)) ===
                      formattedDate(new Date(today))
                        ? "Today"
                        : formattedDate(new Date(data.$createdAt)) ===
                          formattedDate(new Date(yesterday))
                        ? "Yesterday"
                        : formattedDate(new Date(data.$createdAt))}{" "}
                      at {formattedTime(new Date(data.$createdAt))}
                    </TableCell>
                    <TableCell>{truncate(data.title, 30)}</TableCell>
                    <TableCell>
                      <span
                        className={`capitalize rounded-full p-1 text-[13px] ${
                          data.status === "published"
                            ? "text-green-400 bg-green-100"
                            : data.status === "scheduled"
                            ? "text-orange-400 bg-orange-100"
                            : "text-gray-400 bg-gray-100"
                        }`}
                      >
                        {data.status}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize">
                      <span className="rounded-full p-1 text-sm bg-stone-100">
                        {data.user.role === "admin"
                          ? "Admin"
                          : data.user.role === "blog_manager"
                          ? "Blog Manager"
                          : data.user.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu
                        modal={false}
                        onOpenChange={(v) => closeDropdown1(v)}
                      >
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
                          <DropdownMenuItem>
                            <Link href={`/admin/blog/edit-blog/${data.$id}`}>
                              Edit Blog Post
                            </Link>
                          </DropdownMenuItem>
                          <BlogStatusActionDialog
                            text={
                              data.status !== "published"
                                ? "Publish"
                                : "Unpublish"
                            }
                            status={data.status}
                            blogId={data.$id}
                            publishedDate={data.publishedAt}
                          />
                          <DeleteBlogDialog blogId={data.$id} text="delete" />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="capitalize text-stone-700">
                            Added By {data.user.name} - {data.user.role}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="w-full text-center font-light">
        Page {currentPage} of {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default BlogContent;
