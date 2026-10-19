import React from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import CourseCard from "./CourseCard";

const CourseSlider = ({ Courses, Id }) => {
  const slideLeft = () => {
    const slider = document.getElementById(`${Id}`);
    slider.scrollLeft -= 250;
  };
  const slideRight = () => {
    const slider = document.getElementById(`${Id}`);
    slider.scrollLeft += 250;
  };

  return (
    <div className="mt-6 ">
      {Courses?.length ? (
        <div className="relative">
          <div className="absolute z-30 flex gap-2 right-0 -top-14">
            <button
              onClick={slideLeft}
              aria-label="Scroll left"
              className="grid w-9 h-9 text-2xl transition-colors rounded-full place-items-center glass text-slate-300 hover:text-teal-300"
            >
              <MdArrowLeft />
            </button>
            <button
              onClick={slideRight}
              aria-label="Scroll right"
              className="grid w-9 h-9 text-2xl transition-colors rounded-full place-items-center glass text-slate-300 hover:text-teal-300"
            >
              <MdArrowRight />
            </button>
          </div>

          <div
            id={Id}
            className="w-full h-full py-2 overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
          >
            {Courses?.map((course, i) => (
              <CourseCard key={i} course={course} Height={"h-[180px]"} />
            ))}
          </div>
        </div>
      ) : (
        <p className="py-10 text-center rounded-2xl border border-dashed border-white/10 text-slate-500">No courses found</p>
      )}
    </div>
  );
};

export default CourseSlider;
