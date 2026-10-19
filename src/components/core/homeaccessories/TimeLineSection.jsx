import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
import { motion } from "framer-motion";
const timeLine = [
  {
    logo: Logo1,
    heading: "Leadership",
    description: "Fully commited to the success company.",
  },
  {
    logo: Logo2,
    heading: "Responsibility",
    description: "Students will always be our top priority.",
  },
  {
    logo: Logo3,
    heading: "Flexibility",
    description: "The ability to switch is an important skills.",
  },
  {
    logo: Logo4,
    heading: "Solve the problem",
    description: "Code your way to a solution.",
  },
];

const TimeLineSection = () => {
  return (
    <div className="grid items-center gap-14 py-20 md:grid-cols-2">
      <motion.ol
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-3"
      >
        {timeLine.map((el, index) => (
          <li
            key={index}
            className="relative flex items-center gap-5 p-4 card card-hover"
          >
            <div className="grid w-12 h-12 rounded-xl shrink-0 place-items-center bg-white/90 shadow-lg shadow-black/30">
              <img src={el.logo} alt="" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold font-display text-slate-100">
                {el.heading}
              </h3>
              <p className="text-sm text-slate-400">{el.description}</p>
            </div>
            <span className="ml-auto font-mono text-xs text-slate-600">
              0{index + 1}
            </span>
          </li>
        ))}
      </motion.ol>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-500/25 to-indigo-500/20 blur-2xl" />
        <img
          src={TimeLineImage}
          alt="Students learning on LearnSphere"
          className="relative object-cover w-full border rounded-2xl border-white/10"
        />
        <div className="absolute flex items-center gap-3 px-4 py-3 -bottom-6 left-6 rounded-2xl glass bg-ink-800/80 shadow-xl shadow-black/40">
          <span className="grid text-lg rounded-full w-9 h-9 place-items-center bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-950">
            ✓
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-100">
              Learn at your own pace
            </p>
            <p className="text-xs text-slate-400">Anytime, anywhere</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeLineSection;
