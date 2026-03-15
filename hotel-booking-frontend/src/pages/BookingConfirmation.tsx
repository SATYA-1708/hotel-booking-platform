import { useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Mail,
  Receipt,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

export type BookingSuccessState = {
  bookingId?: string;
  hotelName?: string;
  city?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  totalCost?: number;
  guestName?: string;
  email?: string;
  adultCount?: number;
  childCount?: number;
};

const fmtDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }) : "—";

const nightsBetween = (a?: string, b?: string) => {
  if (!a || !b) return 0;
  const nights = Math.ceil(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24),
  );
  return Number.isFinite(nights) ? Math.max(1, nights) : 1;
};

const BookingConfirmation = () => {
  const location = useLocation();
  const state = (location.state || {}) as BookingSuccessState;

  const reference = state.bookingId
    ? `#${state.bookingId.slice(-8).toUpperCase()}`
    : "#PENDING";
  const nights = nightsBetween(state.checkIn, state.checkOut);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Success banner */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 flex items-center justify-center gap-2">
          <PartyPopper className="w-4 h-4 text-amber-500" />
          Your stay is locked in — pack your bags!
        </p>
      </div>

      {/* Receipt card */}
      <Card className="shadow-lg border border-gray-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center justify-between text-base md:text-lg font-medium">
            <span className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Booking Reference {reference}
            </span>
            <span>₹{(state.totalCost ?? 0).toLocaleString("en-IN")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-700">
              {state.hotelName || "Your Hotel"}
            </h2>
            {(state.city || state.country) && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {[state.city, state.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" /> Check-in
              </p>
              <p className="font-medium text-gray-700">{fmtDate(state.checkIn)}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" /> Check-out
              </p>
              <p className="font-medium text-gray-700">{fmtDate(state.checkOut)}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="w-4 h-4 text-green-600" /> Guests
              </p>
              <p className="font-medium text-gray-700">
                {state.adultCount ?? 0} Adults · {state.childCount ?? 0} Children
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-gray-500 mb-1">
                <Receipt className="w-4 h-4 text-orange-600" /> Stay Length
              </p>
              <p className="font-medium text-gray-700">{nights} Night(s)</p>
            </div>
          </div>

          {state.guestName && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm">
              <p className="text-gray-500">Booked for</p>
              <p className="font-medium text-gray-700">{state.guestName}</p>
              {state.email && (
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <Mail className="w-3.5 h-3.5" /> Confirmation sent to{" "}
                  {state.email}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/my-bookings">
          <Button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700">
            View My Bookings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline" className="w-full sm:w-auto">
            Keep Exploring Hotels
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
