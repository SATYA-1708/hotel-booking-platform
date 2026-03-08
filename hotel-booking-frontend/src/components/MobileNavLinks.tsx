import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Building2,
  Calendar,
  BarChart3,
  LogIn,
  Hotel,
  Heart,
  Compass,
  TicketPercent,
  LifeBuoy,
} from "lucide-react";
import { useQuery } from "react-query";
import UsernameMenu from "./UsernameMenu";
import useAppContext from "../hooks/useAppContext";
import { getHotelsSearchUrl } from "../lib/nav-utils";
import { prefetchBusinessInsightsQueries } from "../lib/invalidate-queries";
import { queryClient } from "../main";
import * as apiClient from "../api-client";

const linkClass =
  "flex items-center gap-2 w-full py-3 text-sm font-normal text-gray-700 hover:text-primary-600 transition-colors";

/** Mobile nav — API Docs/Status live in UsernameMenu when logged in (not here). */
const MobileNavLinks = () => {
  const { isLoggedIn } = useAppContext();

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    { enabled: isLoggedIn },
  );

  const isAdmin = currentUser?.role === "admin";
  const isOwner = isAdmin || currentUser?.role === "hotel_owner";

  return (
    <div className="flex flex-col gap-1">
      <Link to={getHotelsSearchUrl()} className={linkClass}>
        <Hotel className="h-4 w-4" />
        Hotels
      </Link>
      <Link to="/destinations" className={linkClass}>
        <Compass className="h-4 w-4" />
        Destinations
      </Link>
      <Link to="/offers" className={linkClass}>
        <TicketPercent className="h-4 w-4" />
        Offers
      </Link>
      <Link to="/help" className={linkClass}>
        <LifeBuoy className="h-4 w-4" />
        Help Center
      </Link>
      {isLoggedIn && (
        <Link to="/my-bookings" className={linkClass}>
          <Calendar className="h-4 w-4" />
          My Bookings
        </Link>
      )}
      {isLoggedIn && (
        <Link to="/saved-hotels" className={linkClass}>
          <Heart className="h-4 w-4" />
          Saved
        </Link>
      )}
      {isAdmin && (
        <Link
          to="/business-insights"
          className={linkClass}
          onMouseEnter={() => prefetchBusinessInsightsQueries(queryClient)}
        >
          <BarChart3 className="h-4 w-4" />
          Business Insights
        </Link>
      )}
      {isOwner && (
        <Link to="/my-hotels" className={linkClass}>
          <Building2 className="h-4 w-4" />
          My Hotels
        </Link>
      )}

      <div className="h-px bg-border my-4" />

      <div className="min-h-[52px] flex items-center justify-center">
        {isLoggedIn ? (
          <UsernameMenu />
        ) : (
          <Link to="/sign-in" className="w-full">
            <Button className="w-full font-medium bg-primary-600 hover:bg-primary-700">
              <LogIn className="h-4 w-4 " />
              Log In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavLinks;
