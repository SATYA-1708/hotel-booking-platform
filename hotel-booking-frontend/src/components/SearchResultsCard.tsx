import { Link } from "react-router-dom";
import { HotelType } from "../../../shared/types";
import { AiFillStar } from "react-icons/ai";
import {
  MapPin,
  Building2,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  Coffee,
  Plane,
  Building,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { SafeImage } from "./ui/safe-image";
import WishlistButton from "./WishlistButton";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const getFacilityIcon = (facility: string) => {
    const iconMap: { [key: string]: any } = {
      "Free WiFi": Wifi,
      "Free Parking": Car,
      "Swimming Pool": Waves,
      "Fitness Center": Dumbbell,
      Spa: Sparkles,
      Restaurant: UtensilsCrossed,
      "Bar/Lounge": Coffee,
      "Airport Shuttle": Plane,
      "Business Center": Building,
    };
    return iconMap[facility] || Building2;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 border border-stone-100 overflow-hidden h-auto xl:h-[500px] flex">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-0 w-full h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden h-64 xl:h-[500px]">
          <SafeImage
            src={hotel.imageUrls[0]}
            alt={hotel.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <div className="bg-gold-500 text-primary-950 rounded-full px-3 py-1 shadow-medium">
              <span className="text-sm font-semibold">
                ₹{hotel.pricePerNight}
              </span>
            </div>
            {hotel.isFeatured && (
              <div className="bg-primary-800/90 backdrop-blur-sm text-gold-200 rounded-full px-3 py-1 ring-1 ring-gold-400/40">
                <span className="text-xs font-medium">Featured</span>
              </div>
            )}
          </div>

          {/* Star Rating Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <WishlistButton hotelId={hotel._id} />
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <AiFillStar className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                {hotel.starRating}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between h-auto xl:h-full overflow-hidden">
          <div className="space-y-4 overflow-y-auto xl:flex-1">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="flex">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <AiFillStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(hotel.type) ? (
                      hotel.type.slice(0, 4).map((type) => (
                        <Badge
                          key={type}
                          variant="default"
                          className="text-xs px-2 py-1"
                        >
                          {type}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="default" className="text-xs px-2 py-1">
                        {hotel.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Link
                to={`/detail/${hotel._id}`}
                className="font-display font-semibold text-lg md:text-2xl text-stone-800 hover:text-primary-700 transition-colors cursor-pointer"
              >
                {hotel.name}
              </Link>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-600 leading-relaxed line-clamp-3">
              {hotel.description}
            </div>

            {/* Hotel Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              {hotel.totalBookings && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{hotel.totalBookings} bookings</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <AiFillStar className="w-4 h-4 text-yellow-400" />
                <span>
                  {hotel.averageRating && hotel.averageRating > 0
                    ? `${hotel.averageRating.toFixed(1)} avg rating`
                    : "No ratings yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Key Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {hotel.facilities.slice(0, 6).map((facility) => {
                const IconComponent = getFacilityIcon(facility);
                return (
                  <Badge
                    key={facility}
                    variant="outline"
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs"
                  >
                    <IconComponent className="w-3 h-3 text-primary-600" />
                    <span>{facility}</span>
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            <Link
              to={`/detail/${hotel._id}`}
              className="w-full bg-primary-800 text-gold-50 py-3 px-6 rounded-full font-medium hover:bg-primary-900 hover:shadow-medium transform hover:scale-[1.02] transition-all duration-200 text-center block"
            >
              View Details &amp; Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
