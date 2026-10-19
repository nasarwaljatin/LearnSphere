import React, { useEffect, useRef, useState } from "react";
import { getTaggedCourses } from "../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";

const DEBOUNCE_MS = 300;
const MAX_CACHE_ENTRIES = 50;

// Results are cached per query for the lifetime of the page, so typing back
// over a previous query (or reopening the box) doesn't hit the API again.
const searchCache = new Map();

const cacheResult = (query, result) => {
  if (searchCache.size >= MAX_CACHE_ENTRIES) {
    searchCache.delete(searchCache.keys().next().value);
  }
  searchCache.set(query, result);
};

const listitemVariants = {
  initial: { opacity: 0, y: -4 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * index, duration: 0.15 },
  }),
};

// Wraps the part of `text` that matches `query` in a highlight.
const HighlightMatch = ({ text, query }) => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent text-teal-300 font-semibold">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
};

const SearchBox = ({ setOpenBox }) => {
  const inputSearchRef = useRef();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortRef = useRef(null);

  const closeBox = () => {
    abortRef.current?.abort();
    setOpenBox(false);
  };

  // Debounced search: waits DEBOUNCE_MS after the last keystroke, then cancels
  // any in-flight request so a slow older response can't overwrite newer ones.
  useEffect(() => {
    const query = searchValue.trim().toLowerCase();
    setActiveIndex(-1);

    if (!query) {
      abortRef.current?.abort();
      setSuggestions([]);
      setStatus("idle");
      return;
    }

    if (searchCache.has(query)) {
      setSuggestions(searchCache.get(query));
      setStatus("done");
      return;
    }

    setStatus("loading");
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const result = await getTaggedCourses(query, controller.signal);
        cacheResult(query, result);
        setSuggestions(result);
        setStatus("done");
      } catch (error) {
        if (error?.name === "CanceledError" || controller.signal.aborted) return;
        setSuggestions([]);
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    inputSearchRef.current && inputSearchRef.current.focus();
    return () => abortRef.current?.abort();
  }, []);

  const openCourse = (courseId) => {
    closeBox();
    navigate(`/courses/${courseId}`);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      openCourse(suggestions[Math.max(activeIndex, 0)].courseId);
    }
  };

  const query = searchValue.trim();

  return (
    <div
      onClick={closeBox}
      className="fixed text-slate-300 !mt-14 pt-5 grid w-screen h-screen place-items-center inset-0 z-[1000] bg-slate-950/70"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[350px] md:w-[400px] lg:w-[500px] h-auto min-h-[200px] shadow-md flex gap-x-2 flex-col shadow-slate-950 bg-gradient-to-br from-slate-800 to-slate-900 rounded-md px-4 pt-4 pb-10 text-sm items-start justify-center  scrollbar-hide"
      >
        <span className="absolute bottom-0.5 right-2 font-poppins text-xs bg-neutral-900 px-2 py-1 rounded-md">
          <kbd className="font-poppins px-1.5 py-0.5 rounded-md bg-black/55 text-teal-200/75 font-medium">
            ↑↓
          </kbd>{" "}
          navigate{" "}
          <kbd className="font-poppins px-1.5 py-0.5 rounded-md bg-black/55 text-teal-200/75 font-medium">
            Enter
          </kbd>{" "}
          open{" "}
          <kbd className="font-poppins px-1.5 py-0.5 rounded-md bg-black/55 text-rose-200/75 font-medium">
            ESC
          </kbd>{" "}
          close
        </span>

        <span className="absolute -top-3 -right-3 text-slate-300">
          <button onClick={closeBox} aria-label="Close search">
            <MdClose className="p-1 text-2xl rounded-full bg-slate-700 hover:bg-slate-800 hover:text-slate-200 shadow-md shadow-slate-950" />
          </button>
        </span>
        <h1 className="text-lg mb-3 font-medium text-teal-400 font-inter tracking-wide w-full">
          Find your courses here
        </h1>
        <div className="w-full h-full p-4 flex items-center justify-start bg-gradient-to-br from-slate-700 to-slate-800 rounded-md shadow-md shadow-slate-950">
          <div className="w-[40px] text-xl flex items-center">
            <BsSearch className="relative text-teal-400" />
          </div>
          <input
            ref={inputSearchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by course name or tag, e.g. ML, DSA"
            aria-label="Search courses"
            className="flex-1 px-2 py-1 bg-transparent placeholder:text-slate-400 outline-none tracking-wide"
          />
          {status === "loading" && (
            <span className="w-4 h-4 border-2 rounded-full border-teal-400 border-t-transparent animate-spin" />
          )}
        </div>

        {status === "done" && suggestions.length === 0 && (
          <p className="w-full mt-4 text-center text-slate-400">
            No courses found for &quot;{query}&quot;
          </p>
        )}
        {status === "error" && (
          <p className="w-full mt-4 text-center text-rose-300">
            Search is unavailable right now. Please try again.
          </p>
        )}

        {suggestions.length > 0 && (
          <ul
            role="listbox"
            className="w-full px-2 py-2 mt-3 overflow-y-auto rounded-md max-h-[50vh] bg-slate-800 bg-opacity-75 backdrop-blur-md text-[#cdf1ff]"
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                variants={listitemVariants}
                initial="initial"
                animate="animate"
                custom={index}
                key={suggestion.courseId}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openCourse(suggestion.courseId)}
                className={`flex items-center gap-x-3 px-2 py-2 my-1 text-xs rounded-md md:text-sm hover:cursor-pointer transition-colors duration-100 ${
                  index === activeIndex
                    ? "bg-slate-600 text-teal-300"
                    : "bg-slate-700"
                }`}
              >
                {suggestion.thumbnail && (
                  <img
                    src={suggestion.thumbnail}
                    alt=""
                    loading="lazy"
                    className="object-cover w-12 h-8 rounded"
                  />
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="truncate">
                    <HighlightMatch text={suggestion.courseName} query={query} />
                  </p>
                  {suggestion.instructorName && (
                    <p className="text-[11px] text-slate-400 truncate">
                      by {suggestion.instructorName}
                    </p>
                  )}
                </div>
                {typeof suggestion.price === "number" && (
                  <span className="text-xs text-slate-300 shrink-0">
                    {suggestion.price === 0 ? "Free" : `₹${suggestion.price}`}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
