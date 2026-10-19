import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import Logo from "../../../src/assets/Logo/LL_logo.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];

const columns = [
  {
    title: "Company",
    links: [
      { title: "About", to: "/about" },
      { title: "Careers", to: "/#footer" },
      { title: "Affiliates", to: "/#footer" },
      { title: "Help Center", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      "Articles",
      "Blog",
      "Cheat Sheets",
      "Code challenges",
      "Docs",
      "Projects",
    ].map((title) => ({ title, to: "/#footer" })),
  },
  {
    title: "Community",
    links: ["Forums", "Chapters", "Events", "For students"].map((title) => ({
      title,
      to: "/#footer",
    })),
  },
  // First few subjects / languages from the shared footer data
  ...FooterLink2.slice(0, 2).map((group) => ({
    title: group.title,
    links: group.links.slice(0, 6).map((link) => ({
      title: link.title,
      to: "/#footer",
    })),
  })),
];

const socials = [
  { icon: FaFacebook, label: "Facebook" },
  { icon: FaGoogle, label: "Google" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaYoutube, label: "YouTube" },
];

const Footer = () => {
  return (
    <footer
      id="footer"
      className="relative border-t border-white/[0.06] bg-ink-950 font-inter"
    >
      {/* Accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

      <div className="grid w-11/12 gap-12 py-16 mx-auto max-w-maxContent lg:grid-cols-[1.4fr_3fr]">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <img src={Logo} alt="LearnSphere" className="w-40" />
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Learn anything. Teach everything. A modern platform for learners
            and instructors to grow together.
          </p>
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#footer"
                aria-label={label}
                className="grid transition-colors rounded-full w-9 h-9 place-items-center glass text-slate-400 hover:text-teal-300 hover:border-teal-400/40"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-semibold tracking-widest uppercase text-slate-200">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors text-slate-400 hover:text-teal-300"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="flex flex-col items-center justify-between w-11/12 gap-4 py-6 mx-auto text-sm max-w-maxContent text-slate-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} LearnSphere. Built by Jatin Nasarwal.
          </p>
          <div className="flex gap-5">
            {BottomFooter.map((ele) => (
              <Link
                key={ele}
                to={"/#footer"}
                className="transition-colors hover:text-slate-300"
              >
                {ele}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
