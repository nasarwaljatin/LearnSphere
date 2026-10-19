import React from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { NavbarLinks } from "../../../data/navbar-links";

const linkBase =
  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200";

const NavLinks = ({ isNavbarOpen, subLinks, matchRoute, token }) => {
  return (
    <nav
      className={`${
        isNavbarOpen ? "block" : "hidden"
      } absolute left-3 right-3 top-16 lg:static lg:block`}
    >
      <ul className="flex flex-col gap-1 p-3 lg:flex-row lg:items-center lg:p-0 rounded-2xl lg:rounded-none border border-white/10 bg-ink-800 backdrop-blur-xl lg:border-0 lg:bg-transparent lg:backdrop-blur-none shadow-2xl shadow-black/60 lg:shadow-none max-h-[calc(100vh-5rem)] overflow-y-auto lg:overflow-visible">
        {NavbarLinks.map((link, index) => {
          return (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div className="relative group">
                  <button
                    className={`${linkBase} flex items-center gap-1 w-full ${
                      matchRoute("/catalog/:catalogName")
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.title}
                    <MdOutlineKeyboardArrowDown className="transition-transform duration-200 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown panel */}
                  {/* Inline list on mobile, hover panel on desktop */}
                  <div className="lg:invisible lg:opacity-0 lg:translate-y-1 lg:group-hover:visible lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-200 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:pt-3 z-20">
                    <div className="p-1 mt-1 ml-2 border-l lg:ml-0 lg:p-2 lg:mt-0 lg:w-72 lg:rounded-2xl border-white/10 lg:border lg:bg-ink-800/95 lg:backdrop-blur-xl lg:shadow-2xl lg:shadow-black/60">
                      <p className="hidden lg:block px-3 pt-1 pb-2 text-[11px] font-semibold tracking-widest uppercase text-slate-500">
                        Browse categories
                      </p>
                      {subLinks?.length ? (
                        subLinks.map((subLink, index) => (
                          <Link
                            key={index}
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            className="flex items-center justify-between px-3 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-white/5 hover:text-teal-300 transition-colors"
                          >
                            {subLink.name}
                            <span className="text-slate-600">→</span>
                          </Link>
                        ))
                      ) : (
                        <div className="flex items-center px-3 py-2 text-sm gap-x-2 text-slate-400">
                          <span className="dbSpinner scale-75"></span>
                          Loading categories
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to={link?.path}
                  className={`${linkBase} block ${
                    matchRoute(link?.path)
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.title}
                </Link>
              )}
            </li>
          );
        })}
        {/* The header "Log in" button is hidden on phones, so offer it here */}
        {token === null && (
          <li className="pt-2 mt-1 border-t lg:hidden border-white/10">
            <Link to="/login" className={`${linkBase} block text-slate-300 hover:text-white hover:bg-white/5`}>
              Log in
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavLinks;
