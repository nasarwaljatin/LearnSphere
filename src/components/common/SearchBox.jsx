import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

  return createPortal(
    <div
      onClick={closeBox}
      className="fixed inset-0 z-[1000] flex items-start justify-center px-4 pt-[12vh] text-slate-300 bg-ink-950/70 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-xl overflow-hidden text-sm rounded-2xl border border-white/10 bg-ink-800/95 shadow-2xl shadow-black/60"
      >
        <div className="flex items-center gap-3 px-4 border-b border-white/10">
          <BsSearch className="text-lg text-teal-300 shrink-0" />
          <input
            ref={inputSearchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses by name or tag, e.g. ML, DSA"
            aria-label="Search courses"
            className="flex-1 py-4 text-base bg-transparent outline-none placeholder:text-slate-500 text-slate-100"
          />
          {status === "loading" && (
            <span className="w-4 h-4 border-2 rounded-full border-teal-400 border-t-transparent animate-spin" />
          )}
          <button
            onClick={closeBox}
            aria-label="Close search"
            className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="px-2 pb-2 min-h-[120px]">
          {status === "idle" && (
            <p className="px-3 py-8 text-center text-slate-500">
              Start typing to find a course.
            </p>
          )}
        {status === "done" && suggestions.length === 0 && (
          <p className="px-3 py-8 text-center text-slate-400">
            No courses found for &quot;{query}&quot;
          </p>
        )}
        {status === "error" && (
          <p className="px-3 py-8 text-center text-rose-300">
            Search is unavailable right now. Please try again.
          </p>
        )}

        {suggestions.length > 0 && (
          <ul
            role="listbox"
            className="w-full pt-2 overflow-y-auto max-h-[50vh] text-slate-200"
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
                className={`flex items-center gap-x-3 px-3 py-2.5 text-xs rounded-xl md:text-sm hover:cursor-pointer transition-colors duration-100 ${
                  index === activeIndex
                    ? "bg-white/[0.07] text-white"
                    : "text-slate-300"
                }`}
              >
                {suggestion.thumbnail && (
                  <img
                    src={suggestion.thumbnail}
                    alt=""
                    loading="lazy"
                    className="object-cover w-14 h-9 rounded-md"
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

        <div className="flex items-center gap-4 px-4 py-2.5 text-[11px] border-t border-white/10 text-slate-500 bg-black/20">
          <span>
            <kbd className="px-1.5 py-0.5 mr-1 rounded border border-white/10 bg-white/5">↑↓</kbd>
            navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 mr-1 rounded border border-white/10 bg-white/5">Enter</kbd>
            open
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 mr-1 rounded border border-white/10 bg-white/5">Esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchBox;
