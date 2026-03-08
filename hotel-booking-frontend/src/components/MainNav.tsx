import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import useAppContext from "../hooks/useAppContext";
import { getHotelsSearchUrl } from "../lib/nav-utils";
import { prefetchBusinessInsightsQueries } from "../lib/invalidate-queries";
import { queryClient } from "../main";
import * as apiClient from "../api-client";

const NAV_AUTH_WIDTH = "min-w-[120px]";

const navLinkClass =
  "flex items-center text-sm font-medium text-stone-600 hover:text-primary-800 px-4 py-2 rounded-full hover:bg-primary-50 transition-all duration-200";

const MainNav = () => {
  const { isLoggedIn } = useAppContext();

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    { enabled: isLoggedIn },
  );

  const isAdmin = currentUser?.role === "admin";
  const isOwner = isAdmin || currentUser?.role === "hotel_owner";

  // Prefetch owner lists on hover so destination chrome + data arrive faster
  const prefetchMyHotels = () => {
    if (!isLoggedIn) return;
    void queryClient.prefetchQuery("fetchMyHotels", apiClient.fetchMyHotels);
  };
  const prefetchMyBookings = () => {
    if (!isLoggedIn) return;
    void queryClient.prefetchQuery(
      "fetchMyBookings",
      apiClient.fetchMyBookings,
    );
  };

  return (
    <nav className="flex items-center gap-1 lg:gap-2">
      <Link to={getHotelsSearchUrl()} className={navLinkClass}>
        Hotels
      </Link>
      <Link to="/destinations" className={navLinkClass}>
        Destinations
      </Link>
      <Link to="/offers" className={navLinkClass}>
        Offers
      </Link>
      {isLoggedIn && (
        <Link
          to="/my-bookings"
          className={navLinkClass}
          onMouseEnter={prefetchMyBookings}
        >
          My Bookings
        </Link>
      )}
      {isLoggedIn && (
        <Link to="/saved-hotels" className={navLinkClass}>
          Saved
        </Link>
      )}
      {isAdmin && (
        <Link
          to="/business-insights"
          className={navLinkClass}
          onMouseEnter={() => prefetchBusinessInsightsQueries(queryClient)}
        >
          Business Insights
        </Link>
      )}
      {isOwner && (
        <Link
          to="/my-hotels"
          className={navLinkClass}
          onMouseEnter={prefetchMyHotels}
        >
          My Hotels
        </Link>
      )}

      <div className={`flex items-center justify-end ${NAV_AUTH_WIDTH}`}>
        {isLoggedIn ? (
          <UsernameMenu />
        ) : (
          <Link to="/sign-in">
            <Button
              variant="ghost"
              className="text-sm font-medium bg-primary-800 text-white hover:bg-primary-900 hover:text-gold-100 rounded-full shadow-soft"
            >
              Log In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
