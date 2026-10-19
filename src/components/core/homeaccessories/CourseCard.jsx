import React from "react";
import { IoIosPeople } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";

const CourseCard = ({ heading, desc, lessonNum, level, active }) => {
  return (
    <div
      className={`relative flex flex-col justify-between h-full p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        active
          ? "border-teal-400/50 bg-gradient-to-b from-teal-400/[0.12] to-indigo-400/[0.04] shadow-[0_16px_40px_rgba(20,184,166,0.18)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20"
      }`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold font-display text-slate-100">
          {heading}
        </h3>
        <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
      <div
        className={`flex justify-between pt-4 mt-6 text-[13px] font-medium border-t border-white/10 ${
          active ? "text-teal-200" : "text-slate-400"
        }`}
      >
        <span className="flex items-center gap-2">
          <IoIosPeople className="size-5" />
          {level}
        </span>
        <span className="flex items-center gap-2">
          <IoBookSharp className="size-4" />
          {lessonNum} Lessons
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
