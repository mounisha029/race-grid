
import RaceCalendar from "@/components/RaceCalendar";
import { CalendarDays } from "lucide-react";

const Calendar = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-f1-black via-slate-900 to-f1-black py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-f1-red/10 via-transparent to-f1-orange/10" />
        <div className="racing-track absolute top-1/2 left-0 w-full h-px" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <CalendarDays className="w-16 h-16 text-f1-yellow" />
            </div>
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              Race Calendar
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete Formula 1 Schedule with Session Times & Countdowns
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <RaceCalendar />
        </div>
      </section>
    </div>
  );
};

export default Calendar;
