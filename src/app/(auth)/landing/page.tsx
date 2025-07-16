
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CalendarCheck,
  Users,
  Sparkles,
  BarChart,
  LayoutDashboard,
  Gift,
  MessageSquare,
  Clock,
  Hourglass,
  Home,
  Plane,
  Archive,
  BookUser,
  Calendar,
  LifeBuoy,
  Wallet,
  Award,
  HeartPulse,
  ArrowRight,
  CheckCircle,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const featureModules = [
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: "HR Metrics Dashboard",
    description: "Get a high-level overview of key HR metrics like headcount, turnover rate, and open positions with interactive charts and KPI cards.",
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    title: "Leave Management",
    description: "Streamline the entire time-off process. Employees can request leave, and managers can approve or deny requests directly from the dashboard.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Hiring Pipeline",
    description: "Manage your recruitment from start to finish. Use AI to generate job descriptions, parse resumes, and track applicants through every stage.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Employee Directory",
    description: "A centralized and searchable database of all employees, providing easy access to contact information, roles, and department details.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "AI-Powered Skills Analysis",
    description: "Identify skill gaps and growth opportunities. Our AI suggests relevant skills for employees based on their current role and competencies.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Performance Management",
    description: "Track employee performance with clear metrics. Visualize performance distribution and identify top performers or those needing support.",
  },
   {
    icon: <Gift className="h-8 w-8 text-primary" />,
    title: "Referrals",
    description: "Incentivize and manage your employee referral program with submission tracking and a competitive leaderboard.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Feedback Hub",
    description: "Foster a culture of open communication with a live feed for praise, suggestions, or concerns, with an option for anonymity.",
  },
   {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Attendance & Time Tracking",
    description: "Monitor daily attendance, track work hours, and manage time records with detailed logs and filtering capabilities.",
  },
  {
    icon: <Hourglass className="h-8 w-8 text-primary" />,
    title: "Timesheets",
    description: "Track and approve project-based work hours for accurate billing and resource management with a simple approval workflow.",
  },
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: "Remote Work",
    description: "Manage and track requests for working from home with a centralized view and a straightforward approval process.",
  },
   {
    icon: <Plane className="h-8 w-8 text-primary" />,
    title: "Travel & Expense",
    description: "Streamline business travel with request approvals and manage expense claims for reimbursement all in one place.",
  },
  {
    icon: <Archive className="h-8 w-8 text-primary" />,
    title: "Asset Management",
    description: "Keep track of all company-issued assets, from laptops to phones, and manage their assignment and return.",
  },
   {
    icon: <BookUser className="h-8 w-8 text-primary" />,
    title: "Alumni Network",
    description: "Maintain a positive relationship with former employees through a searchable alumni directory and profile management.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Calendar & Events",
    description: "A centralized calendar for all company-wide events, from training sessions and town halls to holidays.",
  },
  {
    icon: <LifeBuoy className="h-8 w-8 text-primary" />,
    title: "HR Helpdesk",
    description: "An internal ticketing system for employees to get HR support, with categorization and status tracking.",
  },
  {
    icon: <Wallet className="h-8 w-8 text-primary" />,
    title: "Loans & Advances",
    description: "Manage employee requests for salary advances or company loans with a clear approval workflow and tracking.",
  },
   {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Rewards & Recognition",
    description: "Foster a positive work culture by celebrating employee achievements through public praise and a points-based leaderboard.",
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Health & Wellness",
    description: "A central hub for managing health benefits, browsing wellness programs, and accessing support resources.",
  },
];

const testimonials = [
    {
        quote: "Synergy HR has completely transformed our HR operations. The AI-powered features for hiring and skills analysis are game-changers. We're more efficient and data-driven than ever before.",
        name: "Sarah Chen",
        title: "VP of People, Innovate Corp",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "The leave management and attendance tracking modules are incredibly intuitive. It has saved our managers countless hours and empowered our employees with self-service options.",
        name: "Michael Rodriguez",
        title: "HR Director, Tech Solutions Inc.",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "As a fast-growing startup, we needed a scalable HR platform. Synergy HR provided an all-in-one solution that grew with us. The dashboard gives us the insights we need at a glance.",
        name: "Emily White",
        title: "CEO, QuantumLeap",
        avatar: "https://placehold.co/100x100.png"
    }
]

export default function LandingPage() {
  return (
    <div className="flex-1 bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Layers className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Synergy HR</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          </nav>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center bg-card">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              The All-in-One HR Platform That Works for You
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              From hiring and onboarding to performance and analytics, Synergy HR brings all your human resource processes together in one intuitive, data-driven platform.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Request a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="mt-12">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Synergy HR Dashboard"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl"
                data-ai-hint="dashboard analytics"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold uppercase text-primary tracking-widest">Core Features</h3>
              <p className="mt-2 text-3xl md:text-4xl font-extrabold">
                Everything You Need to Manage Your People
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Synergy HR is packed with powerful, AI-enhanced tools to streamline your workflow and empower your team.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featureModules.map((feature) => (
                <div key={feature.title} className="p-8 bg-card rounded-lg shadow-sm">
                  {feature.icon}
                  <h4 className="mt-4 text-xl font-bold">{feature.title}</h4>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-card">
            <div className="container mx-auto px-6">
                 <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-sm font-semibold uppercase text-primary tracking-widest">Testimonials</h3>
                    <p className="mt-2 text-3xl md:text-4xl font-extrabold">
                        Trusted by Innovative Companies
                    </p>
                    <p className="mt-4 text-lg text-muted-foreground">
                        See what our clients have to say about transforming their HR processes with Synergy HR.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.name} className="p-8 bg-background rounded-lg shadow-sm flex flex-col">
                           <blockquote className="text-muted-foreground text-lg mb-6 flex-grow">
                             &ldquo;{testimonial.quote}&rdquo;
                           </blockquote>
                           <div className="flex items-center gap-4">
                               <Avatar className="h-12 w-12">
                                  <AvatarImage src={testimonial.avatar} data-ai-hint="person professional"/>
                                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <div>
                                   <p className="font-semibold">{testimonial.name}</p>
                                   <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                               </div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold uppercase text-primary tracking-widest">How It Works</h3>
              <p className="mt-2 text-3xl md:text-4xl font-extrabold">
                Get Started in Minutes
              </p>
               <p className="mt-4 text-lg text-muted-foreground">
                Our intuitive platform makes setup a breeze.
              </p>
            </div>
            <div className="mt-16 grid gap-12 md:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">1</div>
                <h4 className="mt-6 text-xl font-bold">Set Up Your Workspace</h4>
                <p className="mt-2 text-muted-foreground">Easily configure your company settings, departments, and employee data.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">2</div>
                <h4 className="mt-6 text-xl font-bold">Explore the Modules</h4>
                <p className="mt-2 text-muted-foreground">Navigate through our comprehensive suite of tools for hiring, leave, performance, and more.</p>
              </div>
               <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">3</div>
                <h4 className="mt-6 text-xl font-bold">Gain Insights</h4>
                <p className="mt-2 text-muted-foreground">Leverage our powerful dashboard and analytics to make data-driven decisions.</p>
              </div>
            </div>
          </div>
        </section>


        {/* Final CTA Section */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold">
              Ready to Transform Your HR?
            </h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Join leading companies who trust Synergy HR to build happier, more productive teams.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                <span className="font-bold">Synergy HR</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} Synergy HR, Inc. All rights reserved.
            </p>
             <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
