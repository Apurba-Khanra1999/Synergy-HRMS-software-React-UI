
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  TrendingDown,
  TrendingUp,
  Briefcase,
  Wallet,
  Building,
  Star,
  Filter,
  Plane,
  LifeBuoy,
  Hourglass,
  CalendarCheck,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Tooltip
} from "recharts";
import {
  mockHeadcountData,
  mockTurnoverData,
  mockDepartmentHeadcount,
  mockSalaryByDepartment,
  mockPerformanceDistribution,
  mockRecruitmentFunnel,
  CHART_COLORS,
} from "@/lib/data";

const lineChartConfig = {
  headcount: {
    label: "Headcount",
    color: "hsl(var(--chart-1))",
  },
};

const barChartConfig = {
  rate: {
    label: "Turnover Rate",
    color: "hsl(var(--chart-2))",
  },
};

const salaryChartConfig = {
  salary: {
    label: "Average Salary",
    color: "hsl(var(--chart-3))",
  },
};

const departmentChartConfig = {
  employees: {
    label: "Employees",
  },
};

const performanceChartConfig = {
  count: {
    label: "Employees"
  }
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Welcome to your HR Dashboard."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Headcount</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">275</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.2%</div>
            <p className="text-xs text-muted-foreground">-0.3% from last quarter</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$82,500</div>
            <p className="text-xs text-muted-foreground">+1.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Leave</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Employees on leave next 7 days</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Helpdesk Tickets</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 new ticket this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees on Travel</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently on business travel</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-6 lg:p-8 pt-0">
         <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Department Headcount</CardTitle>
            <CardDescription>Employee distribution across departments.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer
                config={departmentChartConfig}
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={mockDepartmentHeadcount}
                        dataKey="employees"
                        nameKey="department"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                         {mockDepartmentHeadcount.map((entry) => (
                          <Cell key={`cell-${entry.department}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Headcount Growth</CardTitle>
            <CardDescription>Monthly employee headcount growth.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
              <LineChart data={mockHeadcountData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="headcount"
                  type="monotone"
                  stroke="var(--color-headcount)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Turnover</CardTitle>
             <CardDescription>Employee turnover rate per quarter.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[250px] w-full">
              <BarChart data={mockTurnoverData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis unit="%" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="rate" fill="var(--color-rate)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Average Salary by Department</CardTitle>
            <CardDescription>Comparison of average salaries across different departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salaryChartConfig} className="h-[250px] w-full">
              <BarChart data={mockSalaryByDepartment} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="department" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis unit="$" tickFormatter={(value) => `${value / 1000}k`} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="salary" fill="var(--color-salary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance Distribution
             </CardTitle>
             <CardDescription>Employee performance scores across the company.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={performanceChartConfig} className="h-[250px] w-full">
              <BarChart data={mockPerformanceDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="rating" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" radius={4}>
                   {mockPerformanceDistribution.map((entry) => (
                      <Cell key={entry.rating} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Recruitment Funnel
             </CardTitle>
             <CardDescription>Candidate progression through the hiring pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
              <ChartContainer config={{}} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart data={mockRecruitmentFunnel}>
                      <Tooltip />
                      <Funnel dataKey="value" data={mockRecruitmentFunnel} isAnimationActive>
                        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                         {mockRecruitmentFunnel.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    