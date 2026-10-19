import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  MdOutlineOndemandVideo,
  MdOutlineReplay,
  MdOutlineSearch,
  MdOutlineVerifiedUser,
  MdOutlineInsights,
  MdOutlineRateReview,
} from "react-icons/md";
import { Link } from "react-router-dom";
import BounceToTop from "../components/common/BounceToTop.jsx";
import Spinner from "../components/common/Spinner.jsx";
import CTAButton from "../components/core/homeaccessories/CTAButton.jsx";
import HighlightText from "../components/core/homeaccessories/HighlightText.jsx";
import banner2Video from "../assets/Images/banner2.mp4";

// Lazy load below-the-fold sections
const LearningLanguageSection = lazy(() =>
  import("../components/core/homeaccessories/LearningLanguageSection.jsx")
);
const InstructorSection = lazy(() =>
  import("../components/core/homeaccessories/InstructorSection.jsx")
);
const Footer = lazy(() => import("../components/common/Footer.jsx"));
const ExploreMore = lazy(() =>
  import("../components/core/homeaccessories/ExploreMore.jsx")
);
const ReviewSlider = lazy(() =>
  import("../components/common/ReviewSlider.jsx")
);
const CodeBlock = lazy(() =>
  import("../components/core/homeaccessories/CodeBlock.jsx")
);
const TimeLineSection = lazy(() =>
  import("../components/core/homeaccessories/TimeLineSection.jsx")
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const features = [
  {
    icon: MdOutlineOndemandVideo,
    title: "Video & PDF lessons",
    desc: "A focused lecture player with speed control, quick skips and a built-in PDF reader.",
    className: "md:col-span-2",
  },
  {
    icon: MdOutlineReplay,
    title: "Pick up where you left off",
    desc: "Every video remembers exactly where you stopped watching.",
  },
  {
    icon: MdOutlineSearch,
    title: "Instant search",
    desc: "Press Ctrl K anywhere to find a course by name or tag.",
  },
  {
    icon: MdOutlineInsights,
    title: "Track your progress",
    desc: "Mark lectures complete and watch your course progress grow.",
  },
  {
    icon: MdOutlineVerifiedUser,
    title: "Secure checkout",
    desc: "Razorpay payments verified on the server before you are enrolled.",
  },
  {
    icon: MdOutlineRateReview,
    title: "Learner reviews",
    desc: "Rate courses and read honest feedback from other students.",
    className: "md:col-span-2",
  },
];

const SectionFallback = () => (
  <div className="grid py-20 place-items-center">
    <Spinner />
  </div>
);

const Home = () => {
  return (
    <>
      <Helmet>
        <title>LearnSphere - Learn Coding With Ease</title>
        <meta name="description" content="LearnSphere - an Edtech Platform" />
      </Helmet>

      <div className="fixed z-[200]">
        <BounceToTop />
      </div>

      <div className="relative overflow-hidden text-white bg-ink-950">
        {/* ---------------- Hero ---------------- */}
        <section className="relative pt-32 pb-20 md:pt-40">
          <div className="absolute inset-0 bg-grid" />
          <div className="aurora-blob -top-40 left-[calc(50%-360px)] h-[480px] w-[720px] bg-teal-500/20" />
          <div className="aurora-blob top-40 -left-40 h-[360px] w-[360px] bg-indigo-500/20 [animation-delay:-6s]" />
          <div className="aurora-blob top-20 -right-40 h-[360px] w-[360px] bg-cyan-500/15 [animation-delay:-12s]" />

          <div className="relative flex flex-col items-center w-11/12 mx-auto text-center max-w-maxContent">
            <motion.div {...fadeUp(0)}>
              <Link to="/signup" className="eyebrow hover:bg-teal-400/15">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                Now with resume-where-you-left-off
                <FaArrowRightLong className="text-[10px]" />
              </Link>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl"
            >
              Unlock your potential with{" "}
              <span className="text-gradient bg-[length:200%_auto] animate-shimmer">
                coding skills
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="max-w-2xl mt-6 text-base md:text-lg text-slate-400"
            >
              Study at your own pace, from anywhere. Learn from experienced
              instructors through hands-on video lessons, PDFs and projects,
              and track every step of your progress.
            </motion.p>

            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-col items-center gap-3 mt-10 sm:flex-row"
            >
              <CTAButton active={true} linkto={"/signup"}>
                Start learning free <FaArrowRightLong />
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                Become an instructor
              </CTAButton>
            </motion.div>

            <motion.div
              {...fadeUp(0.4)}
              className="flex flex-wrap items-center justify-center mt-8 text-sm gap-x-6 gap-y-2 text-slate-500"
            >
              {["Learn", "Teach", "Earn"].map((word) => (
                <span key={word} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-teal-400" />
                  {word}
                </span>
              ))}
            </motion.div>

            {/* Product preview */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl mt-16"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-teal-500/30 via-cyan-500/20 to-indigo-500/30 blur-2xl" />
              <div className="relative overflow-hidden border rounded-2xl border-white/10 bg-ink-800 shadow-2xl shadow-black/60">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                  <span className="w-3 h-3 rounded-full bg-rose-400/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
                  <span className="flex-1 mx-6 py-1 text-[11px] text-center rounded-md bg-white/5 text-slate-500">
                    learnsphere.app/view-course
                  </span>
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block object-cover w-full aspect-video"
                >
                  <source src={banner2Video} type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------------- Features bento ---------------- */}
        <section className="relative w-11/12 py-24 mx-auto max-w-maxContent">
          <motion.div {...inView()} className="text-center">
            <span className="eyebrow">Why LearnSphere</span>
            <h2 className="mt-4 section-title">
              Everything you need to <HighlightText text="learn faster" />
            </h2>
            <p className="mt-4 section-subtitle">
              A learning experience built around how you actually study.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 mt-14 md:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, className = "" }, i) => (
              <motion.div
                key={title}
                {...inView(i * 0.05)}
                className={`card card-hover p-6 ${className}`}
              >
                <div className="grid w-11 h-11 mb-5 text-xl rounded-xl place-items-center bg-gradient-to-br from-teal-400/20 to-indigo-400/20 text-teal-200 ring-1 ring-white/10">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold font-display text-slate-100">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- Code blocks ---------------- */}
        <section className="w-11/12 mx-auto max-w-maxContent">
          <Suspense fallback={<SectionFallback />}>
            <CodeBlock
              position={"lg:flex-row flex-col"}
              heading={
                <h2 className="section-title">
                  Empower your
                  <HighlightText text={"coding potential"} /> with our online
                  courses
                </h2>
              }
              subHeading={
                "Our instructors are seasoned professionals with years of coding expertise who are enthusiastic about imparting their knowledge to you through our courses."
              }
              ctaBtn1={{
                btnTxt: "Try it Yourself",
                linkto: "/signup",
                active: true,
              }}
              ctaBtn2={{
                btnTxt: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>LearnCoding</title> <link rel="stylesheet" href="style.css">\n<head/>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a><a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>`}
              codeColor={"text-teal-200"}
              glow={"from-teal-500/25 to-indigo-500/10"}
            />
            <CodeBlock
              position={"lg:flex-row-reverse flex-col"}
              heading={
                <h2 className="section-title">
                  Learn & start
                  <HighlightText text={"coding in seconds"} />
                </h2>
              }
              subHeading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctaBtn1={{
                btnTxt: "Continue Lesson",
                linkto: "/login",
                active: true,
              }}
              ctaBtn2={{
                btnTxt: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>CodeMaster</title> <link rel="stylesheet" href="main.css">\n<head/>\n<body>\n<h1><a href="/">Main Title</a></h1>\n<nav><a href="/first">First</a><a href="/second">Second</a>\n<a href="/third">Third</a>\n</nav>`}
              codeColor={"text-sky-200"}
              glow={"from-indigo-500/25 to-cyan-500/10"}
            />
          </Suspense>
        </section>

        {/* ---------------- Explore ---------------- */}
        <section className="w-11/12 py-24 mx-auto max-w-maxContent">
          <Suspense fallback={<SectionFallback />}>
            <ExploreMore />
          </Suspense>
        </section>

        {/* ---------------- Skills / timeline ---------------- */}
        <section className="relative py-24 border-y border-white/[0.06] bg-gradient-to-b from-ink-900 to-ink-950">
          <div className="w-11/12 mx-auto max-w-maxContent">
            <div className="grid items-end gap-6 md:grid-cols-2">
              <motion.h2 {...inView()} className="section-title">
                Get the skills you need for a{" "}
                <HighlightText text={"job that is in demand"} />
              </motion.h2>
              <motion.div {...inView(0.1)} className="flex flex-col items-start gap-5">
                <p className="text-slate-400">
                  Today, being a competitive specialist takes more than
                  professional skills. LearnSphere helps you build the
                  practical experience employers look for.
                </p>
                <CTAButton active={true} linkto={"/signup"}>
                  Learn More <FaArrowRightLong />
                </CTAButton>
              </motion.div>
            </div>

            <Suspense fallback={<SectionFallback />}>
              <TimeLineSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <LearningLanguageSection />
            </Suspense>
          </div>
        </section>

        {/* ---------------- Instructor + reviews ---------------- */}
        <section className="w-11/12 mx-auto max-w-maxContent">
          <Suspense fallback={<SectionFallback />}>
            <InstructorSection />
          </Suspense>

          <motion.div {...inView()} className="text-center">
            <span className="eyebrow">Testimonials</span>
            <h2 className="mt-4 section-title">
              Loved by <HighlightText text="learners" />
            </h2>
          </motion.div>
          <Suspense fallback={<SectionFallback />}>
            <ReviewSlider />
          </Suspense>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="w-11/12 pb-24 mx-auto max-w-maxContent">
          <motion.div
            {...inView()}
            className="relative px-6 py-16 overflow-hidden text-center border rounded-3xl border-white/10 md:px-16"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-ink-800 to-indigo-500/20" />
            <div className="absolute inset-0 bg-grid opacity-60" />
            <div className="relative">
              <h2 className="section-title">
                Ready to start learning?
              </h2>
              <p className="mt-4 section-subtitle">
                Join LearnSphere today and explore the full catalog of courses.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 mt-8 sm:flex-row">
                <CTAButton active={true} linkto={"/signup"}>
                  Explore Full Catalog <FaArrowRightLong />
                </CTAButton>
                <CTAButton active={false} linkto={"/about"}>
                  About us
                </CTAButton>
              </div>
            </div>
          </motion.div>
        </section>

        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
