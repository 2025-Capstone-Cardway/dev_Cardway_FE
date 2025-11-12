import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  const location = useLocation();
  const hideNavPaths: string[] = ["/login"];
  const hideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gray-50">
      <main className="flex-1 w-full max-w-md bg-white z-10">
        <Outlet />
      </main>
      {!hideNav && (
        <div className="absolute bottom-5 flex justify-center w-full z-50">
          <NavBar />
        </div>
      )}
    </div>
  );
}
