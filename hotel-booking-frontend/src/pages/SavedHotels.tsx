import { Link } from "react-router-dom";
import { useQueryWithLoading } from "../hooks/useLoadingHooks";
import * as apiClient from "../api-client";
import type { HotelType } from "../../../shared/types";
import SearchResultsCard from "../components/SearchResultsCard";
import PageContainer from "../components/PageContainer";
import { Heart } from "lucide-react";
import useAppContext from "../hooks/useAppContext";

const SavedHotels = () => {
  const { isLoggedIn } = useAppContext();
  const { data: hotels, isLoading } = useQueryWithLoading<HotelType[]>(
    "fetchWishlist",
    apiClient.fetchWishlist,
    {
      loadingMessage: "Loading your saved hotels...",
      enabled: isLoggedIn,
    }
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-medium flex items-center gap-2">
            <Heart className="h-7 w-7 fill-white" />
            Saved Hotels
          </h1>
          <p className="mt-1 text-blue-100">
            Your wishlist of hotels to book later
          </p>
        </div>

        {!isLoading && (!hotels || hotels.length === 0) && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-4 text-gray-700 font-medium">
              No saved hotels yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the heart on any hotel to save it here.
            </p>
            <Link
              to="/search"
              className="mt-5 inline-block rounded-xl bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700"
            >
              Explore hotels
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {hotels?.map((hotel) => (
            <SearchResultsCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default SavedHotels;
