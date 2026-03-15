import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import type { HotelType } from "../../../shared/types";
import PageContainer from "../components/PageContainer";
import { SafeImage } from "../components/ui/safe-image";
import { Button } from "../components/ui/button";
import {
  MapPin,
  IndianRupee,
  ArrowRight,
  Compass,
  Star,
} from "lucide-react";

type Destination = {
  city: string;
  country: string;
  hotelCount: number;
  minPrice: number;
  topRating: number;
  image: string | undefined;
};

const DESTINATION_GRADIENTS = [
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-sky-600",
];

const Destinations = () => {
  const { data: hotels, isLoading } = useQuery<HotelType[]>(
    "fetchHotels",
    apiClient.fetchHotels,
  );

  const destinations = useMemo<Destination[]>(() => {
    if (!hotels) return [];
    const byCity = new Map<string, HotelType[]>();
    for (const hotel of hotels) {
      const key = hotel.city?.trim();
      if (!key) continue;
      byCity.set(key, [...(byCity.get(key) || []), hotel]);
    }
    return Array.from(byCity.entries())
      .map(([city, list]) => ({
        city,
        country: list[0]?.country || "",
        hotelCount: list.length,
        minPrice: Math.min(...list.map((h) => h.pricePerNight || 0)),
        topRating: Math.max(...list.map((h) => h.starRating || 0)),
        image: list.find((h) => h.imageUrls?.length)?.imageUrls[0],
      }))
      .sort((a, b) => b.hotelCount - a.hotelCount);
  }, [hotels]);

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-medium flex items-center gap-2">
            <Compass className="h-7 w-7" />
            Explore Destinations
          </h1>
          <p className="mt-1 text-blue-100">
            Handpicked stays across India's most loved cities
          </p>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* City grid */}
        {!isLoading && destinations.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-10 text-center">
            <MapPin className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-4 text-gray-700 font-medium">
              No destinations yet
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, index) => (
            <Link
              key={dest.city}
              to={`/search?destination=${encodeURIComponent(dest.city)}`}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="h-56 w-full">
                {dest.image ? (
                  <SafeImage
                    src={dest.image}
                    alt={dest.city}
                    width={400}
                    height={224}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${
                      DESTINATION_GRADIENTS[
                        index % DESTINATION_GRADIENTS.length
                      ]
                    }`}
                  />
                )}
              </div>

              {/* Overlay info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-medium text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {dest.city}
                    </h2>
                    <p className="text-sm text-white/80">{dest.country}</p>
                  </div>
                  <span className="flex items-center gap-1 text-white/90 text-sm bg-white/15 backdrop-blur px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {dest.topRating}★
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-white/90 text-sm">
                  <span>
                    {dest.hotelCount} hotel{dest.hotelCount > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {dest.minPrice.toLocaleString("en-IN")} onwards
                  </span>
                </div>

                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white group-hover:gap-2 transition-all">
                  View stays
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link to="/search">
            <Button variant="outline" size="lg">
              Browse all hotels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default Destinations;
