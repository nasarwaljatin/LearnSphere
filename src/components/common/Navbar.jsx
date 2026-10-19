import React, { useContext, useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo/LL_logo.png";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ThemeContext } from "../../context/ThemeContextProvider";
import { MdClose } from "react-icons/md";
import { RiMenuUnfold2Fill } from "react-icons/ri";
import NavLinks from "../core/navbar/NavLinks";
import NavSearchBox from "../core/navbar/NavSearchBox";
import NavButtons from "../core/navbar/NavButtons";

const Navbar = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const { theme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [openBox, setOpenBox] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const [subLinks, setSubLinks] = useState([]);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State to control navbar visibility

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result?.data?.categoryDetails?.categories ?? []);
    } catch (error) {
      // toast.error("Error occurred fetching categories.");
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  // Close the mobile menu after navigating
  useEffect(() => {
    setIsNavbarOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-[100] w-full h-14 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full gap-3 px-3 mx-auto sm:px-6 lg:px-10 max-w-[1400px]">
        {/* Logo Image */}
        <Link to={"/"} className="shrink-0">
          <img
            src={Logo}
            alt="LearnSphere"
            className="md:w-[150px] w-[100px]"
            loading="lazy"
          />
        </Link>

        {/* nav links */}
        <NavLinks
          isNavbarOpen={isNavbarOpen}
          subLinks={subLinks}
          matchRoute={matchRoute}
          token={token}
        />

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Box */}
          <NavSearchBox openBox={openBox} setOpenBox={setOpenBox} />

          {/* Buttons (Login, Signup, Dashboard) */}
          <NavButtons
            pathname={pathname}
            toggleTheme={toggleTheme}
            token={token}
            user={user}
            theme={theme}
          />

          {/* Toggle Button for Navbar */}
          <button
            aria-label={isNavbarOpen ? "Close menu" : "Open menu"}
            className="grid p-2 text-lg rounded-full lg:hidden place-items-center text-slate-200 glass"
            onClick={() => setIsNavbarOpen((prev) => !prev)}
          >
            {isNavbarOpen ? <MdClose /> : <RiMenuUnfold2Fill />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
