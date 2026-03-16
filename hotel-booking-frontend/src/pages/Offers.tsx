import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import useAppContext from "../hooks/useAppContext";
import {
  TicketPercent,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  CalendarClock,
} from "lucide-react";

type Offer = {
  code: string;
  title: string;
  description: string;
  discount: string;
  minStayNights?: number;
  validTill: string;
  accent: string;
};

const OFFERS: Offer[] = [
  {
    code: "FIRSTSTAY",
    title: "First Stay Discount",
    description:
      "New to GrandStay? Enjoy 10% off your very first booking at any hotel across India.",
    discount: "10% OFF",
    validTill: "Dec 31, 2026",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    code: "LONGSTAY7",
    title: "Long Stay Saver",
    description:
      "Staying a week or more? Save big on extended getaways — perfect for workations.",
    discount: "15% OFF",
    minStayNights: 7,
    validTill: "Nov 30, 2026",
    accent: "from-emerald-600 to-teal-600",
  },
  {
    code: "WEEKEND20",
    title: "Weekend Escape",
    description:
      "Make weekends memorable with 20% off Friday-to-Sunday stays in select cities.",
    discount: "20% OFF",
    validTill: "Sep 30, 2026",
    accent: "from-rose-500 to-pink-600",
  },
  {
    code: "FAMILYFUN",
    title: "Family Bundle",
    description:
      "Travelling with kids? Book 2+ rooms and unlock complimentary breakfast for the family.",
    discount: "Free Breakfast",
    minStayNights: 2,
    validTill: "Oct 15, 2026",
    accent: "from-amber-500 to-orange-600",
  },
  {
    code: "MOUNTAIN15",
    title: "Hill Station Special",
    description:
      "Breathe in the mountains — extra savings on stays in Shimla, Manali and Mussoorie.",
    discount: "₹1,500 OFF",
    validTill: "Dec 15, 2026",
    accent: "from-cyan-600 to-sky-700",
  },
  {
    code: "ROYALSTAY",
    title: "Royal Heritage Rate",
    description:
      "Live like royalty at heritage palaces in Rajasthan with a special curated rate.",
    discount: "12% OFF",
    validTill: "Mar 31, 2027",
    accent: "from-violet-600 to-purple-700",
  },
];

const Offers = () => {
  const { showToast } = useAppContext();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast({
        title: "Code Copied",
        description: `${code} is ready — apply it during checkout.`,
        type: "SUCCESS",
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      showToast({
        title: "Copy Failed",
        description: `Please note your code manually: ${code}`,
        type: "ERROR",
      });
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-700 p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-medium flex items-center gap-2">
            <TicketPercent className="h-7 w-7" />
            Offers &amp; Coupons
          </h1>
          <p className="mt-1 text-purple-100">
            Deals worth packing for — copy a code and save on your next stay
          </p>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <Card
              key={offer.code}
              className="shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <CardHeader
                className={`bg-gradient-to-r ${offer.accent} text-white py-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium tracking-wide">
                    {offer.discount}
                  </span>
                  <Sparkles className="w-5 h-5 opacity-80" />
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h2 className="font-medium text-gray-800">{offer.title}</h2>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {offer.minStayNights && (
                  <Badge variant="outline" className="font-normal">
                    <CalendarClock className="w-3 h-3 mr-1" />
                    Min {offer.minStayNights} night(s)
                  </Badge>
                )}

                {/* Coupon code row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-2 border-dashed border-primary-300 rounded-lg px-3 py-2 text-center font-mono font-medium text-primary-700 bg-primary-50/50">
                    {offer.code}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCode(offer.code)}
                    aria-label={`Copy ${offer.code}`}
                  >
                    {copiedCode === offer.code ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-400">
                  Valid till {offer.validTill} · T&amp;C apply
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-8 text-center">
          <h2 className="text-lg md:text-xl font-medium text-gray-800">
            Found a deal you love?
          </h2>
          <p className="text-gray-500 mt-1 mb-4">
            Search hotels and apply your coupon code at checkout.
          </p>
          <Link to="/search">
            <Button className="bg-primary-600 hover:bg-primary-700">
              Find Your Stay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Offers are promotional and may change without notice. Coupon redemption
          at checkout is coming soon.
        </p>
      </div>
    </PageContainer>
  );
};

export default Offers;
