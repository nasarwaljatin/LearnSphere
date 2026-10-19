import HighlightText from "./HighlightText";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa6";
import ins_img from "../../../assets/Images/Instructor.jpg";
import { motion } from "framer-motion";

const InstructorSection = () => {
  return (
    <div className="grid items-center gap-14 py-24 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto w-4/5 md:w-full"
      >
        <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-indigo-500/25 to-teal-500/20 blur-2xl" />
        <img
          src={ins_img}
          alt="Instructor"
          className="relative object-cover w-full border rounded-3xl border-white/10 aspect-[4/5] md:aspect-auto"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center md:items-start md:text-start"
      >
        <span className="eyebrow">For instructors</span>
        <h2 className="mt-4 section-title">
          Become an
          <HighlightText text={"Instructor"} />
        </h2>
        <p className="max-w-md mt-4 mb-8 text-slate-400">
          Instructors from around the world teach students on LearnSphere. We
          provide the tools to upload videos and PDFs, build structured courses
          and track how your students are doing.
        </p>
        <CTAButton active={true} linkto={"/signup"}>
          Start Teaching Today
          <FaArrowRight />
        </CTAButton>
      </motion.div>
    </div>
  );
};

export default InstructorSection;
