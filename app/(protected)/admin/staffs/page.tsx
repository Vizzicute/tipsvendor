"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownAZ,
  ArrowUpZA,
  CalendarIcon,
  Check,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { getUsers } from "@/lib/appwrite/fetch";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddStaff from "./AddStaff";
import EditStaffForm from "./EditStaffForm";
import DeleteUserDialog from "@/components/DeleteUserDialog";


const page = () => {
  const {
    data: staffs,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getUsers,
  });

  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [opendropdown1, setOpenDropdown1] = useState(false);
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

  const totalPages = Math.ceil((staffs?.length || 0) / PAGE_SIZE);

  const onlyStaffs = staffs?.filter((data) => data.role !== "user");

  const paginatedData = onlyStaffs?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const searchedstaffs = paginatedData?.filter(
    (data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredstaffs = searchedstaffs?.filter((data) => {
    const today = getDateOnly(new Date());
    const yesterday = getDateOnly(new Date(Date.now() - 86400000));
    const tomorrow = getDateOnly(new Date(Date.now() + 86400000));

    if (filterBy === "") return true;

    const staffsDate = getDateOnly(data.$createdAt); // Normalize DB date

    if (filterBy === "today") return staffsDate === today;
    if (filterBy === "yesterday") return staffsDate === yesterday;

    if (filterBy === "custom-date" && startDate && endDate) {
      const start = getDateOnly(startDate);
      const end = getDateOnly(endDate);
      return staffsDate >= start && staffsDate <= end;
    }
    return true;
  });

  const sortedstaffs = filteredstaffs?.sort((a, b) => {
    switch (sortBy) {
      case "":
        return b.$createdAt.localeCompare(a.$createdAt);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "email-asc":
        return a.email.localeCompare(b.email);
      case "email-desc":
        return b.email.localeCompare(a.email);
      case "country-asc":
        return a.country.localeCompare(b.country);
      case "country-desc":
        return b.country.localeCompare(a.country);
      default:
        return 0;
    }
  });

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
    <div className="space-y-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Staffs</h1>
        <AddStaff />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staffs by Name, Email or Country..."
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
                      <>Filter By: Joined Yesterday</>
                    )}
                    {filterBy === "today" && <>Filter By: Joined Today</>}
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
                    Joined Yesterday
                    {filterBy === "yesterday" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("today")}
                  >
                    Joined Today
                    {filterBy === "today" && <Check />}
                  </Button>
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-sm">Joined By Date Range: </span>
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
                    ) : sortBy === "name-asc" ? (
                      <>
                        Sort By: Name
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "name-desc" ? (
                      <>
                        Sort By: Name
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "hometeam-asc" ? (
                      <>
                        Sort By: Email
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "email-desc" ? (
                      <>
                        Sort By: Email
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "email-asc" ? (
                      <>
                        Sort By: Country
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Sort By: Country
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="w-full flex flex-col text-[10px]">
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("name-asc")}
                    >
                      Name Asc
                      {sortBy === "name-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("name-desc")}
                    >
                      Name Desc
                      {sortBy === "name-desc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("email-asc")}
                    >
                      Email Asc
                      {sortBy === "email-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("email-desc")}
                    >
                      Email Desc
                      {sortBy === "email-desc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("country-asc")}
                    >
                      Country Asc
                      {sortBy === "country-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("country-desc")}
                    >
                      Country Desc
                      {sortBy === "country-desc" && <Check />}
                    </Button>
                    <Button variant={"ghost"} onClick={() => setSortBy("")}>
                      Reset
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {sortedstaffs === undefined ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                Loading staffs...
              </h3>
            </div>
          ) : sortedstaffs?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No staffs found
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <Table className="no-scrollbar">
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">Date Joined</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Country</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedstaffs?.map((data) => (
                  <TableRow key={data.$id} className="text-center text-[13px]">
                    <TableCell>
                      {formattedDate(new Date(data.$createdAt)) ===
                      formattedDate(new Date(today))
                        ? "Today"
                        : formattedDate(new Date(data.$createdAt)) ===
                          formattedDate(new Date(yesterday))
                        ? "Yesterday"
                        : formattedDate(new Date(data.$createdAt))}
                    </TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{data.country}</TableCell>
                    <TableCell className="capitalize">{data.role}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full p-1 text-[12px] ${
                          data.isVerified === true
                            ? "text-green-400 bg-green-100"
                            : "text-red-400 bg-red-100"
                        }`}
                      >
                        {data.isVerified == true ? "Verified" : "Not Verified"}
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
                          <Dialog onOpenChange={closeDropdown1}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Edit Staff
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[60%] sm:max-h-[90%] h-[90vh] md:overflow-hidden">
                              <DialogHeader>
                                <DialogTitle className="text-center text-stone-600">
                                  Edit Staff
                                </DialogTitle>
                              </DialogHeader>
                              <EditStaffForm staff={data} />
                            </DialogContent>
                          </Dialog>
                          <DeleteUserDialog accountId={data.$id} text="Staff" />
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
    </div>
  );
};

export default page;
