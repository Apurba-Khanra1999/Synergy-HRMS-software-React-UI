
"use client";

import { useState, useMemo } from "react";
import Link from 'next/link';
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOpenPositions } from "@/lib/data";
import { OpenPosition } from "@/types";
import { differenceInDays } from "date-fns";
import { Search, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { JobDescriptionGenerator } from "./job-description-generator";
import { Button } from "@/components/ui/button";

export default function HiringPage() {
  const [positions, setPositions] = useState<OpenPosition[]>(mockOpenPositions);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const departments = [...new Set(mockOpenPositions.map(p => p.department))];
  const locations = [...new Set(mockOpenPositions.map(p => p.location))];

  const filteredPositions = useMemo(() => {
    return positions
      .filter((position) =>
        position.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (position) =>
          departmentFilter === "all" || position.department.toLowerCase() === departmentFilter
      )
      .filter(
        (position) =>
          locationFilter === "all" || position.location.toLowerCase().replace(/[\s,]/g, '') === locationFilter
      )
      .sort((a,b) => b.postedDate.getTime() - a.postedDate.getTime());
  }, [positions, searchTerm, departmentFilter, locationFilter]);


  const handleCreatePosition = (newPositionData: { jobTitle: string; department: any; location: string }) => {
    const newPosition: OpenPosition = {
        id: `OP${Math.floor(Math.random() * 10000)}`,
        title: newPositionData.jobTitle,
        department: newPositionData.department,
        location: newPositionData.location,
        status: 'Open',
        postedDate: new Date(),
        applicantCount: 0,
    };
    setPositions(prev => [newPosition, ...prev]);
  };


  return (
    <div className="flex flex-col">
      <PageHeader
        title="Hiring Pipeline"
        description="Track and manage all open job positions."
        actions={<JobDescriptionGenerator onCreatePosition={handleCreatePosition} />}
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role title..."
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
              {departments.map(dep => <SelectItem key={dep} value={dep.toLowerCase()}>{dep}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => <SelectItem key={loc} value={loc.toLowerCase().replace(/[\s,]/g, '')}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Days Open</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.id} className="cursor-pointer">
                  <TableCell className="font-medium hover:underline">
                     <Link href={`/hiring/${position.id}`}>{position.title}</Link>
                  </TableCell>
                  <TableCell>{position.department}</TableCell>
                  <TableCell>{position.location}</TableCell>
                   <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                         <Link href={`/hiring/${position.id}`}>
                          <Users className="mr-2 h-4 w-4" />
                          {position.applicantCount}
                        </Link>
                      </Button>
                  </TableCell>
                  <TableCell>
                    {differenceInDays(new Date(), position.postedDate)} days
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        position.status === "Open"
                          ? "secondary"
                          : position.status === "Interviewing"
                          ? "default"
                          : "outline"
                      }
                      className={
                        position.status === "Open" ? "bg-blue-500/20 text-blue-700 border-blue-500/20" :
                        position.status === "Interviewing" ? "bg-purple-500/20 text-purple-700 border-purple-500/20" :
                        position.status === "Offer Extended" ? "bg-green-500/20 text-green-700 border-green-500/20" :
                        "bg-gray-500/20 text-gray-700 border-gray-500/20"
                      }
                    >
                      {position.status}
                    </Badge>
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
