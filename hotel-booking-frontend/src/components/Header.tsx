import { useNavigate } from "react-router-dom";
import useSearchContext from "../hooks/useSearchContext";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import PageContainer from "./PageContainer";
import { Building2 } from "lucide-react";

const Header = () => {
  const search = useSearchContext();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    search.clearSearchValues();
    navigate("/");
  };

  return (
    <header className="bg-[#faf8f3]/90 backdrop-blur-md border-b border-emerald-900/10 shadow-soft sticky top-0 z-50 h-[76px] flex items-center shrink-0">
      <PageContainer>
        <div className="flex justify-between items-center h-full gap-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group shrink-0"
          >
            <div className="bg-gradient-to-br from-primary-700 to-primary-950 p-2.5 rounded-2xl shadow-medium ring-1 ring-gold-400/40 group-hover:ring-gold-400/80 transition-all duration-300">
              <Building2 className="w-5 h-5 text-gold-300" />
            </div>
            <span className="flex flex-col items-start leading-none">
              <span className="font-display text-xl md:text-2xl font-semibold tracking-tight text-primary-950 group-hover:text-primary-800 transition-colors">
                GrandStay
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.28em] text-gold-600 mt-1">
                Hotels &amp; Resorts
              </span>
            </span>
          </button>
          <div className="md:hidden">
            <MobileNav />
          </div>
          <div className="hidden md:flex items-center">
            <MainNav />
          </div>
        </div>
      </PageContainer>
    </header>
  );
};

export default Header;
