
"use client";

import { PageHeader } from "@/components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slack, Bot, Calendar } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = (section: string) => {
    toast({
      title: "Settings Updated",
      description: `Your changes to the ${section} section have been saved.`,
    });
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        description="Manage your account and workspace preferences."
      />
      <div className="p-6 lg:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 max-w-2xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://source.unsplash.com/random/100x100/?person" data-ai-hint="person" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                     <Button>Change</Button>
                     <Button variant="outline">Remove</Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Admin User" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" defaultValue="HR Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="admin@synergy.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (123) 456-7890" />
                  </div>
                </div>
                 <div className="space-y-6">
                    <CardTitle>Password</CardTitle>
                     <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button onClick={() => handleSaveChanges("Profile")}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="workspace" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Workspace</CardTitle>
                <CardDescription>
                  Manage your organization's settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Synergy Corp" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                     <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmt-8">(GMT-08:00) Pacific Time</SelectItem>
                        <SelectItem value="gmt-5">(GMT-05:00) Eastern Time</SelectItem>
                        <SelectItem value="gmt+1">(GMT+01:00) Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button onClick={() => handleSaveChanges("Workspace")}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-semibold">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
                </div>
                <RadioGroup defaultValue="light" className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                       Light
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                       Dark
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                       System
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button onClick={() => handleSaveChanges("Appearance")}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <Label className="font-semibold">Communication</Label>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">New leave requests</p>
                          <p className="text-sm text-muted-foreground">When an employee submits a new leave request.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="leave-email" className="text-sm">Email</Label>
                            <Switch id="leave-email" defaultChecked />
                            <Label htmlFor="leave-inapp" className="text-sm">In-App</Label>
                            <Switch id="leave-inapp" defaultChecked />
                        </div>
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Performance review reminders</p>
                            <p className="text-sm text-muted-foreground">Reminders for upcoming or overdue reviews.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="review-email" className="text-sm">Email</Label>
                            <Switch id="review-email" defaultChecked />
                            <Label htmlFor="review-inapp" className="text-sm">In-App</Label>
                            <Switch id="review-inapp" />
                        </div>
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                         <div>
                            <p className="font-medium">New applicants</p>
                            <p className="text-sm text-muted-foreground">When a new candidate applies for a job.</p>
                         </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="applicants-email" className="text-sm">Email</Label>
                            <Switch id="applicants-email" />
                             <Label htmlFor="applicants-inapp" className="text-sm">In-App</Label>
                            <Switch id="applicants-inapp" defaultChecked />
                        </div>
                    </div>
                </div>
              </CardContent>
               <CardFooter className="border-t pt-6">
                <Button onClick={() => handleSaveChanges("Notifications")}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect Synergy HR with your other tools to streamline your workflow.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Slack className="h-8 w-8" />
                        <div>
                            <p className="font-medium">Slack</p>
                            <p className="text-sm text-muted-foreground">Get notifications directly in your Slack channels.</p>
                        </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Calendar className="h-8 w-8" />
                        <div>
                            <p className="font-medium">Google Calendar</p>
                            <p className="text-sm text-muted-foreground">Sync leave requests and interviews with your calendar.</p>
                        </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Bot className="h-8 w-8" />
                        <div>
                            <p className="font-medium">Greenhouse</p>
                            <p className="text-sm text-muted-foreground">Sync candidate data from your ATS.</p>
                        </div>
                    </div>
                    <Button variant="outline">Connected</Button>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>
          
           <TabsContent value="billing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your subscription and view your invoice history.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="flex items-end justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-medium">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">Your current plan. Includes all features.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">$99<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                        <p className="text-xs text-muted-foreground">Next payment on July 31, 2024</p>
                    </div>
                  </div>
                   <div>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                     <div className="flex items-center justify-between rounded-lg border p-4 mt-2">
                        <div className="flex items-center gap-4">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 38 24" fill="none"><path d="M35.16 4.45A2.39 2.39 0 0 0 32.88 2H5.11A2.39 2.39 0 0 0 2.84 4.45L19 14.12l16.16-9.67Z" fill="#343434"></path><path d="M19 16.88 2.53 6.94A2.38 2.38 0 0 0 .75 9.13v10.4A2.39 2.39 0 0 0 3.12 22h31.75A2.39 2.39 0 0 0 37.25 19.53V9.13a2.38 2.38 0 0 0-1.78-2.19L19 16.88Z" fill="#242424"></path></svg>
                            <div>
                                <p className="font-medium">Visa ending in 1234</p>
                                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                            </div>
                        </div>
                        <Button variant="outline">Update</Button>
                    </div>
                  </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Need to change your plan? <a href="#" className="underline">Contact Sales</a></p>
                <Button variant="secondary">View Invoice History</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  );
}
