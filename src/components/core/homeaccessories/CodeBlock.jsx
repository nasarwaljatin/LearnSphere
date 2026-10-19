import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const CodeBlock = ({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  codeBlock,
  codeColor,
  glow = "from-teal-500/25 to-indigo-500/10",
}) => {
  const lineCount = codeBlock.split("\n").length + 2;

  return (
    <div
      className={`flex ${position} items-center lg:my-24 my-14 justify-between gap-12`}
    >
      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col w-full gap-6 text-center lg:w-1/2 lg:text-start"
      >
        {heading}
        <p className="text-base text-slate-400">{subHeading}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-2 lg:justify-start">
          <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
            {ctaBtn1.btnTxt}
            <FaArrowRight />
          </CTAButton>
          <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
            {ctaBtn2.btnTxt}
          </CTAButton>
        </div>
      </motion.div>

      {/* Editor window */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative w-full lg:w-[520px]"
      >
        <div
          className={`absolute -inset-6 rounded-[2rem] bg-gradient-to-br ${glow} blur-2xl`}
        />
        <div className="relative overflow-hidden border rounded-2xl border-white/10 bg-ink-800/90 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-rose-400/70" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-xs font-mono text-slate-500">
              index.html
            </span>
          </div>
          <div className="flex py-4 text-[13px] leading-6 font-mono">
            <div className="flex flex-col px-4 text-right select-none text-slate-600">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <div className={`flex-1 pr-4 min-w-0 ${codeColor}`}>
              <TypeAnimation
                sequence={[codeBlock, 1000, ""]}
                repeat={Infinity}
                cursor={true}
                style={{
                  whiteSpace: "pre-wrap",
                  display: "block",
                  wordBreak: "break-word",
                }}
                omitDeletionAnimation={true}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeBlock;
