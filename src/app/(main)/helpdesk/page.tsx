
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
  DialogClose,
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
import { mockTickets, mockEmployees } from "@/lib/data";
import { format } from "date-fns";
import { PlusCircle, Eye, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Ticket, Employee } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const departments = [...new Set(mockEmployees.map((e) => e.department))];
const ticketCategories: Ticket['category'][] = ['Payroll', 'Benefits', 'Leave', 'Policy', 'Grievance', 'Other'];

function NewTicketDialog({ onNewTicket }: { onNewTicket: (ticket: Ticket) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState<Employee['department'] | undefined>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
  
  const filteredEmployees = useMemo(() => {
    if (!selectedDepartment) return [];
    return mockEmployees.filter(emp => emp.department === selectedDepartment);
  }, [selectedDepartment]);
  
  const handleDepartmentChange = (dept: Employee['department']) => {
    setSelectedDepartment(dept);
    setSelectedEmployeeId(undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const employee = mockEmployees.find(e => e.id === selectedEmployeeId);

    if (!employee) {
        toast({
            variant: "destructive",
            title: "Employee not selected",
            description: "Please select an employee.",
        });
        return;
    }
    
    const newTicket: Ticket = {
      id: `TKT${Math.floor(Math.random() * 10000)}`,
      subject: formData.get("subject") as string,
      employeeName: employee.name,
      category: formData.get("category") as Ticket['category'],
      description: formData.get("description") as string,
      status: "Open",
      createdDate: new Date(),
    };
    onNewTicket(newTicket);
    toast({ title: "Ticket Submitted", description: "Your ticket has been successfully created." });
    setIsOpen(false);
    event.currentTarget.reset();
    setSelectedDepartment(undefined);
    setSelectedEmployeeId(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Helpdesk Ticket</DialogTitle>
            <DialogDescription>
              Submit a request or report an issue to the HR department.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="e.g., Question about my payslip" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
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
                    <Select name="employee" onValueChange={setSelectedEmployeeId} value={selectedEmployeeId} disabled={!selectedDepartment} required>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Payroll">Payroll</SelectItem>
                  <SelectItem value="Benefits">Benefits</SelectItem>
                  <SelectItem value="Leave">Leave & Attendance</SelectItem>
                  <SelectItem value="Policy">Policy Question</SelectItem>
                  <SelectItem value="Grievance">Grievance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please provide as much detail as possible..."
                rows={5}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ViewTicketDialog({ ticket }: { ticket: Ticket }) {
  const getStatusBadgeVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-500/20 text-blue-700 border-blue-500/20';
      case 'In Progress': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'Resolved': return 'bg-green-500/20 text-green-700 border-green-500/20';
      default: return 'secondary';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
         <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
          <DialogDescription>
             Ticket ID: {ticket.id}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-sm">Employee</h4>
                <p className="text-sm text-muted-foreground">{ticket.employeeName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Category</h4>
                <p className="text-sm text-muted-foreground">{ticket.category}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Date Submitted</h4>
                <p className="text-sm text-muted-foreground">{format(ticket.createdDate, "MMM d, yyyy")}</p>
              </div>
            </div>
             <div>
                <h4 className="font-semibold text-sm">Status</h4>
                <Badge variant="outline" className={getStatusBadgeVariant(ticket.status)}>
                  {ticket.status}
                </Badge>
            </div>
             <div>
                <h4 className="font-semibold text-sm mb-2">Description</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">
                    {ticket.description}
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

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handleNewTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const handleStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? {...t, status: newStatus} : t));
    toast({ title: "Ticket Status Updated" });
  }

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => statusFilter === "all" || ticket.status === statusFilter)
      .filter(ticket => categoryFilter === "all" || ticket.category === categoryFilter)
      .filter(ticket => ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tickets, statusFilter, categoryFilter, searchTerm]);

  const getStatusBadgeVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-500/20 text-blue-700 border-blue-500/20';
      case 'In Progress': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'Resolved': return 'bg-green-500/20 text-green-700 border-green-500/20';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="HR Helpdesk"
        description="Manage employee tickets and resolve issues efficiently."
        actions={<NewTicketDialog onNewTicket={handleNewTicket} />}
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ticketCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>{ticket.employeeName}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{format(ticket.createdDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ViewTicketDialog ticket={ticket} />
                  </TableCell>
                </TableRow>
              ))}
              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No tickets found for the selected filter.
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
