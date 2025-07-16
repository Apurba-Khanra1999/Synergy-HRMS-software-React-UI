
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockCalendarEvents } from "@/lib/data";
import { CalendarEvent } from "@/types";
import { PlusCircle, Briefcase, GraduationCap, Mic, PartyPopper, FerrisWheel } from "lucide-react";
import { format, isSameDay, startOfMonth, addMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const eventTypeIcons: Record<CalendarEvent['type'], React.ReactNode> = {
  'Training': <GraduationCap className="h-5 w-5" />,
  'Town Hall': <Mic className="h-5 w-5" />,
  'Celebration': <PartyPopper className="h-5 w-5" />,
  'Holiday': <FerrisWheel className="h-5 w-5" />,
  'Other': <Briefcase className="h-5 w-5" />,
};

const eventTypeColors: Record<CalendarEvent['type'], string> = {
  'Training': 'bg-blue-500/20 text-blue-700 border-blue-500/20',
  'Town Hall': 'bg-purple-500/20 text-purple-700 border-purple-500/20',
  'Celebration': 'bg-pink-500/20 text-pink-700 border-pink-500/20',
  'Holiday': 'bg-green-500/20 text-green-700 border-green-500/20',
  'Other': 'bg-gray-500/20 text-gray-700 border-gray-500/20',
};

function CreateEventDialog({ onCreate }: { onCreate: (event: Omit<CalendarEvent, 'id'>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string),
      type: formData.get('type') as CalendarEvent['type'],
      description: formData.get('description') as string,
    };
    onCreate(newEvent);
    toast({ title: "Event Created", description: "The new event has been added to the calendar." });
    setIsOpen(false);
    event.currentTarget.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Company Event</DialogTitle>
            <DialogDescription>
              Plan and schedule an internal event for your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Town Hall">Town Hall</SelectItem>
                    <SelectItem value="Celebration">Celebration</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);

  const handleCreateEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `EVT${Math.floor(Math.random() * 10000)}`,
    };
    setEvents(prev => [...prev, event].sort((a,b) => a.date.getTime() - b.date.getTime()));
  };
  
  const eventsForSelectedDay = useMemo(() => {
    return date ? events.filter((event) => isSameDay(event.date, date)) : [];
  }, [date, events]);
  
  const eventsForCurrentMonth = useMemo(() => {
    const monthStart = startOfMonth(date || new Date());
    return events.filter(event => event.date >= monthStart && event.date < addMonths(monthStart, 1));
  }, [date, events]);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Event & Calendar Management"
        description="Plan and track company-wide events, holidays, and training sessions."
        actions={<CreateEventDialog onCreate={handleCreateEvent} />}
      />
      <div className="p-6 lg:p-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                modifiers={{
                    events: eventsForCurrentMonth.map(e => e.date)
                }}
                modifiersClassNames={{
                    events: 'bg-primary/20 text-primary rounded-full'
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {date ? format(date, "MMMM d, yyyy") : "Today"}
              </CardTitle>
              <CardDescription>
                Here are the scheduled events for the selected day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDay.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDay.map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 border rounded-lg">
                       <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${eventTypeColors[event.type]}`}>
                          {eventTypeIcons[event.type]}
                       </div>
                       <div className="flex-1">
                           <h3 className="font-semibold">{event.title}</h3>
                           <p className="text-sm text-muted-foreground">{event.description}</p>
                           <Badge variant="outline" className={`mt-2 ${eventTypeColors[event.type]}`}>{event.type}</Badge>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>No events scheduled for this day.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
