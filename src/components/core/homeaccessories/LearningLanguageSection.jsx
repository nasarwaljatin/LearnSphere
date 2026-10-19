import React from "react";
import HighlightText from "./HighlightText";
import kyp_img from "../../../assets/Images/Know_your_progress.png";
import cwo_img from "../../../assets/Images/Compare_with_others.png";
import pyl_img from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const images = [
  { src: kyp_img, alt: "Know your progress", className: "md:-mr-36 md:-rotate-6" },
  { src: cwo_img, alt: "Compare with others", className: "-mt-24 md:mt-0 z-10" },
  { src: pyl_img, alt: "Plan your lessons", className: "-mt-28 md:mt-0 md:-ml-40 md:rotate-6" },
];

const LearningLanguageSection = () => {
  return (
    <div className="flex flex-col items-center gap-5 pt-16 text-center">
      <h2 className="section-title">
        Your Swiss Knife for <HighlightText text={"learning anything"} />
      </h2>
      <p className="section-subtitle">
        Progress tracking, a custom schedule and side-by-side comparisons make
        learning multiple skills easy.
      </p>

      <div className="flex flex-col items-center justify-center mt-8 md:flex-row">
        {images.map((img, i) => (
          <motion.img
            key={img.alt}
            src={img.src}
            alt={img.alt}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            whileHover={{ y: -8 }}
            className={`object-contain w-[280px] sm:w-[330px] md:w-[380px] lg:w-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${img.className}`}
          />
        ))}
      </div>

      <div className="mt-6">
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
