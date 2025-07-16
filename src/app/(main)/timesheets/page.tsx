
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTimesheetEntries, mockProjects, mockEmployees } from "@/lib/data";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { PlusCircle, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TimesheetEntry, Project } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import type { DateRange } from 'react-day-picker';


function LogTimeDialog({ onLogTime }: { onLogTime: (entry: Omit<TimesheetEntry, 'id' | 'status'>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEntry = {
      employeeName: formData.get("employee") as string,
      projectId: formData.get("project") as string,
      date: new Date(formData.get("date") as string),
      hours: parseFloat(formData.get("hours") as string),
      isBillable: formData.get("billable") === "on",
      description: formData.get("description") as string,
    };
    onLogTime(newEntry);
    toast({ title: "Time Logged", description: "Your timesheet entry has been submitted." });
    setIsOpen(false);
    event.currentTarget.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Log Time
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Time Entry</DialogTitle>
            <DialogDescription>
              Submit your work hours for a specific project and date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select name="employee" required>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map(emp => <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select name="project" required>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(proj => <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours</Label>
                <Input id="hours" name="hours" type="number" step="0.5" min="0" placeholder="e.g., 8" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe the work you performed..." required />
            </div>
             <div className="flex items-center space-x-2">
              <Switch id="billable" name="billable" defaultChecked/>
              <Label htmlFor="billable">Billable Hours</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TimesheetsPage() {
  const [entries, setEntries] = useState<TimesheetEntry[]>(mockTimesheetEntries);
  const { toast } = useToast();
  
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();


  const handleLogTime = (newEntry: Omit<TimesheetEntry, 'id' | 'status'>) => {
    const entry: TimesheetEntry = {
      ...newEntry,
      id: `TS${Math.floor(Math.random() * 10000)}`,
      status: "Submitted",
    };
    setEntries(prev => [entry, ...prev]);
  };

  const handleStatusChange = (entryId: string, newStatus: 'Approved' | 'Rejected') => {
    setEntries(prev => prev.map(e => e.id === entryId ? {...e, status: newStatus} : e));
    toast({ title: `Entry ${newStatus}`, description: "The timesheet entry has been updated." });
  }

  const getProjectName = (projectId: string) => {
    return mockProjects.find(p => p.id === projectId)?.name || "Unknown Project";
  };

  const getStatusBadgeVariant = (status: TimesheetEntry['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'Approved': return 'bg-green-500/20 text-green-700 border-green-500/20';
      case 'Rejected': return 'bg-red-500/20 text-red-700 border-red-500/20';
      default: return 'secondary';
    }
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => employeeFilter === 'all' || entry.employeeName === employeeFilter)
      .filter(entry => projectFilter === 'all' || entry.projectId === projectFilter)
      .filter(entry => statusFilter === 'all' || entry.status === statusFilter)
      .filter(entry => {
        if (!dateRange || (!dateRange.from && !dateRange.to)) return true;
        const from = dateRange.from ? startOfDay(dateRange.from) : undefined;
        const to = dateRange.to ? endOfDay(dateRange.to) : from;
        if (!from || !to) return true;
        return isWithinInterval(entry.date, { start: from, end: to });
      });
  }, [entries, employeeFilter, projectFilter, statusFilter, dateRange]);


  return (
    <div className="flex flex-col">
      <PageHeader
        title="Timesheet Management"
        description="Track and approve project-based work hours."
        actions={<LogTimeDialog onLogTime={handleLogTime} />}
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {mockEmployees.map(emp => <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {mockProjects.map(proj => <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-auto justify-start text-left font-normal",
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
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={() => setDateRange(undefined)} disabled={!dateRange}>Reset</Button>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.employeeName}</TableCell>
                  <TableCell>{getProjectName(entry.projectId)}</TableCell>
                  <TableCell>{format(entry.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{entry.hours.toFixed(1)}</TableCell>
                  <TableCell>{entry.isBillable ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeVariant(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.status === 'Submitted' && (
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleStatusChange(entry.id, 'Approved')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleStatusChange(entry.id, 'Rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No timesheet entries found for the selected filters.
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
