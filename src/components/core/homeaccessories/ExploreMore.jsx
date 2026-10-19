import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";

import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsUsed = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsUsed[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <span className="eyebrow">Explore</span>
      <h2 className="mt-4 text-center section-title">
        Unlock the <HighlightText text={"Power of Code"} />
      </h2>
      <p className="mt-4 text-center section-subtitle">
        Learn to build anything you can imagine.
      </p>

      <div className="flex max-w-full gap-1 p-1 mt-10 overflow-x-auto rounded-full glass scrollbar-hide">
        {tabsUsed.map((element) => (
          <button
            key={element}
            onClick={() => setMyCards(element)}
            className={`px-4 py-2 text-xs md:text-sm rounded-full whitespace-nowrap transition-all duration-200 ${
              currentTab === element
                ? "bg-white text-slate-900 font-semibold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {element}
          </button>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 gap-5 mt-12 md:grid-cols-3">
        {courses.map((element, index) => (
          <div
            className="cursor-pointer"
            key={index}
            onClick={() => setCurrentCard(element.heading)}
          >
            <CourseCard
              heading={element.heading}
              desc={element.description}
              lessonNum={element.lessionNumber}
              level={element.level}
              active={currentCard === element.heading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
