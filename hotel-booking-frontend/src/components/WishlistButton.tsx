import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import useAppContext from "../hooks/useAppContext";

type Props = {
  hotelId: string;
  className?: string;
};

const WishlistButton = ({ hotelId, className = "" }: Props) => {
  const { isLoggedIn, showToast } = useAppContext();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    { enabled: isLoggedIn }
  );

  const saved = currentUser?.wishlist?.includes(hotelId) ?? false;

  const mutation = useMutation(apiClient.toggleWishlistHotel, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("fetchCurrentUser");
      queryClient.invalidateQueries("fetchWishlist");
      showToast({
        title: data.saved ? "Saved to wishlist" : "Removed from wishlist",
        type: data.saved ? "SUCCESS" : "INFO",
      });
    },
    onError: () => {
      showToast({
        title: "Could not update wishlist",
        description: "Please try again.",
        type: "ERROR",
      });
    },
  });

  if (!isLoggedIn) {
    return (
      <Link
        to="/sign-in"
        aria-label="Sign in to save hotels"
        title="Sign in to save hotels"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:scale-110 ${className}`}
      >
        <Heart className="h-4 w-4 text-gray-500" />
      </Link>
    );
  }

  return (
    <button
      aria-label={saved ? "Remove from saved hotels" : "Save hotel"}
      title={saved ? "Remove from saved hotels" : "Save hotel"}
      disabled={mutation.isLoading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate(hotelId);
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:scale-110 disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          saved
            ? "fill-red-500 text-red-500"
            : "text-gray-500 hover:text-red-400"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
