
"use client";

import { useParams } from "next/navigation";
import { mockAlumni } from "@/lib/data";
import { Alumnus } from "@/types";
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
  Calendar,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AlumnusDetailPage() {
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const alumnus = mockAlumni.find((alum) => alum.id === id);

  if (!alumnus) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Alumnus Not Found" />
        <div className="p-6 lg:p-8">
          <p>The alumnus you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/alumni">Back to Alumni Network</Link>
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
        title="Alumni Profile"
        description={`Details for ${alumnus.name}`}
        actions={
            <Button onClick={() => handleActionClick(`Preparing to contact ${alumnus.name}.`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact for Opportunity
            </Button>
        }
      />
      <div className="p-6 lg:p-8 grid gap-8 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={alumnus.avatar} data-ai-hint="person portrait" />
                <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{alumnus.name}</h2>
              <p className="text-muted-foreground">{alumnus.lastRole}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${alumnus.email}`} className="text-sm hover:underline">
                  {alumnus.email}
                </a>
              </div>
            </CardContent>
          </Card>
          <Button variant="outline" size="sm" asChild>
            <Link href="/alumni">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Alumni Network
            </Link>
          </Button>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Last Position at Synergy Corp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{alumnus.lastRole}</span>
              </div>
              <div className="flex items-center gap-4">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{alumnus.lastDepartment}</span>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  Left on {format(alumnus.departureDate, "MMMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available For</CardTitle>
              <CardDescription>
                This individual is open to being contacted for the following opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {alumnus.contactFor.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-base">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
