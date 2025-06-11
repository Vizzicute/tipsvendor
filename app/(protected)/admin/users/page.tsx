"use client";

import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import AddSubscription from "./AddSubscription";
import { Card, CardContent } from "@/components/ui/card";
import {
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
import { getSubscriptions, getUsers } from "@/lib/appwrite/fetch";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditUserForm from "./EditUserForm";
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get("tab") || "users";
  
    const handleTabChange = (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", value);
      router.replace(`?${params.toString()}`, { scroll: false });
    };
  
  const {
    data: users,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getUsers,
  });

  const {
    data: subscriptions,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab] = useState(tab);

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

  const totalPages = Math.ceil(
    (activeTab === "users"
      ? users?.filter((data) => data.role === "user")?.length || 0
      : subscriptions?.length || 0) / PAGE_SIZE
  );

  const onlyUsers = users?.filter((data) => data.role === "user");

  const paginatedData =
    activeTab === "users"
      ? onlyUsers?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      : subscriptions?.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const searchedUsers = paginatedData?.filter(
    (data) =>
      data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.subscriptionType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = searchedUsers?.filter((data) => {
    const today = getDateOnly(new Date());
    const yesterday = getDateOnly(new Date(Date.now() - 86400000));

    if (filterBy === "") return true;

    const usersDate = getDateOnly(data.$createdAt);

    if (filterBy === "today") return usersDate === today;
    if (filterBy === "yesterday") return usersDate === yesterday;

    if (filterBy === "custom-date" && startDate && endDate) {
      const start = getDateOnly(startDate);
      const end = getDateOnly(endDate);
      return usersDate >= start && usersDate <= end;
    }

    if (activeTab === "subscriptions") {
      if (filterBy === "valid") return data.status === "active";
      if (filterBy === "expired") return data.status === "expired";
      if (filterBy === "frozen") return data.status === "frozen";
    }

    return true;
  });

  const sortedUsers = filteredUsers?.sort((a, b) => {
    switch (sortBy) {
      case "":
        return b.$createdAt.localeCompare(a.$createdAt);
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "email-asc":
        return (a.email || "").localeCompare(b.email || "");
      case "email-desc":
        return (b.email || "").localeCompare(a.email || "");
      case "country-asc":
        return (a.country || "").localeCompare(b.country || "");
      case "country-desc":
        return (b.country || "").localeCompare(a.country || "");
      case "subscription-asc":
        return (a.subscriptionType || "").localeCompare(
          b.subscriptionType || ""
        );
      case "subscription-desc":
        return (b.subscriptionType || "").localeCompare(
          a.subscriptionType || ""
        );
      default:
        return 0;
    }
  });

  const FilterButton = () => (
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
          {filterBy === "yesterday" && <>Filter By: Joined Yesterday</>}
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
          {activeTab === "subscriptions" && filterBy === "valid" && (
            <>Filter By: Valid Subscriptions</>
          )}
          {activeTab === "subscriptions" && filterBy === "expired" && (
            <>Filter By: Expired Subscriptions</>
          )}
          {activeTab === "subscriptions" && filterBy === "frozen" && (
            <>Filter By: Frozen Subscriptions</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit flex flex-col gap-0">
        {activeTab === "users" ? (
          <>
            <Button variant={"ghost"} onClick={() => setFilterBy("yesterday")}>
              Joined Yesterday
              {filterBy === "yesterday" && <Check />}
            </Button>
            <Button variant={"ghost"} onClick={() => setFilterBy("today")}>
              Joined Today
              {filterBy === "today" && <Check />}
            </Button>
          </>
        ) : (
          <>
            <Button variant={"ghost"} onClick={() => setFilterBy("valid")}>
              Valid Subscriptions
              {filterBy === "valid" && <Check />}
            </Button>
            <Button variant={"ghost"} onClick={() => setFilterBy("expired")}>
              Expired Subscriptions
              {filterBy === "expired" && <Check />}
            </Button>
            <Button variant={"ghost"} onClick={() => setFilterBy("frozen")}>
              Frozen Subscriptions
              {filterBy === "frozen" && <Check />}
            </Button>
          </>
        )}
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
                  {startDate ? format(startDate, "PPP") : <span>From</span>}
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
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        {activeTab === "users" ? <AddUser /> : <AddSubscription />}
      </div>
      <Tabs
        value={tab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Users by Name, Email or Country..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="ml-2 flex space-x-2">
                  <FilterButton />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Sort By
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                        Name (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                        Name (Z-A)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("email-asc")}>
                        Email (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("email-desc")}>
                        Email (Z-A)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("country-asc")}
                      >
                        Country (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("country-desc")}
                      >
                        Country (Z-A)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers?.map((user) => (
                      <TableRow key={user.$id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.country ? user.country : "N/A"}</TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full text-center ${
                              user.isVerified === true
                                ? "text-green-500 bg-green-100"
                                : "text-red-500 bg-red-100"
                            }`}
                          >
                            {user.isVerified === true ? "verified" : "not verified"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.$createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Filter className="h-4 w-4" />
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
                                    Edit User
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[40%] sm:max-h-[50%] md:overflow-hidden">
                                  <DialogHeader>
                                    <DialogTitle className="text-center text-stone-600">
                                      Edit User
                                    </DialogTitle>
                                  </DialogHeader>
                                  <EditUserForm user={user} />
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DeleteUserDialog
                                accountId={user.$id}
                                text="User"
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Subscriptions by Type or Status..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="ml-2 flex space-x-2">
                  <FilterButton />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Sort By
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSortBy("subscription-asc")}
                      >
                        Plan (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("subscription-desc")}
                      >
                        Plan (Z-A)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions?.map((subscription: any) => (
                      <TableRow key={subscription.$id}>
                        <TableCell>{subscription.user.email}</TableCell>
                        <TableCell className="capitalize">
                          {subscription.subscriptionType}
                        </TableCell>
                        <TableCell>{subscription.duration} days</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              subscription.isValid
                                ? "bg-green-100 text-green-800"
                                : subscription.isValid === false
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {subscription.isValid
                              ? "Valid"
                              : subscription.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(subscription.$createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Filter className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                Edit Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-amber-500">
                                Freeze Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Cancel Subscription
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
