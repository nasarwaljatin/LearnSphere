import React from "react";
import ProfileDropdown from "../auth/ProfileDropdown";
import { Link } from "react-router-dom";
import { FaCartShopping, FaMoon } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";
import { useSelector } from "react-redux";

const NavButtons = ({ user, toggleTheme, pathname, token, theme }) => {
  const { totalItems } = useSelector((state) => state.cart);
  return (
    <div className="flex items-center ml-2 text-sm md:gap-x-4 gap-x-2">
      {/* <div
        onClick={toggleTheme}
        className={`
            ${pathname === "/" ? "hidden" : "block"}
            relative flex items-center p-1 rounded-full w-14 h-7 dark:bg-slate-800 bg-slate-200`}
      >
        <div
          className={`w-6 h-6 dark:bg-slate-500 bg-slate-400 light:bg-white rounded-full flex items-center justify-center transform transition-all duration-500 ease-in-out ${
            theme === "light" ? "translate-x-0" : "translate-x-6"
          }`}
        >
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? <FiSun /> : <FaMoon />}
          </button>
        </div>
      </div> */}
      {user &&
        user?.accountType !== "Instructor" &&
        user?.accountType !== "Admin" && (
          <Link
            to={"/dashboard/cart"}
            aria-label="Cart"
            className="relative grid p-2 transition-colors rounded-full place-items-center text-slate-300 hover:text-white hover:bg-white/5"
          >
            <FaCartShopping className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full place-items-center bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950">
                {totalItems}
              </span>
            )}
          </Link>
        )}
      {token === null && (
        <Link
          to={"/login"}
          className="hidden px-3 py-1.5 text-sm font-medium transition-colors rounded-full sm:inline-block text-slate-300 hover:text-white hover:bg-white/5"
        >
          Log in
        </Link>
      )}
      {token === null && (
        <Link to={"/signup"} className="btn-primary !px-4 !py-1.5">
          Sign up
        </Link>
      )}
      {token !== null && <ProfileDropdown />}
    </div>
  );
};

export default NavButtons;
