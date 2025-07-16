
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTravelRequests, mockExpenseClaims } from "@/lib/data";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Check, X, PlusCircle, Upload, Plane, Receipt, FileText, Calendar as CalendarIcon, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TravelRequest, ExpenseClaim } from "@/types";
import type { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function RequestTravelDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: "Travel Request Submitted", description: "Your travel request has been submitted for approval." });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plane className="mr-2 h-4 w-4" />
          Request Travel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Travel Request</DialogTitle>
          <DialogDescription>
            Fill out the details for your upcoming business travel.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g., London, UK" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Travel</Label>
              <Textarea id="purpose" placeholder="e.g., Attend client meeting, conference" />
            </div>
            <div className="space-y-2">
              <Label>Travel Dates</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input id="estimatedCost" type="number" placeholder="e.g., 2500" />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-auto pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SubmitExpenseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [expenseDate, setExpenseDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    toast({ title: "Expense Submitted", description: "Your expense claim has been submitted." });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Receipt className="mr-2 h-4 w-4" />
          Submit Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Submit Expense Claim</DialogTitle>
          <DialogDescription>
            Submit an expense for reimbursement. Attach receipts where applicable.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expense-type">Expense Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="meals">Meals</SelectItem>
                <SelectItem value="transport">Local Transport</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input id="amount" type="number" placeholder="e.g., 150.75" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-date">Date of Expense</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expenseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expenseDate ? format(expenseDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expenseDate}
                  onSelect={setExpenseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Attach Receipt</Label>
            <Input id="receipt-upload" type="file" className="hidden" onChange={handleFileChange} />
            <Button asChild variant="outline" className="w-full">
              <Label htmlFor="receipt-upload" className="cursor-pointer">
                {fileName ? <FileText className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                {fileName || "Choose file"}
              </Label>
            </Button>
          </div>
        </div>
        </ScrollArea>
        <DialogFooter className="mt-auto pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TravelPage() {
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>(mockTravelRequests);
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>(mockExpenseClaims);
  
  // Filters for Travel Requests
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [requestDateRange, setRequestDateRange] = useState<DateRange | undefined>();
  
  // Filters for Expense Claims
  const [expenseSearchTerm, setExpenseSearchTerm] = useState("");
  const [expenseStatusFilter, setExpenseStatusFilter] = useState("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState("all");
  const [expenseDateRange, setExpenseDateRange] = useState<DateRange | undefined>();


  const destinations = [...new Set(mockTravelRequests.map(r => r.destination))];
  const expenseTypes = [...new Set(mockExpenseClaims.map(c => c.expenseType))];

  const handleStatusChange = (id: string, status: 'Approved' | 'Denied') => {
    setTravelRequests(travelRequests.map(req => req.id === id ? { ...req, status } : req));
  };
  
  const handleClaimStatusChange = (id: string, status: ExpenseClaim['status']) => {
    setExpenseClaims(expenseClaims.map(req => req.id === id ? { ...req, status } : req));
  };

  const getStatusBadgeVariant = (status: TravelRequest['status'] | ExpenseClaim['status']) => {
    switch(status) {
        case 'Approved': return 'bg-green-500/20 text-green-700 border-green-500/20';
        case 'Pending':
        case 'Submitted': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
        case 'Denied': return 'bg-red-500/20 text-red-700 border-red-500/20';
        case 'Reimbursed': return 'bg-blue-500/20 text-blue-700 border-blue-500/20';
        default: return 'secondary';
    }
  }

  const filteredTravelRequests = useMemo(() => {
    return travelRequests
      .filter(req =>
        req.employeeName.toLowerCase().includes(requestSearchTerm.toLowerCase())
      )
      .filter(req =>
        requestStatusFilter === "all" || req.status === requestStatusFilter
      )
      .filter(req =>
        destinationFilter === "all" || req.destination === destinationFilter
      )
      .filter(req => {
        if (!requestDateRange || (!requestDateRange.from && !requestDateRange.to)) return true;
        const from = requestDateRange.from ? startOfDay(requestDateRange.from) : undefined;
        const to = requestDateRange.to ? endOfDay(requestDateRange.to) : from;
        if (!from || !to) return true;
        
        return isWithinInterval(req.startDate, { start: from, end: to }) || 
               isWithinInterval(req.endDate, { start: from, end: to }) ||
               (req.startDate < from && req.endDate > to);
      });
  }, [travelRequests, requestSearchTerm, requestStatusFilter, destinationFilter, requestDateRange]);

  const filteredExpenseClaims = useMemo(() => {
    return expenseClaims
        .filter(claim => claim.employeeName.toLowerCase().includes(expenseSearchTerm.toLowerCase()))
        .filter(claim => expenseStatusFilter === 'all' || claim.status === expenseStatusFilter)
        .filter(claim => expenseTypeFilter === 'all' || claim.expenseType === expenseTypeFilter)
        .filter(claim => {
            if (!expenseDateRange || !expenseDateRange.from) return true;
            const from = startOfDay(expenseDateRange.from);
            const to = expenseDateRange.to ? endOfDay(expenseDateRange.to) : endOfDay(expenseDateRange.from);
            return isWithinInterval(claim.date, { start: from, end: to });
        });
  }, [expenseClaims, expenseSearchTerm, expenseStatusFilter, expenseTypeFilter, expenseDateRange]);

  const resetRequestFilters = () => {
    setRequestSearchTerm("");
    setRequestStatusFilter("all");
    setDestinationFilter("all");
    setRequestDateRange(undefined);
  }

  const resetExpenseFilters = () => {
    setExpenseSearchTerm("");
    setExpenseStatusFilter("all");
    setExpenseTypeFilter("all");
    setExpenseDateRange(undefined);
  }


  return (
    <div className="flex flex-col">
      <PageHeader
        title="Travel & Expense Management"
        description="Manage travel requests and expense reimbursements."
        actions={
          <div className="flex gap-2">
            <RequestTravelDialog />
            <SubmitExpenseDialog />
          </div>
        }
      />
      <div className="p-6 lg:p-8">
        <Tabs defaultValue="requests">
          <TabsList className="mb-4">
            <TabsTrigger value="requests">Travel Requests</TabsTrigger>
            <TabsTrigger value="expenses">Expense Claims</TabsTrigger>
          </TabsList>
          <TabsContent value="requests">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search by employee..."
                    className="pl-9"
                    value={requestSearchTerm}
                    onChange={(e) => setRequestSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={requestStatusFilter} onValueChange={setRequestStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Denied">Denied</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Destination" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Destinations</SelectItem>
                        {destinations.map(dest => <SelectItem key={dest} value={dest}>{dest}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="request-date"
                        variant={"outline"}
                        className={cn(
                        "w-full md:w-auto justify-start text-left font-normal",
                        !requestDateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {requestDateRange?.from ? (
                        requestDateRange.to ? (
                            <>
                            {format(requestDateRange.from, "LLL dd, y")} -{" "}
                            {format(requestDateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(requestDateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Filter by date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={requestDateRange?.from}
                        selected={requestDateRange}
                        onSelect={setRequestDateRange}
                        numberOfMonths={1}
                    />
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" onClick={resetRequestFilters}>Reset</Button>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTravelRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://source.unsplash.com/random/100x100/?${request.employeeName.split(' ')[0]}`} data-ai-hint="person" />
                            <AvatarFallback>{request.employeeName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{request.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{request.destination}</TableCell>
                      <TableCell>
                        {format(request.startDate, "MMM d")} - {format(request.endDate, "MMM d, yyyy")}
                      </TableCell>
                       <TableCell>${request.estimatedCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "Pending" && (
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleStatusChange(request.id, 'Approved')}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleStatusChange(request.id, 'Denied')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                   {filteredTravelRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No travel requests found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="expenses">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search by employee..."
                    className="pl-9"
                    value={expenseSearchTerm}
                    onChange={(e) => setExpenseSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={expenseStatusFilter} onValueChange={setExpenseStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Denied">Denied</SelectItem>
                        <SelectItem value="Reimbursed">Reimbursed</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={expenseTypeFilter} onValueChange={setExpenseTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Expense Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {expenseTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="expense-date"
                        variant={"outline"}
                        className={cn(
                        "w-full md:w-auto justify-start text-left font-normal",
                        !expenseDateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expenseDateRange?.from ? (
                        expenseDateRange.to ? (
                            <>
                            {format(expenseDateRange.from, "LLL dd, y")} -{" "}
                            {format(expenseDateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(expenseDateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Filter by date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={expenseDateRange?.from}
                        selected={expenseDateRange}
                        onSelect={setExpenseDateRange}
                        numberOfMonths={1}
                    />
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" onClick={resetExpenseFilters}>Reset</Button>
            </div>
             <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenseClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://source.unsplash.com/random/100x100/?${claim.employeeName.split(' ')[0]}`} data-ai-hint="person" />
                            <AvatarFallback>{claim.employeeName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{claim.employeeName}</span>
                        </div>
                      </TableCell>
                       <TableCell>{format(claim.date, "MMM d, yyyy")}</TableCell>
                       <TableCell>{claim.expenseType}</TableCell>
                       <TableCell>${claim.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeVariant(claim.status)}>
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {claim.status === "Submitted" && (
                           <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleClaimStatusChange(claim.id, 'Approved')}>Approve</Button>
                            <Button variant="outline" size="sm" onClick={() => handleClaimStatusChange(claim.id, 'Denied')}>Deny</Button>
                          </div>
                        )}
                        {claim.status === "Approved" && (
                             <Button variant="outline" size="sm" onClick={() => handleClaimStatusChange(claim.id, 'Reimbursed')}>Mark as Reimbursed</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExpenseClaims.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No expense claims found for the selected filters.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
