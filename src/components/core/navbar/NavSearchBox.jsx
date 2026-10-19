import { useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import SearchBox from "../../common/SearchBox";

const NavSearchBox = ({ openBox, setOpenBox }) => {
  const handleOnClick = () => {
    setOpenBox(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpenBox(true);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenBox(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpenBox]);

  return (
    <>
      <button
        onClick={handleOnClick}
        aria-label="Search courses"
        className="flex items-center gap-2 py-1.5 pl-3 pr-1.5 text-sm transition-colors rounded-full text-slate-400 glass hover:text-slate-200 hover:border-white/20"
      >
        <AiOutlineSearch className="text-lg" />
        <span className="hidden md:inline">Search courses</span>
        <kbd className="hidden sm:inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-inter text-[10px] text-slate-400">
          Ctrl K
        </kbd>
      </button>
      {/* Rendered outside the trigger so overlay clicks don't bubble into it and reopen the box */}
      {openBox && <SearchBox setOpenBox={setOpenBox} />}
    </>
  );
};

export default NavSearchBox;
