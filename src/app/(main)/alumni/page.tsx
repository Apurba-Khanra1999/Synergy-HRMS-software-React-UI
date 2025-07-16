
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { mockAlumni, mockEmployees } from "@/lib/data";
import { Alumnus } from "@/types";
import { Search, Mail, MessageSquare, Eye, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";


const departments = [...new Set(mockEmployees.map((e) => e.department))];
const contactForOptions: Alumnus['contactFor'] = ['Contract', 'Freelance', 'Referral Program'];

function AddAlumnusDialog({ onAddAlumnus }: { onAddAlumnus: (alumnus: Alumnus) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastRole, setLastRole] = useState("");
  const [lastDepartment, setLastDepartment] = useState<Alumnus['lastDepartment'] | undefined>();
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [selectedContactFor, setSelectedContactFor] = useState<Alumnus['contactFor']>([]);
  const { toast } = useToast();

  const handleCheckboxChange = (option: Alumnus['contactFor'][number]) => {
    setSelectedContactFor(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (!name || !email || !lastRole || !lastDepartment || !departureDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all required fields.",
      });
      return;
    }
    
    const newAlumnus: Alumnus = {
      id: `ALUM${Math.floor(Math.random() * 10000)}`,
      name,
      email,
      lastRole,
      lastDepartment,
      departureDate,
      contactFor: selectedContactFor,
      avatar: `https://source.unsplash.com/random/100x100/?person,${name.split(' ')[0]}`,
    };

    onAddAlumnus(newAlumnus);
    toast({
      title: "Alumnus Added",
      description: `${name} has been added to the alumni network.`,
    });
    
    // Reset form and close dialog
    setIsOpen(false);
    setName("");
    setEmail("");
    setLastRole("");
    setLastDepartment(undefined);
    setDepartureDate(undefined);
    setSelectedContactFor([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Alumnus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Alumnus</DialogTitle>
          <DialogDescription>
            Manually add a former employee to the alumni network.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="lastRole">Last Role</Label>
            <Input id="lastRole" value={lastRole} onChange={(e) => setLastRole(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastDepartment">Last Department</Label>
              <Select value={lastDepartment} onValueChange={(val: Alumnus['lastDepartment']) => setLastDepartment(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departureDate">Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Available For</Label>
            <div className="space-y-2">
              {contactForOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`contact-${option}`}
                    checked={selectedContactFor.includes(option)}
                    onCheckedChange={() => handleCheckboxChange(option)}
                  />
                  <label
                    htmlFor={`contact-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Alumnus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumnus[]>(mockAlumni);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [contactForFilter, setContactForFilter] = useState("all");
  const { toast } = useToast();

  const allDepartments = [...new Set(alumni.map(a => a.lastDepartment))];
  const allContactForOptions = [...new Set(alumni.flatMap(a => a.contactFor))];

  const filteredAlumni = useMemo(() => {
    return alumni
      .filter(
        (alumnus) =>
          alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumnus.lastRole.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (alumnus) =>
          departmentFilter === "all" || alumnus.lastDepartment === departmentFilter
      )
      .filter(
        (alumnus) =>
          contactForFilter === "all" || alumnus.contactFor.includes(contactForFilter as any)
      );
  }, [alumni, searchTerm, departmentFilter, contactForFilter]);

  const handleContact = (name: string, type: 'update' | 'opportunity') => {
    toast({
        title: "Action Triggered",
        description: `Preparing to send an ${type} to ${name}.`
    });
  }
  
  const handleAddAlumnus = (newAlumnus: Alumnus) => {
    setAlumni(prev => [newAlumnus, ...prev]);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Alumni Network"
        description="Maintain connections with former employees."
        actions={<AddAlumnusDialog onAddAlumnus={handleAddAlumnus} />}
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or role..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
           <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {allDepartments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={contactForFilter} onValueChange={setContactForFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Contact For" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Opportunities</SelectItem>
              {allContactForOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Last Role</TableHead>
                <TableHead>Departure Date</TableHead>
                <TableHead>Contact For</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumni.map((alumnus) => (
                <TableRow key={alumnus.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={alumnus.avatar} data-ai-hint="person professional" />
                        <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{alumnus.name}</p>
                        <p className="text-sm text-muted-foreground">{alumnus.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{alumnus.lastRole}</p>
                    <p className="text-sm text-muted-foreground">{alumnus.lastDepartment}</p>
                    </TableCell>
                  <TableCell>{format(alumnus.departureDate, "MMMM yyyy")}</TableCell>
                   <TableCell>
                     <div className="flex flex-wrap gap-1">
                        {alumnus.contactFor.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                     </div>
                   </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" asChild>
                           <Link href={`/alumni/${alumnus.id}`}>
                              <Eye className="mr-2 h-4 w-4"/>
                              View Profile
                           </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContact(alumnus.name, 'opportunity')}>
                           <MessageSquare className="mr-2 h-4 w-4"/>
                            Contact
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAlumni.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No alumni found matching your search.
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
