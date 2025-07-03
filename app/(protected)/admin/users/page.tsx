"use client";

import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import AddSubscription from "./AddSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Check, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import CancelSubscription from "@/components/CancelSubscription";
import FreezeSubscription from "@/components/FreezeSubscription";
import UnfreezeSubscription from "@/components/UnfreezeSubscription";
import EditSubscription from "./EditSubscription";
import { useSubscriptions, useUsers } from "@/lib/react-query/queries";
import { getCollectionCounts } from "@/lib/appwrite/fetch";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "users";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [totalSubCount, setTotalSubCount] = useState(0);

  const filters: any = {};
  if (searchTerm) {
    filters.name = searchTerm;
    filters.email = searchTerm;
    filters.country = searchTerm;
  }
  if (filterBy === "today") {
    const today = new Date().toISOString().split("T")[0];
    filters.startDate = today;
    filters.endDate = today;
  }
  if (filterBy === "yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yest = d.toISOString().split("T")[0];
    filters.startDate = yest;
    filters.endDate = yest;
  }
  if (filterBy === "custom-date" && startDate && endDate) {
    filters.startDate = startDate.toISOString().split("T")[0];
    filters.endDate = endDate.toISOString().split("T")[0];
  }
  if (tab === "subscriptions") {
    if (filterBy === "valid") filters.status = "active";
    if (filterBy === "expired") filters.status = "expired";
    if (filterBy === "frozen") filters.status = "frozen";
  }

  const { data: users, isLoading: usersLoading } = useUsers(filters, currentPage, PAGE_SIZE);
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions(currentPage, PAGE_SIZE);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const userCountDoc = await getCollectionCounts("user");
        setTotalUserCount(userCountDoc.counts || 0);
        const subCountDoc = await getCollectionCounts("subscription");
        setTotalSubCount(subCountDoc.counts || 0);
      } catch (e) {
        setTotalUserCount(0);
        setTotalSubCount(0);
      }
    }
    fetchCounts();
  }, [filters, tab]);

  const totalPages = tab === "users"
    ? Math.ceil(totalUserCount / PAGE_SIZE)
    : Math.ceil(totalSubCount / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                  <span>from: {startDate.toISOString().split("T")[0]}</span>
                  <span>to: {endDate.toISOString().split("T")[0]}</span>
                </span>
              </span>
            </>
          )}
          {tab === "subscriptions" && filterBy === "valid" && (
            <>Filter By: Valid Subscriptions</>
          )}
          {tab === "subscriptions" && filterBy === "expired" && (
            <>Filter By: Expired Subscriptions</>
          )}
          {tab === "subscriptions" && filterBy === "frozen" && (
            <>Filter By: Frozen Subscriptions</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit flex flex-col gap-0">
        {tab === "users" ? (
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
        {tab === "users" ? <AddUser /> : <AddSubscription />}
      </div>
      <Tabs value={tab} className="w-full" onValueChange={handleTabChange}>
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
                    {(tab === "users" ? users : subscriptions)?.map((item) => (
                      <TableRow key={item.$id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          {item.country ? item.country : "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full text-center ${
                              item.isVerified === true
                                ? "text-green-500 bg-green-100"
                                : "text-red-500 bg-red-100"
                            }`}
                          >
                            {item.isVerified === true
                              ? "verified"
                              : "not verified"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.$createdAt), "PPP")}
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
                              <Dialog>
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
                                  <EditUserForm user={item} />
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DeleteUserDialog
                                accountId={item.$id}
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
              <div className="mt-4 flex flex-col gap-2">
                <div className="w-full text-center font-light">
                  Page {currentPage.toString().padStart(2, "0")} of {totalPages.toString().padStart(2, "0")}
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
                    {(tab === "users" ? users : subscriptions)?.map((item) => (
                      <TableRow key={item.$id}>
                        <TableCell>{item.user?.email}</TableCell>
                        <TableCell className="capitalize">
                          {item.subscriptionType}
                        </TableCell>
                        <TableCell>{item.duration} days</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.isValid === true &&
                              item.isFreeze === false
                                ? "bg-green-100 text-green-800"
                                : item.isValid === false
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.isValid === true &&
                            item.isFreeze === false
                              ? "Valid"
                              : item.isValid === false
                              ? "Expired"
                              : "Freezed"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.$createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Filter className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <EditSubscription subscription={item} />
                              <DropdownMenuSeparator />
                              {item.isFreeze === true ? (
                                <UnfreezeSubscription
                                  subscriptionId={item.$id}
                                  text="Subscription"
                                />
                              ) : (
                                <FreezeSubscription
                                  subscriptionId={item.$id}
                                  text="Subscription"
                                />
                              )}
                              <CancelSubscription
                                subscriptionId={item.$id}
                                text="Subscription"
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="w-full text-center font-light">
                  Page {currentPage.toString().padStart(2, "0")} of {totalPages.toString().padStart(2, "0")}
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
