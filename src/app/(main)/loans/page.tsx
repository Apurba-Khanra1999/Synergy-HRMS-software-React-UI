
"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLoanRequests, mockEmployees } from "@/lib/data";
import { format } from "date-fns";
import { Check, X, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoanRequest } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

function RequestLoanDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({ title: "Request Submitted", description: "Your loan/advance request has been submitted for approval." });
    setIsOpen(false);
    event.currentTarget.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Request Loan/Advance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Loan or Advance Request</DialogTitle>
            <DialogDescription>
              Fill out the form to apply for a company loan or salary advance.
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
                        {mockEmployees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="type">Request Type</Label>
                <Select name="type" required>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Loan">Loan</SelectItem>
                        <SelectItem value="Advance">Salary Advance</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" step="100" min="0" placeholder="e.g., 1000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request</Label>
              <Textarea id="reason" name="reason" placeholder="Please provide a brief reason for your request..." required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function LoansPage() {
  const [requests, setRequests] = useState<LoanRequest[]>(mockLoanRequests);

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };

  const getStatusBadgeVariant = (status: LoanRequest['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-700 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'Rejected': return 'bg-red-500/20 text-red-700 border-red-500/20';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Loan & Advance Management"
        description="Manage and track employee loan and salary advance requests."
        actions={<RequestLoanDialog />}
      />
      <div className="p-6 lg:p-8">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
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
                  <TableCell>${request.amount.toLocaleString()}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{format(request.requestDate, "MMM d, yyyy")}</TableCell>
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
                        <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleStatusChange(request.id, 'Rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
