
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
import {
  mockEmployees,
  mockPerformanceDistribution,
  mockPerformanceByDepartment,
} from "@/lib/data";
import { Employee } from "@/types";
import { format } from "date-fns";
import {
  Users,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  CalendarClock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Cell,
} from "recharts";

const departments = [...new Set(mockEmployees.map((e) => e.department))];

const performanceChartConfig = {
  count: { label: "Employees" },
};

const departmentPerformanceChartConfig = {
  score: { label: "Avg. Score" },
};

export default function PerformancePage() {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((employee) =>
        departmentFilter === "all" || employee.department === departmentFilter
      )
      .filter((employee) =>
        scoreFilter === "all" ||
        (scoreFilter === "1-2" && employee.performance.score <= 2) ||
        (scoreFilter === "3" && employee.performance.score === 3) ||
        (scoreFilter === "4-5" && employee.performance.score >= 4)
      )
      .filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [employees, searchTerm, departmentFilter, scoreFilter]);

  const kpiData = useMemo(() => {
    const totalScore = employees.reduce((acc, e) => acc + e.performance.score, 0);
    const topPerformers = employees.filter(e => e.performance.score >= 4.5).length;
    const needsSupport = employees.filter(e => e.performance.score < 3).length;
    const reviewsDue = employees.filter(e => new Date() > e.performance.lastReviewDate).length; // Simplified logic
    return {
      averageScore: (totalScore / employees.length).toFixed(2),
      topPerformers,
      needsSupport,
      reviewsDue,
    };
  }, [employees]);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Performance Management"
        description="Track and analyze employee performance reviews and metrics."
      />
      <div className="p-6 lg:p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.averageScore} / 5.0</div>
              <p className="text-xs text-muted-foreground">Company-wide average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.topPerformers}</div>
              <p className="text-xs text-muted-foreground">Employees with scores 4.5+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Support</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.needsSupport}</div>
              <p className="text-xs text-muted-foreground">Employees with scores &lt; 3</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Due</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.reviewsDue}</div>
              <p className="text-xs text-muted-foreground">Overdue performance reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>Employee performance scores across the company.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={performanceChartConfig} className="h-[250px] w-full">
                <BarChart data={mockPerformanceDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="rating" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4}>
                    {mockPerformanceDistribution.map((entry) => (
                      <Cell key={entry.rating} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance by Department</CardTitle>
              <CardDescription>Average performance scores across departments.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={departmentPerformanceChartConfig} className="h-[250px] w-full">
                <BarChart data={mockPerformanceByDepartment} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="department" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--color-score)" radius={4}>
                     {mockPerformanceByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Employee Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Employee Performance Records</h2>
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
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dep) => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Performance Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="4-5">High (4-5)</SelectItem>
                <SelectItem value="3">Average (3)</SelectItem>
                <SelectItem value="1-2">Low (1-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Performance Score</TableHead>
                  <TableHead>Last Review</TableHead>
                  <TableHead>Review Cycle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar} data-ai-hint="person" />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge variant={employee.performance.score >= 4 ? 'default' : employee.performance.score < 3 ? 'destructive' : 'secondary'}>
                        {employee.performance.score.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(employee.performance.lastReviewDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>{employee.performance.reviewCycle}</TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No employees found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
