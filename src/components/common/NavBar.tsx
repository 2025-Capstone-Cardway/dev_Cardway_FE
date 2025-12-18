import { NavLink } from "react-router-dom";
import cardIcon from "../../assets/navBarIcon/cardIcon.png";
import cardIcon2 from "../../assets/navBarIcon/cardIcon2.png";
import myIcon from "../../assets/navBarIcon/myIcon.png";
import myIcon2 from "../../assets/navBarIcon/myIcon2.png";
import mapIcon from "../../assets/navBarIcon/mapIcon.png";
import mapIcon2 from "../../assets/navBarIcon/mapIcon2.png";

interface NavLinkItem {
  to: string;
  label: string;
  icon: string;
  activeIcon: string;
}

export default function NavBar() {
  const links: NavLinkItem[] = [
    { to: "/cardpage", label: "Card", icon: cardIcon, activeIcon: cardIcon2 },
    { to: "/", label: "Home", icon: mapIcon, activeIcon: mapIcon2 },
    { to: "/mypage", label: "My", icon: myIcon, activeIcon: myIcon2 },
  ];

  return (
    <nav className="w-full mx-5 max-w-md bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg shadow-gray-200/50">
      <ul className="flex items-center justify-around py-3.5 max-w-md">
        {links.map(({ to, label, icon, activeIcon }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} className="block">
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-50/50">
                  <div className="relative">
                    <img 
                      className={`w-5 h-5 transition-all duration-200 ${isActive ? 'scale-110' : 'opacity-70'}`} 
                      src={isActive ? activeIcon : icon} 
                      alt={label}
                    />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-main rounded-full"></div>
                    )}
                  </div>
                  <div
                    className={`text-xs font-medium transition-all duration-200 ${
                      isActive 
                        ? "text-orange-main font-semibold" 
                        : "text-gray-600"
                    }`}
                  >
                    {label}
                  </div>
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
