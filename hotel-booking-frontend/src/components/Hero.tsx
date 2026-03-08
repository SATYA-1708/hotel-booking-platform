import { Search, MapPin, Calendar, Users, Star, Sparkles } from "lucide-react";
import AdvancedSearch from "./AdvancedSearch";
import PageContainer from "./PageContainer";
import { StaggerItem } from "./ui/stagger";

/**
 * Landing hero — deep emerald editorial split (copy left, floating proof
 * cards right). Static bg; badge / title / copy / features / search animate.
 */
const Hero = ({ onSearch }: { onSearch: (searchData: unknown) => void }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Decorative static layers */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full border-[40px] border-gold-400/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-40 h-[380px] w-[380px] rounded-full bg-primary-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-white/[0.03] bg-[size:64px_64px]"
        aria-hidden
      />

      <PageContainer className="relative pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center max-w-6xl mx-auto">
          {/* Left — editorial copy */}
          <div className="text-center lg:text-left">
            <StaggerItem index={0} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-5 py-1.5 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 shrink-0 text-gold-300" />
                <span className="text-gold-100 text-sm font-medium tracking-wide">
                  Rated 4.9 by 10,000+ travelers
                </span>
              </div>
            </StaggerItem>

            <StaggerItem index={1}>
              <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-[1.08]">
                Stay somewhere
                <span className="block italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 pr-2">
                  unforgettable
                </span>
              </h1>
            </StaggerItem>

            <StaggerItem index={2}>
              <p className="text-base md:text-xl text-emerald-50/80 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                GrandStay curates exceptional hotels and resorts across India
                and beyond — searched in seconds, booked in minutes.
              </p>
            </StaggerItem>

            <StaggerItem index={3}>
              <div className="flex flex-nowrap items-center justify-center lg:justify-start gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[
                  { icon: Search, label: "Smart Search" },
                  { icon: MapPin, label: "Curated Destinations" },
                  { icon: Calendar, label: "Free Cancellation" },
                  { icon: Users, label: "24/7 Concierge" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-3 py-2 backdrop-blur-sm"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-gold-300" />
                    <span className="whitespace-nowrap text-xs font-medium text-white">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </StaggerItem>
          </div>

          {/* Right — floating proof-card composition */}
          <StaggerItem index={2} className="hidden lg:block relative h-[340px]">
            <div className="absolute top-2 right-4 w-64 rotate-2 rounded-2xl bg-white p-5 shadow-large ring-1 ring-black/5">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-gold-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                “The easiest booking experience we&apos;ve ever had — two
                minutes, done.”
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                Priya &amp; Arjun · Goa
              </p>
            </div>
            <div className="absolute bottom-2 left-2 w-60 -rotate-2 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 shadow-large ring-1 ring-white/10">
              <p className="text-4xl font-display font-semibold text-gold-300 mb-1">
                1,200+
              </p>
              <p className="text-sm text-emerald-50/80">
                verified stays across 80+ cities
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                <Users className="w-4 h-4 text-gold-300" />
                <span className="text-xs text-emerald-50/70">
                  3,400 bookings this month
                </span>
              </div>
            </div>
          </StaggerItem>
        </div>

        <StaggerItem index={4}>
          <AdvancedSearch onSearch={onSearch} />
        </StaggerItem>
      </PageContainer>
    </section>
  );
};

export default Hero;
