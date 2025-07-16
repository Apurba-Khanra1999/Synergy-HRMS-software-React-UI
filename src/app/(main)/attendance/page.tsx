
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
import { mockAttendanceRecords, mockLeaveRequests, mockEmployees } from "@/lib/data";
import { format, compareDesc } from "date-fns";
import { LogIn, LogOut, Calendar as CalendarIcon, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AttendanceRecord, LeaveRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type CombinedRecord = (AttendanceRecord & { recordType: 'attendance' }) | (LeaveRequest & { recordType: 'leave' });

const departments = [...new Set(mockEmployees.map((e) => e.department))];
const employeeDepartmentMap = new Map(mockEmployees.map(e => [e.name, e.department]));
const getEmployeeDepartment = (name: string) => employeeDepartmentMap.get(name) || 'Unknown';

function ViewHistoryDialog({ employeeName, isOpen, onOpenChange }: { employeeName: string | null; isOpen: boolean; onOpenChange: (open: boolean) => void; }) {
  const historyRecords = useMemo(() => {
    if (!employeeName) return [];

    const attendanceHistory = mockAttendanceRecords
      .filter(record => record.employeeName === employeeName)
      .map(r => ({ ...r, recordType: 'attendance' as const, date: r.date }));

    const leaveHistory = mockLeaveRequests
      .filter(req => req.employeeName === employeeName)
      .flatMap(req => {
          const records = [];
          let currentDate = new Date(req.startDate);
          while(currentDate <= req.endDate) {
            records.push({ ...req, recordType: 'leave' as const, date: new Date(currentDate) });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return records;
      });
      
    const combined = [...attendanceHistory, ...leaveHistory];

    return combined.sort((a, b) => compareDesc(a.date, b.date));
  }, [employeeName]);

  const employee = mockEmployees.find(e => e.name === employeeName);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Attendance History for {employeeName}</DialogTitle>
          <DialogDescription>
            Showing all attendance and leave records for this employee.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="flex-1 -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyRecords.map((record, index) => (
                <TableRow key={`${record.id}-${index}`}>
                   <TableCell>{format(record.date, 'PPP')}</TableCell>
                   <TableCell>
                      {record.recordType === 'attendance' ? (
                         <Badge
                          variant={
                            record.status === "On Time" || record.status === "Present" ? "default" :
                            record.status === "Late" ? "secondary" : "destructive"
                          }
                          className={
                            record.status === "On Time" ? "bg-green-500/20 text-green-700 border-green-500/20" :
                            record.status === "Present" ? "bg-blue-500/20 text-blue-700 border-blue-500/20" :
                            record.status === "Late" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/20" :
                            "bg-red-500/20 text-red-700 border-red-500/20"
                          }
                        >
                          {record.status}
                        </Badge>
                      ) : (
                         <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-500/20">
                            On Leave
                        </Badge>
                      )}
                   </TableCell>
                   <TableCell className="text-sm text-muted-foreground">
                     {record.recordType === 'attendance' ? (
                       `Checked in: ${record.checkIn || 'N/A'}, Checked out: ${record.checkOut || 'N/A'}`
                     ) : (
                       `${record.leaveType} (${record.status})`
                     )}
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogClose asChild className="mt-4">
          <Button>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}


export default function AttendancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const { toast } = useToast();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedEmployeeForHistory, setSelectedEmployeeForHistory] = useState<string | null>(null);

  const handleClockIn = () => {
    toast({
      title: "Clocked In",
      description: `You have successfully clocked in at ${format(new Date(), "p")}.`,
    });
  };

  const handleClockOut = () => {
    toast({
      title: "Clocked Out",
      description: `You have successfully clocked out at ${format(new Date(), "p")}.`,
    });
  };
  
  const combinedRecords: CombinedRecord[] = useMemo(() => {
    const attendanceForDate = mockAttendanceRecords
      .filter(record => format(record.date, 'yyyy-MM-dd') === (date ? format(date, 'yyyy-MM-dd') : ''))
      .map(r => ({...r, recordType: 'attendance' as const}));

    const leaveForDate = mockLeaveRequests
      .filter(req => req.status === 'Approved' && date && date >= req.startDate && date <= req.endDate)
      .map(r => ({...r, recordType: 'leave' as const}));

    const combined = [...attendanceForDate];

    leaveForDate.forEach(leave => {
        if (!combined.some(c => c.employeeName === leave.employeeName)) {
            combined.push(leave);
        }
    });
    
    return combined;

  }, [date]);

  const employeesInFilteredDepartment = useMemo(() => {
    if (departmentFilter === "all") {
      return mockEmployees;
    }
    return mockEmployees.filter(
      (employee) => employee.department === departmentFilter
    );
  }, [departmentFilter]);

  const filteredRecords = useMemo(() => {
    let records = combinedRecords;

    if (departmentFilter !== 'all') {
      records = records.filter(r => getEmployeeDepartment(r.employeeName) === departmentFilter);
    }

    if (employeeFilter !== 'all') {
        const selectedEmployee = mockEmployees.find(e => e.id === employeeFilter);
        if (selectedEmployee) {
            records = records.filter(r => r.employeeName === selectedEmployee.name);
        }
    }

    if (searchTerm) {
      records = records.filter(r => r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (statusFilter !== 'all') {
      if (["On Time", "Late", "Absent", "Present"].includes(statusFilter)) {
          return records.filter(r => r.recordType === 'attendance' && r.status.toLowerCase().replace(' ', '') === statusFilter.toLowerCase().replace(' ', ''));
      }
      if (["vacation", "sickleave", "personal"].includes(statusFilter)) {
          return records.filter(r => r.recordType === 'leave' && r.leaveType.toLowerCase().replace(' ', '') === statusFilter.toLowerCase().replace(' ', ''));
      }
    }

    return records;
  }, [combinedRecords, statusFilter, searchTerm, departmentFilter, employeeFilter]);
  
  const handleDepartmentFilterChange = (department: string) => {
    setDepartmentFilter(department);
    setEmployeeFilter("all");
  };

  const handleViewHistory = (employeeName: string) => {
    setSelectedEmployeeForHistory(employeeName);
    setIsHistoryOpen(true);
  };

  return (
    <div className="flex flex-col">
      <ViewHistoryDialog 
        employeeName={selectedEmployeeForHistory}
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
      <PageHeader
        title="Attendance & Time Tracking"
        description="Monitor daily attendance, track work hours, and manage time records."
        actions={
          <div className="flex gap-2">
            <Button onClick={handleClockIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Clock In
            </Button>
            <Button variant="outline" onClick={handleClockOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Clock Out
            </Button>
          </div>
        }
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="relative flex-1 md:grow-0 md:flex-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-9 w-full"
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
           <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ontime">On Time</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
               <SelectItem value="present">Present</SelectItem>
              <SelectItem value="vacation">On Vacation</SelectItem>
              <SelectItem value="sickleave">Sick Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <TableRow key={record.id} className="cursor-pointer" onClick={() => handleViewHistory(record.employeeName)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://source.unsplash.com/random/100x100/?${record.employeeName.split(' ')[0]}`} data-ai-hint="person" />
                        <AvatarFallback>
                          {record.employeeName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{record.employeeName}</span>
                    </div>
                  </TableCell>
                  {record.recordType === 'attendance' ? (
                    <>
                      <TableCell>{record.shift}</TableCell>
                      <TableCell>{record.checkIn || 'N/A'}</TableCell>
                      <TableCell>{record.checkOut || 'N/A'}</TableCell>
                      <TableCell>{record.workHours?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>{record.overtime?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "On Time" || record.status === "Present"
                              ? "default"
                              : record.status === "Late"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            record.status === "On Time" ? "bg-green-500/20 text-green-700 border-green-500/20" :
                            record.status === "Present" ? "bg-blue-500/20 text-blue-700 border-blue-500/20" :
                            record.status === "Late" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/20" :
                            "bg-red-500/20 text-red-700 border-red-500/20"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell colSpan={5}>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-500/20">
                            On Leave ({record.leaveType})
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-500/20">
                              On Leave
                          </Badge>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              )) : (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No records found matching your search.
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
