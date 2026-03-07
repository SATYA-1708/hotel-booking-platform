import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageContainer from "./PageContainer";

const footerLinkClass = "text-emerald-100/60 hover:text-gold-300 transition-colors";

const Footer = () => {
  return (
    <footer className="bg-primary-950 text-white border-t-4 border-gold-500/70">
      {/* Newsletter band */}
      <PageContainer className="py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-primary-900 to-primary-800 ring-1 ring-white/10 px-6 md:px-10 py-7">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-white">
              Get members-only rates
            </h3>
            <p className="text-sm text-emerald-100/60 mt-1">
              Join the GrandStay list — one email a month, no spam.
            </p>
          </div>
          <form
            className="flex w-full max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-l-xl bg-white/10 border border-white/15 border-r-0 px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:outline-none focus:border-gold-400/60"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-r-xl bg-gold-500 hover:bg-gold-400 text-primary-950 font-semibold text-sm px-5 transition-colors"
            >
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-700 to-primary-800 p-2.5 rounded-2xl ring-1 ring-gold-400/40">
                <Building2 className="w-5 h-5 text-gold-300" />
              </div>
              <span className="font-display text-xl md:text-2xl font-semibold tracking-tight">
                GrandStay
              </span>
            </div>
            <p className="text-emerald-100/60 leading-relaxed text-sm">
              Discover exceptional hotels, resorts, and stays worldwide. Book
              with confidence — stay somewhere unforgettable.
            </p>
            <div className="flex space-x-3 pt-1">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="rounded-full bg-white/5 ring-1 ring-white/10 p-2.5 text-emerald-100/60 hover:text-gold-300 hover:ring-gold-400/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-gold-400">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className={footerLinkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className={footerLinkClass}>
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/destinations" className={footerLinkClass}>
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/offers" className={footerLinkClass}>
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/help" className={footerLinkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-gold-400">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/help" className={footerLinkClass}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/help" className={footerLinkClass}>
                  Booking Guide
                </Link>
              </li>
              <li>
                <Link to="/help" className={footerLinkClass}>
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-gold-400">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-300 shrink-0" />
                <span className="text-emerald-100/60 text-sm">
                  support@grandstay.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold-300 shrink-0" />
                <span className="text-emerald-100/60 text-sm">
                  +91 (0) 1800-123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gold-300 shrink-0" />
                <span className="text-emerald-100/60 text-sm">
                  21 Marine Drive, Mumbai
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-emerald-100/50 text-sm">
            &copy; {new Date().getFullYear()} GrandStay. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-emerald-100/50 hover:text-gold-300 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-emerald-100/50 hover:text-gold-300 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-emerald-100/50 hover:text-gold-300 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
