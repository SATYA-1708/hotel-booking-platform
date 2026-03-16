import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  LifeBuoy,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Search,
  CreditCard,
  CalendarX2,
  ShieldCheck,
} from "lucide-react";

type Faq = {
  icon: React.ReactNode;
  question: string;
  answer: string;
};

const FAQS: Faq[] = [
  {
    icon: <Search className="w-4 h-4" />,
    question: "How do I search for hotels?",
    answer:
      "Use the search bar on the home page — enter a destination, check-in/check-out dates and number of guests. You can further filter results by price, star rating, hotel type and facilities on the search page.",
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    question: "Which payment methods are accepted?",
    answer:
      "We accept all major credit and debit cards via Stripe's secure payment gateway. Payments are processed in INR. In development, use Stripe test card 4242 4242 4242 4242 with any future expiry and CVC.",
  },
  {
    icon: <CalendarX2 className="w-4 h-4" />,
    question: "Can I cancel my booking?",
    answer:
      "Yes — open My Bookings and use the Cancel booking button on an upcoming stay. Cancellations follow each hotel's policy (shown on the hotel detail page). Paid bookings may be eligible for a full refund to the original payment method.",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    question: "Is my payment information safe?",
    answer:
      "Absolutely. Card details are handled entirely by Stripe (PCI-DSS Level 1) — they never touch our servers. We only store your booking details and a reference to the payment.",
  },
  {
    icon: <LifeBuoy className="w-4 h-4" />,
    question: "I own a hotel — how do I list it?",
    answer:
      "Create an account and sign in, then use Add Hotel from the profile menu. You can add up to 6 photos, set pricing, facilities and policies. Your bookings appear under My Hotels with per-hotel analytics.",
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    question: "The city I want isn't listed — what now?",
    answer:
      "New destinations are added as owners list properties there. Try searching by city name anyway — the search matches partial text. Owners can add hotels in any city instantly.",
  },
];

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-medium flex items-center gap-2">
            <LifeBuoy className="h-7 w-7" />
            Help Center
          </h1>
          <p className="mt-1 text-emerald-100">
            Answers to common questions about bookings, payments and more
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card
                key={index}
                className="shadow-md border border-gray-100 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3 font-medium text-gray-700">
                    <span className="p-2 rounded-lg bg-primary-50 text-primary-600">
                      {faq.icon}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <CardContent className="px-5 pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    <p className="pt-3">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact card */}
        <Card className="shadow-lg border border-gray-100">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-medium text-gray-800">
              Still need help?
            </h2>
            <p className="text-sm text-gray-500">
              Our support team responds within 24 hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-4 flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-500">support@grandstay.com</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p className="text-gray-500">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Office</p>
                  <p className="text-gray-500">123 Travel St, Tourism City</p>
                </div>
              </div>
            </div>
            <Link to="/search">
              <Button variant="outline">Browse Hotels</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default HelpCenter;
