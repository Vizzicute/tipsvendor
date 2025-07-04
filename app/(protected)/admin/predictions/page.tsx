"use client";

import AddPrediction from "@/components/AddPrediction";
import DeletePredictionDialog from "@/components/DeletePredictionDialog";
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
import AddResult from "./AddResult";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditPredictionForm from "./EditPredictionForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePredictions } from "@/lib/react-query/queries";
import { getCollectionCounts } from "@/lib/appwrite/fetch";


const page = () => {
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [totalCount, setTotalCount] = useState(0);

  const filters: any = {};
  if (searchTerm) filters.tip = searchTerm; // You may want to expand this to search other fields server-side
  if (["win", "loss", "void", "N/A"].includes(filterBy)) filters.status = filterBy;
  if (["free", "investment", "vip", "mega"].includes(filterBy)) filters.subscriptionType = filterBy;
  if (filterBy === "today") filters.startDate = filters.endDate = new Date().toISOString().split("T")[0];
  if (filterBy === "yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    filters.startDate = filters.endDate = d.toISOString().split("T")[0];
  }
  if (filterBy === "tomorrow") {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    filters.startDate = filters.endDate = d.toISOString().split("T")[0];
  }
  if (filterBy === "custom-date" && startDate && endDate) {
    filters.startDate = startDate.toISOString().split("T")[0];
    filters.endDate = endDate.toISOString().split("T")[0];
  }

  const { data: predictions, isLoading } = usePredictions(filters, currentPage, PAGE_SIZE);

  useEffect(() => {
    async function fetchCount() {
      try {
        const countDoc = await getCollectionCounts("prediction");
        setTotalCount(countDoc.counts || 0);
      } catch (e) {
        setTotalCount(0);
      }
    }
    fetchCount();
  }, [filters]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Predictions</h1>
        <AddPrediction />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Predictions by Team or Leagues..."
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
                    {filterBy === "win" && <>Filter By: Win</>}
                    {filterBy === "loss" && <>Filter By: Loss</>}
                    {filterBy === "void" && <>Filter By: Void</>}
                    {filterBy === "N/A" && <>Filter By: No Result Yet</>}
                    {filterBy === "yesterday" && (
                      <>Filter By: Yesterday's Predictions</>
                    )}
                    {filterBy === "today" && <>Filter By: Today's Prediction</>}
                    {filterBy === "tomorrow" && (
                      <>Filter By: Tomorrow's Prediction</>
                    )}
                    {filterBy === "free" && <>Filter By: Free Tips</>}
                    {filterBy === "investment" && (
                      <>Filter By: Investment Plan</>
                    )}
                    {filterBy === "vip" && <>Filter By: Vip Tips</>}
                    {filterBy === "mega" && <>Filter By: Mega Odds</>}
                    {filterBy === "custom-date" && startDate && endDate && (
                      <>
                        <span className="text-[10px] gap-2 justify-center flex flex-row items-center">
                          <span className="font-semibold text-start">
                            Filter By: Date Range
                          </span>
                          <span className="flex flex-col text-end">
                            <span>from: {formattedDate(startDate)}</span>
                            <span>to: {formattedDate(endDate)}</span>
                          </span>
                        </span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit h-fit flex flex-col gap-0">
                  <div className="w-full flex flex-row justify-around items-center">
                    <Button
                      className="w-[23%]"
                      variant={"ghost"}
                      onClick={() => setFilterBy("win")}
                    >
                      Win
                      {filterBy === "win" && <Check />}
                    </Button>
                    <Button
                      className="w-[23%]"
                      variant={"ghost"}
                      onClick={() => setFilterBy("loss")}
                    >
                      Loss
                      {filterBy === "loss" && <Check />}
                    </Button>
                    <Button
                      className="w-[23%]"
                      variant={"ghost"}
                      onClick={() => setFilterBy("void")}
                    >
                      Void
                      {filterBy === "void" && <Check />}
                    </Button>
                    <Button
                      className="w-[23%]"
                      variant={"ghost"}
                      onClick={() => setFilterBy("N/A")}
                    >
                      N/A
                      {filterBy === "N/A" && <Check />}
                    </Button>
                  </div>
                  <Button variant={"ghost"} onClick={() => setFilterBy("free")}>
                    Free Tips
                    {filterBy === "free" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("investment")}
                  >
                    Investment Plan
                    {filterBy === "investment" && <Check />}
                  </Button>
                  <Button variant={"ghost"} onClick={() => setFilterBy("vip")}>
                    Vip Tips
                    {filterBy === "vip" && <Check />}
                  </Button>
                  <Button variant={"ghost"} onClick={() => setFilterBy("mega")}>
                    Mega Odds
                    {filterBy === "mega" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("yesterday")}
                  >
                    Yesterday's Prediction
                    {filterBy === "yesterday" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("today")}
                  >
                    Today's Prediction
                    {filterBy === "today" && <Check />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setFilterBy("tomorrow")}
                  >
                    Tomorrow's Prediction
                    {filterBy === "tomorrow" && <Check />}
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
                    ) : sortBy === "league-asc" ? (
                      <>
                        Sort By: League
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "league-desc" ? (
                      <>
                        Sort By: League
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "hometeam-asc" ? (
                      <>
                        Sort By: Home Team
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "hometeam-desc" ? (
                      <>
                        Sort By: Home Team
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : sortBy === "awayteam-asc" ? (
                      <>
                        Sort By: Away Team
                        <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Sort By: Away Team
                        <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="w-full flex flex-col text-[10px]">
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("league-asc")}
                    >
                      League Asc
                      {sortBy === "league-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("league-desc")}
                    >
                      League Desc
                      {sortBy === "league-desc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("hometeam-asc")}
                    >
                      HomeTeam Asc
                      {sortBy === "hometeam-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("hometeam-desc")}
                    >
                      HomeTeam Desc
                      {sortBy === "hometeam-desc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("awayteam-asc")}
                    >
                      AwayTeam Asc
                      {sortBy === "awayteam-asc" && <Check />}
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => setSortBy("awayteam-desc")}
                    >
                      AwayTeam Desc
                      {sortBy === "awayteam-desc" && <Check />}
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
                Loading predictions...
              </h3>
            </div>
          ) : predictions?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No predictions found
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <Table className="no-scrollbar">
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">League</TableHead>
                  <TableHead className="text-center">Matches</TableHead>
                  <TableHead className="text-center">Tips</TableHead>
                  <TableHead className="text-center">Scores</TableHead>
                  <TableHead className="text-center">Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions?.map((data) => (
                  <TableRow key={data.gameId} className="text-center">
                    <TableCell className="font-normal">
                      {formattedTime(new Date(data.datetime))}
                    </TableCell>
                    <TableCell>
                      {formattedDate(new Date(data.datetime)) ===
                      formattedDate(new Date(today))
                        ? "Today"
                        : formattedDate(new Date(data.datetime)) ===
                          formattedDate(new Date(yesterday))
                        ? "Yesterday"
                        : formattedDate(new Date(data.datetime)) ===
                          formattedDate(new Date(tomorrow))
                        ? "Tomorrow"
                        : formattedDate(new Date(data.datetime))}
                    </TableCell>
                    <TableCell className="uppercase">{data.league}</TableCell>
                    <TableCell>
                      {data.hometeam}{" "}
                      <span className="font-semibold text-primary">vs</span>{" "}
                      {data.awayteam}
                    </TableCell>
                    <TableCell>{data.tip}</TableCell>
                    <TableCell
                      className={`${
                        data.status === "win"
                          ? "text-green-500"
                          : data.status === "loss"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {data.homescore}:{data.awayscore}
                    </TableCell>
                    <TableCell className="capitalize">
                      {data.subscriptionType}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu
                        modal={false}
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Edit Prediction
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[80%] sm:max-h-[90%] h-[90vh] md:overflow-hidden">
                              <DialogHeader>
                                <DialogTitle className="text-center text-stone-600">
                                  Edit Prediction
                                </DialogTitle>
                              </DialogHeader>
                              <EditPredictionForm prediction={data} />
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Add Result
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[50%] sm:max-h-[90%] sm:h-fit">
                              <DialogHeader>
                                <DialogTitle className="text-center text-stone-600">
                                  Add Result
                                </DialogTitle>
                                <DialogDescription className="w-full flex flex-col justify-center items-center">
                                  <span className="flex items-center justify-center gap-2 font-semibold">
                                    <span className="capitalize">
                                      {data.hometeam}
                                    </span>
                                    <span>Vs</span>
                                    <span className="capitalize">
                                      {data.awayteam}
                                    </span>
                                  </span>
                                  <span className="text-center">
                                    Prediction: {data.tip}
                                  </span>
                                </DialogDescription>
                              </DialogHeader>
                              <AddResult prediction={data} />
                            </DialogContent>
                          </Dialog>
                          <DeletePredictionDialog
                            gameId={data.$id}
                            text="delete"
                          />
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
      c
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default page;
