
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
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockWfhRequests, mockEmployees } from "@/lib/data";
import { format } from "date-fns";
import { Check, X, PlusCircle, Calendar as CalendarIcon, Home, Search, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WfhRequest, Employee } from "@/types";
import type { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const departments = [...new Set(mockEmployees.map(e => e.department))];
const employeeDepartmentMap = new Map(mockEmployees.map(e => [e.name, e.department]));
const getEmployeeDepartment = (name: string) => employeeDepartmentMap.get(name) || 'Unknown';

function getStatusBadgeVariant(status: WfhRequest['status']) {
    switch(status) {
        case 'Approved': return 'bg-green-500/20 text-green-700 border-green-500/20';
        case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
        case 'Denied': return 'bg-red-500/20 text-red-700 border-red-500/20';
        default: return 'secondary';
    }
}

function ViewWfhRequestDialog({ request }: { request: WfhRequest }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>WFH Request Details</DialogTitle>
          <DialogDescription>
            Review the details of the remote work request below.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://source.unsplash.com/random/100x100/?${request.employeeName.split(' ')[0]}`} data-ai-hint="person" />
              <AvatarFallback>{request.employeeName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{request.employeeName}</p>
              <p className="text-sm text-muted-foreground">{getEmployeeDepartment(request.employeeName)}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm">Dates Requested</h4>
              <p className="text-sm text-muted-foreground">
                {format(request.startDate, "MMM d, yyyy")} - {format(request.endDate, "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Status</h4>
              <Badge variant="outline" className={getStatusBadgeVariant(request.status)}>
                {request.status}
              </Badge>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Reason</h4>
            <p className="text-sm text-muted-foreground italic">
              {request.reason || 'No reason provided.'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


function RequestWfhDialog({ onCreate }: { onCreate: (request: WfhRequest) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Employee['department'] | undefined>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    if (!selectedDepartment) return [];
    return mockEmployees.filter(emp => emp.department === selectedDepartment);
  }, [selectedDepartment]);

  const handleSubmit = () => {
    const selectedEmployee = mockEmployees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee || !dateRange?.from || !dateRange.to) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select an employee and a date range.",
        });
        return;
    }
    const newRequest: WfhRequest = {
        id: `WFH${Math.floor(Math.random() * 10000)}`,
        employeeName: selectedEmployee.name,
        employeeAvatar: selectedEmployee.avatar,
        startDate: dateRange.from,
        endDate: dateRange.to,
        reason: reason || undefined,
        status: 'Pending',
    };
    onCreate(newRequest);
    toast({
        title: "Request Submitted",
        description: `WFH request for ${selectedEmployee.name} has been submitted.`,
    });
    setIsOpen(false);
    // Reset state
    setDateRange(undefined);
    setReason("");
    setSelectedDepartment(undefined);
    setSelectedEmployeeId(undefined);
  };
  
  const handleDepartmentChange = (dept: Employee['department']) => {
    setSelectedDepartment(dept);
    setSelectedEmployeeId(undefined); // Reset employee selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Request WFH
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Work From Home</DialogTitle>
          <DialogDescription>
            Select the date(s) you would like to work from home.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department">
                    <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                    {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
           </div>
           <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId} disabled={!selectedDepartment}>
                    <SelectTrigger id="employee">
                        <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredEmployees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
           </div>
          <div className="space-y-2">
            <Label>Dates</Label>
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
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea id="reason" placeholder="e.g., Deep work session, appointment" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RemoteWorkPage() {
  const [requests, setRequests] = useState<WfhRequest[]>(mockWfhRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  const handleStatusChange = (id: string, status: 'Approved' | 'Denied') => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };
  
  const handleCreateRequest = (newRequest: WfhRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };
  
  const employeesInFilteredDepartment = useMemo(() => {
    if (departmentFilter === "all") {
      return mockEmployees;
    }
    return mockEmployees.filter(
      (employee) => employee.department === departmentFilter
    );
  }, [departmentFilter]);

  const filteredRequests = useMemo(() => {
    return requests
      .filter((request) =>
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((request) =>
        departmentFilter === "all" || getEmployeeDepartment(request.employeeName) === departmentFilter
      )
      .filter((request) => {
        if (employeeFilter === 'all') return true;
        const employee = mockEmployees.find(e => e.id === employeeFilter);
        return employee ? request.employeeName === employee.name : true;
      });
  }, [requests, searchTerm, departmentFilter, employeeFilter]);

  const handleDepartmentFilterChange = (department: string) => {
    setDepartmentFilter(department);
    setEmployeeFilter("all"); // Reset employee filter when department changes
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Remote Work Management"
        description="Manage and track work-from-home requests."
        actions={<RequestWfhDialog onCreate={handleCreateRequest} />}
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={departmentFilter}
            onValueChange={handleDepartmentFilterChange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dep) => (
                <SelectItem key={dep} value={dep}>
                  {dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={employeeFilter}
            onValueChange={setEmployeeFilter}
            disabled={departmentFilter === "all"}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employeesInFilteredDepartment.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://source.unsplash.com/random/100x100/?${request.employeeName.split(' ')[0]}`} data-ai-hint="person" />
                        <AvatarFallback>
                          {request.employeeName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{request.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(request.startDate, "MMM d, yyyy")} -{" "}
                    {format(request.endDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground italic">{request.reason || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <ViewWfhRequestDialog request={request} />
                      {request.status === "Pending" && (
                        <>
                          <Button variant="outline" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleStatusChange(request.id, 'Approved')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleStatusChange(request.id, 'Denied')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No requests found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
