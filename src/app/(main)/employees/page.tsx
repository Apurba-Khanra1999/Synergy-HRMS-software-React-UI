
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { mockEmployees } from "@/lib/data";
import { Employee } from "@/types";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const departments = [...new Set(mockEmployees.map((e) => e.department))];

export default function EmployeesPage() {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  const router = useRouter();

  const handleDepartmentFilterChange = (department: string) => {
    setDepartmentFilter(department);
    setEmployeeFilter("all"); // Reset employee filter when department changes
  };

  const employeesInFilteredDepartment = useMemo(() => {
    if (departmentFilter === "all") {
      return employees;
    }
    return employees.filter(
      (employee) => employee.department === departmentFilter
    );
  }, [employees, departmentFilter]);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(
        (employee) =>
          departmentFilter === "all" || employee.department === departmentFilter
      )
      .filter(
        (employee) =>
          employeeFilter === "all" || employee.id === employeeFilter
      )
      .filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [employees, searchTerm, departmentFilter, employeeFilter]);

  const handleRowClick = (employeeId: string) => {
    router.push(`/employees/${employeeId}`);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Employee Directory"
        description="Browse and search for employees in the organization."
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or title..."
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
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  onClick={() => handleRowClick(employee.id)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://source.unsplash.com/random/100x100/?${
                            employee.name.split(" ")[0]
                          }`}
                          data-ai-hint="person portrait"
                        />
                        <AvatarFallback>
                          {employee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No employees found matching your filters.
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
