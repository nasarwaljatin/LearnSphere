import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";
import { motion } from "framer-motion";

// `Width` is passed by grid layouts (card fills its cell); sliders get a fixed width.
const CourseCard = ({ course, Height, Width }) => {
  const [avgRatingCount, setAvgRatingCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgRatingCount(count);
  }, [course]);

  const price = course?.price ?? 0;

  return (
    <Link
      to={`/courses/${course._id}`}
      className={`group inline-block align-top whitespace-normal ${
        Width ? "w-full" : "w-[260px] md:w-[320px] mr-5"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden card card-hover"
      >
        <div className="relative overflow-hidden">
          <img
            src={course?.thumbnail}
            alt={course?.courseName}
            loading="lazy"
            className={`${
              Height || "h-[180px]"
            } w-full object-cover transition-transform duration-500 group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
          <span className="absolute px-3 py-1 text-xs font-semibold rounded-full top-3 right-3 bg-ink-950/70 backdrop-blur text-teal-200 ring-1 ring-white/10">
            {price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <h3 className="font-semibold leading-snug line-clamp-2 font-display text-slate-100 group-hover:text-teal-200 transition-colors">
            {course?.courseName}
          </h3>
          <p className="text-sm text-slate-400">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-amber-300">
              {Number(avgRatingCount || 0).toFixed(1)}
            </span>
            <RatingStars Review_Count={avgRatingCount} />
            <span className="text-xs text-slate-500">
              ({course?.ratingAndReviews?.length ?? 0})
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
