
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLeaveRequests, mockEmployees } from "@/lib/data";
import { format, differenceInDays } from "date-fns";
import { Check, X, PlusCircle, Search, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LeaveRequest, Employee } from "@/types";
import type { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const departments = [...new Set(mockEmployees.map(e => e.department))];
const employeeDepartmentMap = new Map(mockEmployees.map(e => [e.name, e.department]));
const getEmployeeDepartment = (name: string) => employeeDepartmentMap.get(name) || 'Unknown';


function ViewRequestDialog({ request }: { request: LeaveRequest }) {
  const getStatusBadgeVariant = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-700 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'Denied': return 'bg-red-500/20 text-red-700 border-red-500/20';
      default: return 'secondary';
    }
  };

  const duration = differenceInDays(request.endDate, request.startDate) + 1;

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
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
             Review the details of the leave request below.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://source.unsplash.com/random/100x100/?${request.employeeName.split(' ')[0]}`} data-ai-hint="person" />
                    <AvatarFallback>
                        {request.employeeName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-lg">{request.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{getEmployeeDepartment(request.employeeName)}</p>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm">Leave Type</h4>
                <p className="text-sm text-muted-foreground">{request.leaveType}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Status</h4>
                <Badge variant="outline" className={getStatusBadgeVariant(request.status)}>
                  {request.status}
                </Badge>
              </div>
            </div>
             <div>
                <h4 className="font-semibold text-sm">Dates Requested</h4>
                <p className="text-sm text-muted-foreground">
                    {format(request.startDate, "MMM d, yyyy")} - {format(request.endDate, "MMM d, yyyy")}
                </p>
                 <p className="text-xs text-muted-foreground">({duration} {duration > 1 ? 'days' : 'day'})</p>
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

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType'] | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  const dialogFilteredEmployees = useMemo(() => {
    if (!selectedDepartment) return [];
    return mockEmployees.filter(emp => emp.department === selectedDepartment);
  }, [selectedDepartment]);

  const filterEmployees = useMemo(() => {
    if (departmentFilter === "all") return mockEmployees;
    return mockEmployees.filter(emp => emp.department === departmentFilter);
  }, [departmentFilter]);

  const filteredRequests = useMemo(() => {
    return requests
      .filter(req => {
        if (departmentFilter === 'all') return true;
        return employeeDepartmentMap.get(req.employeeName) === departmentFilter;
      })
      .filter(req => {
        if (employeeFilter === 'all') return true;
        const selectedEmployee = mockEmployees.find(e => e.id === employeeFilter);
        return selectedEmployee ? req.employeeName === selectedEmployee.name : true;
      })
      .filter(req => 
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [requests, searchTerm, departmentFilter, employeeFilter]);

  const handleStatusChange = (id: string, status: 'Approved' | 'Denied') => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };

  const handleRequestSubmit = () => {
    const selectedEmployee = mockEmployees.find(emp => emp.id === selectedEmployeeId);
    if (!leaveType || !dateRange?.from || !dateRange?.to || !selectedEmployee) {
      alert("Please fill all fields");
      return;
    }
    const newRequest: LeaveRequest = {
      id: `LR${requests.length + 1}`,
      employeeName: selectedEmployee.name,
      employeeAvatar: selectedEmployee.avatar || 'https://source.unsplash.com/random/100x100/?person',
      startDate: dateRange.from,
      endDate: dateRange.to,
      leaveType,
      status: 'Pending',
    };
    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    // Reset form state
    setLeaveType(undefined);
    setDateRange(undefined);
    setSelectedDepartment(undefined);
    setSelectedEmployeeId(undefined);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setSelectedEmployeeId(undefined); // Reset employee when department changes
  };

  const handleDepartmentFilterChange = (department: string) => {
    setDepartmentFilter(department);
    setEmployeeFilter('all');
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Leave Management"
        description="Review and manage employee leave requests."
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
                <DialogDescription>
                  Fill out the form to request time off.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto -mx-6 px-6">
                <div className="space-y-4 py-4 pr-2">
                  <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select onValueChange={handleDepartmentChange}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
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
                          {dialogFilteredEmployees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="leave-type">
                      Leave Type
                    </Label>
                    <Select onValueChange={(value: LeaveRequest['leaveType']) => setLeaveType(value)}>
                      <SelectTrigger id="leave-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vacation">Vacation</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-date">
                      Dates
                    </Label>
                    <div className="flex justify-center">
                        <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={1}/>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-auto pt-4 -mx-6 px-6 border-t">
                <Button onClick={handleRequestSubmit}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
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
          <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={employeeFilter} onValueChange={setEmployeeFilter} disabled={departmentFilter === 'all'}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {filterEmployees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Type</TableHead>
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
                    {format(request.startDate, "MMM d, yyyy")} - {" "}
                    {format(request.endDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "Approved"
                          ? "default"
                          : request.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        request.status === "Approved" ? "bg-green-500/20 text-green-700 border-green-500/20" : 
                        request.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/20" : 
                        "bg-red-500/20 text-red-700 border-red-500/20"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <ViewRequestDialog request={request} />
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
                    No leave requests found matching your filters.
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
