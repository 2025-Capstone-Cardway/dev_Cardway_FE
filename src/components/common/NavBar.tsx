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
    <nav className="w-full mx-5 max-w-md bg-white border border-border-main rounded-full shadow-md">
      <ul className="flex items-center justify-around py-2 max-w-md">
        {links.map(({ to, label, icon, activeIcon }) => (
          <li key={to}>
            <NavLink to={to}>
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-1">
                  <img className="w-5 h-5" src={isActive ? activeIcon : icon} />
                  <div
                    className={isActive ? "text-orange-main" : "text-text-main"}
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
