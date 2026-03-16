import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import type { ReviewType } from "../../../shared/types";
import PageContainer from "../components/PageContainer";
import { SafeImage } from "../components/ui/safe-image";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Star,
  StarHalf,
  MessageSquareText,
  ArrowLeft,
  BadgeCheck,
  ThumbsUp,
} from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  cleanliness: "Cleanliness",
  service: "Service",
  location: "Location",
  value: "Value",
  amenities: "Amenities",
};

const Stars = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" />
      ))}
      {half && <StarHalf className="w-4 h-4 fill-current" />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </span>
  );
};

const HotelReviews = () => {
  const { hotelId } = useParams<{ hotelId: string }>();

  const { data: hotel } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId as string),
    { enabled: !!hotelId },
  );

  const { data: reviews, isLoading } = useQuery<ReviewType[]>(
    ["fetchHotelReviews", hotelId],
    () => apiClient.fetchHotelReviews(hotelId as string),
    { enabled: !!hotelId },
  );

  const { data: summary } = useQuery(
    ["fetchHotelReviewSummary", hotelId],
    () => apiClient.fetchHotelReviewSummary(hotelId as string),
    { enabled: !!hotelId },
  );

  const list = reviews || [];
  const average = summary?.averageRating ?? 0;

  // Histogram: count reviews per star bucket (5..1)
  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(1, ...histogram.map((h) => h.count));

  // Category averages across all reviews
  const categoryAvg = Object.keys(CATEGORY_LABELS).map((key) => {
    const values = list
      .map((r) => r.categories?.[key as keyof ReviewType["categories"]])
      .filter((v): v is number => typeof v === "number");
    const avg = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
    return { key, avg: Math.round(avg * 10) / 10 };
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <Link to={`/detail/${hotelId}`}>
              <Button variant="ghost" size="sm" className="mb-1 -ml-2">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to hotel
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
              Reviews{hotel?.name ? ` — ${hotel.name}` : ""}
            </h1>
            <p className="text-gray-500">
              What guests said about their stay
            </p>
          </div>
          <Button
            className="bg-primary-600 hover:bg-primary-700"
            onClick={() =>
              document
                .getElementById("reviews-list")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <MessageSquareText className="w-4 h-4 mr-2" />
            Read All Reviews
          </Button>
        </div>

        {/* Summary */}
        <Card className="shadow-lg border border-gray-100">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-8 items-center">
            <div className="text-center">
              <p className="text-5xl font-medium text-gray-800">
                {average.toFixed(1)}
              </p>
              <Stars value={average} />
              <p className="text-sm text-gray-500 mt-1">
                {summary?.reviewCount ?? list.length} review(s)
              </p>
            </div>

            <div className="space-y-1.5">
              {histogram.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-gray-600">{star}★</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-gray-500">{count}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {categoryAvg.map(({ key, avg }) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-1.5"
                >
                  <span className="text-gray-600">
                    {CATEGORY_LABELS[key]}
                  </span>
                  <span className="font-medium text-gray-700">
                    {avg.toFixed(1)}/5
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews list */}
        <div id="reviews-list" className="space-y-4">
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </>
          )}

          {!isLoading && list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-10 text-center">
              <MessageSquareText className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-4 text-gray-700 font-medium">
                No reviews yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Completed stays can be reviewed from My Bookings.
              </p>
            </div>
          )}

          {list.map((review) => (
            <Card
              key={review._id}
              className="shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <SafeImage
                      src={`https://robohash.org/${encodeURIComponent(
                        String(review.userId),
                      )}.png?set=set1&size=80x80`}
                      alt="Guest avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-700 flex items-center gap-1.5">
                        Guest Reviewer
                        {review.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-green-600" />
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars value={review.rating} />
                    <Badge variant="outline">{review.rating}/5</Badge>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(review.categories || {}).map(
                    ([key, value]) => (
                      <Badge
                        key={key}
                        variant="outline"
                        className="bg-slate-50 font-normal"
                      >
                        {CATEGORY_LABELS[key] || key}: {value}/5
                      </Badge>
                    ),
                  )}
                  {(review.helpfulCount ?? 0) > 0 && (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {review.helpfulCount} found helpful
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default HotelReviews;
