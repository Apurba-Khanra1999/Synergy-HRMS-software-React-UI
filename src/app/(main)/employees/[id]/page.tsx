
"use client";

import { useParams } from "next/navigation";
import { mockEmployees } from "@/lib/data";
import { Employee } from "@/types";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Briefcase,
  Building,
  Star,
  Pencil,
  BarChart,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const departments = [...new Set(mockEmployees.map((e) => e.department))];

function EditEmployeeDialog({ employee, onUpdate }: { employee: Employee, onUpdate: (updatedEmployee: Employee) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>(employee);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value as Employee['department'] }));
  }

  const handleSubmit = () => {
    onUpdate(formData as Employee);
    toast({
      title: "Profile Updated",
      description: `${employee.name}'s information has been successfully updated.`
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile for {employee.name}</DialogTitle>
          <DialogDescription>
            Make changes to the employee's information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
             <Select value={formData.department} onValueChange={handleSelectChange}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dep) => (
                  <SelectItem key={dep} value={dep}>
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function EmployeeDetailPage() {
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  // We use state to allow for updates to the employee data
  const [allEmployees, setAllEmployees] = useState(mockEmployees);
  const employee = allEmployees.find((emp) => emp.id === id);

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setAllEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
  };


  if (!employee) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Employee Not Found" />
        <div className="p-6 lg:p-8">
          <p>The employee you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/employees">Back to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleActionClick = (message: string) => {
    toast({
      title: "Action Triggered",
      description: message,
    });
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Employee Profile"
        description={`Details for ${employee.name}`}
        actions={
          <div className="flex gap-2">
            <EditEmployeeDialog employee={employee} onUpdate={handleUpdateEmployee} />
            <Button onClick={() => handleActionClick(`New performance review initiated for ${employee.name}.`)}>
              <BarChart className="mr-2 h-4 w-4" />
              Initiate Review
            </Button>
          </div>
        }
      />
      <div className="p-6 lg:p-8 grid gap-8 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://source.unsplash.com/random/100x100/?${employee.name.split(' ')[0]}`} data-ai-hint="person portrait" />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.title}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${employee.email}`} className="text-sm hover:underline">
                  {employee.email}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{employee.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{employee.department}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Core competencies and technical skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Snapshot</CardTitle>
              <CardDescription>
                A quick look at the latest performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Overall Score</span>
                    </div>
                    <Badge variant={employee.performance.score >= 4 ? "default" : employee.performance.score < 3 ? "destructive" : "secondary"}>{employee.performance.score.toFixed(1)} / 5.0</Badge>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Last Review Date</span>
                    </div>
                    <span className="text-sm">{format(employee.performance.lastReviewDate, "MMMM d, yyyy")}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
