import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import {
  BigPlayButton,
  ControlBar,
  ForwardControl,
  PlaybackRateMenuButton,
  Player,
  ReplayControl,
} from "video-react";
import "video-react/dist/video-react.css"; // Import CSS
import Spinner from "../../common/Spinner";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { apiConnector } from "../../../services/apiConnector";
import { ratingsEndpoints } from "../../../services/apis";
import CourseReviewsSlider from "./CourseReviewsSlider";
import { RiMenuFold2Line } from "react-icons/ri";
import { PiStudent } from "react-icons/pi";
import {
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdFullscreen,
  MdOpenInNew,
} from "react-icons/md";

// Watch position is saved per lecture so learners resume where they left off.
const POSITION_KEY = (subSectionId) => `ls:lecture-position:${subSectionId}`;
const PLAYBACK_RATE_KEY = "ls:playback-rate";
const SAVE_INTERVAL_SECONDS = 5;

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode) - resume is a convenience only */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

// Returns "video" or "pdf" and the URL the viewer should load.
const resolveMedia = (url = "") => {
  if (url.includes("drive.google.com")) {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return {
      type: "pdf",
      src: fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url,
      external: url,
    };
  }
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (extension === "pdf") {
    return { type: "pdf", src: url, external: url };
  }
  return { type: "video", src: url, external: url };
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const VideoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, completedLectures, totalNoOfLectures } =
    useSelector((state) => state.viewCourse);

  const { courseId, sectionId, subSectionId } = useParams();
  const playerRef = useRef(null);
  const pdfContainerRef = useRef(null);

  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumedFrom, setResumedFrom] = useState(0);
  const [reviews, setReviews] = useState([]);

  // Flat, ordered list of every lecture in the course for prev/next navigation
  const lectures = useMemo(
    () =>
      (courseSectionData ?? []).flatMap((section) =>
        (section.subSection ?? []).map((sub) => ({
          sectionId: section._id,
          subSectionId: sub._id,
          data: sub,
        }))
      ),
    [courseSectionData]
  );

  const currentIndex = lectures.findIndex(
    (lecture) =>
      lecture.sectionId === sectionId && lecture.subSectionId === subSectionId
  );
  const videoData = lectures[currentIndex]?.data;
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex >= 0 && currentIndex < lectures.length - 1
      ? lectures[currentIndex + 1]
      : null;
  const media = resolveMedia(videoData?.videoUrl);
  const isCompleted = completedLectures?.includes(subSectionId);
  const progressPercent = totalNoOfLectures
    ? Math.round(((completedLectures?.length ?? 0) / totalNoOfLectures) * 100)
    : 0;

  useEffect(() => {
    if (!courseId) return;
    apiConnector(
      "GET",
      ratingsEndpoints.SPECIFIC_COURSE_REVIEW_API.replace(":courseId", courseId)
    )
      .then((reviewData) =>
        setReviews(reviewData?.data?.courseRatings?.ratingAndReviews ?? [])
      )
      .catch(() => setReviews([]));
  }, [courseId]);

  useEffect(() => {
    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses");
    }
  }, [courseId, sectionId, subSectionId]);

  // Restore saved position / speed and keep saving progress while watching
  useEffect(() => {
    setVideoEnded(false);
    setResumedFrom(0);
    if (media.type !== "video" || !playerRef.current) return;

    const player = playerRef.current;
    let restored = false;
    let lastSaved = -1;

    const unsubscribe = player.subscribeToStateChange((state, prevState) => {
      if (!restored && state.duration > 0) {
        restored = true;
        const saved = Number(storage.get(POSITION_KEY(subSectionId)));
        if (saved > 5 && saved < state.duration - 5) {
          player.seek(saved);
          setResumedFrom(saved);
        }
        const rate = Number(storage.get(PLAYBACK_RATE_KEY));
        if (rate > 0) player.playbackRate = rate;
      }

      // Remember the speed only when the learner changes it
      if (prevState && state.playbackRate !== prevState.playbackRate) {
        storage.set(PLAYBACK_RATE_KEY, String(state.playbackRate));
      }

      const second = Math.floor(state.currentTime);
      if (
        restored &&
        !state.ended &&
        second > 0 &&
        second !== lastSaved &&
        second % SAVE_INTERVAL_SECONDS === 0
      ) {
        lastSaved = second;
        storage.set(POSITION_KEY(subSectionId), String(second));
      }

      if (state.ended) {
        storage.remove(POSITION_KEY(subSectionId));
        setVideoEnded(true);
      }
    });

    return () => unsubscribe?.();
  }, [subSectionId, media.type, media.src]);

  const goTo = (lecture) => {
    if (!lecture) return;
    navigate(
      `/view-course/${courseId}/section/${lecture.sectionId}/sub-section/${lecture.subSectionId}`
    );
  };

  // Shift+N / Shift+P jump between lectures
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || !e.shiftKey) return;
      if (e.key === "N") goTo(nextLecture);
      if (e.key === "P") goTo(prevLecture);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextLecture, prevLecture]);

  const handleLectureCompletion = async () => {
    if (isCompleted) return;
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  const openPdfFullscreen = () => {
    pdfContainerRef.current?.requestFullscreen?.();
  };

  if (!courseSectionData?.length) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="">
      {!videoData ? (
        <div className="py-20 text-center text-slate-400">
          This lecture is not available.
        </div>
      ) : (
        <div className="relative">
          {media.type === "video" ? (
            <Player
              key={subSectionId}
              ref={playerRef}
              aspectRatio="16:9"
              playsInline
              src={media.src}
              className="relative"
            >
              <BigPlayButton position="center" />
              <ControlBar autoHide>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={10} order={1.2} />
                <PlaybackRateMenuButton
                  rates={[2, 1.75, 1.5, 1.25, 1, 0.75, 0.5]}
                  order={7.1}
                />
              </ControlBar>
              {/* Render when video ends */}
              {videoEnded && (
                <div className="absolute bg-gradient-to-t from-slate-950 to-transparent backdrop-blur-sm inset-0 z-[100] flex flex-col gap-y-6 items-center justify-center font-inter">
                  {!isCompleted && (
                    <button
                      disabled={loading}
                      onClick={handleLectureCompletion}
                      className="px-4 py-2 text-lg font-semibold bg-teal-500 rounded-md text-slate-900 max-w-max hover:bg-cyan-500"
                    >
                      {!loading ? "Mark As Completed" : <Spinner />}
                    </button>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      disabled={loading}
                      onClick={() => {
                        if (playerRef?.current) {
                          playerRef.current.seek(0);
                          setVideoEnded(false);
                          playerRef.current.play();
                        }
                      }}
                      className="px-4 py-2 text-lg font-semibold rounded-md bg-slate-600 text-slate-200 max-w-max"
                    >
                      Rewatch
                    </button>
                    {nextLecture && (
                      <button
                        onClick={() => goTo(nextLecture)}
                        className="flex items-center px-4 py-2 text-lg font-semibold rounded-md bg-slate-200 text-slate-900 max-w-max hover:bg-white"
                      >
                        Next Lecture <MdChevronRight className="text-2xl" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Player>
          ) : (
            <div
              ref={pdfContainerRef}
              className="relative mx-auto h-[85vh] w-full max-w-5xl bg-slate-900"
            >
              <iframe
                key={subSectionId}
                src={media.src}
                className="w-full h-full border-none"
                title={videoData?.title || "PDF Viewer"}
              />
              <div className="absolute flex top-2 right-2 gap-x-2">
                <button
                  onClick={openPdfFullscreen}
                  title="Fullscreen"
                  className="p-2 text-2xl rounded-md bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                >
                  <MdFullscreen />
                </button>
                <a
                  href={media.external}
                  target="_blank"
                  rel="noreferrer"
                  title="Open in new tab"
                  className="p-2 text-2xl rounded-md bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                >
                  <MdOpenInNew />
                </a>
                <button
                  onClick={() => navigate("/contact")}
                  title="Need help?"
                  className="p-2 text-2xl rounded-md bg-slate-800/80 text-slate-400 hover:bg-slate-700"
                >
                  <FaHeadphonesSimple />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lecture toolbar: progress, completion and prev/next navigation */}
      <div className="flex flex-col gap-4 mt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-x-3 text-sm text-slate-400">
          <div className="w-40 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full transition-all duration-500 bg-teal-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>
            {progressPercent}% complete · Lecture {currentIndex + 1} of{" "}
            {lectures.length}
          </span>
          {resumedFrom > 0 && (
            <span className="hidden text-xs text-teal-400 lg:inline">
              Resumed at {formatTime(resumedFrom)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={!prevLecture}
            onClick={() => goTo(prevLecture)}
            title="Previous lecture (Shift+P)"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdChevronLeft className="text-xl" /> Prev
          </button>
          <button
            disabled={isCompleted || loading}
            onClick={handleLectureCompletion}
            className={`flex items-center gap-x-1 px-3 py-2 text-sm font-semibold rounded-md ${
              isCompleted
                ? "bg-emerald-900/60 text-emerald-300 cursor-default"
                : "bg-teal-500 text-slate-900 hover:bg-cyan-500"
            }`}
          >
            <MdCheckCircle className="text-lg" />
            {isCompleted ? "Completed" : loading ? "Saving..." : "Mark Complete"}
          </button>
          <button
            disabled={!nextLecture}
            onClick={() => goTo(nextLecture)}
            title="Next lecture (Shift+N)"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <MdChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      <div className="flex mt-10 mb-4 text-[#95a9d8] flex-row items-center justify-start gap-x-4">
        <RiMenuFold2Line className="size-8" />
        <h1 className="md:px-2 md:text-3xl sm:text-2xl text-xl font-semibold">
          {videoData?.title}
        </h1>
      </div>
      <div className="mt-2 mb-4 w-full bg-slate-600 h-px" />
      <p className="pt-2 pb-6 md:px-4 lg:px-10 text-sm font-medium md:text-base text-slate-500 ">
        {videoData?.description}
      </p>
      <div className="md:w-10/12 w-[95%] mx-auto md:mt-24 mt-16 mb-32">
        <div className="flex flex-row items-center justify-start gap-x-4">
          <PiStudent className="text-2xl text-[#6071a8]" />
          <h2 className="text-lg text-[#6071a8] sm:text-xl md:text-2xl">
            Students Reviews in this Course
          </h2>
        </div>
        <div className="mt-2 mb-12 w-full bg-slate-600 h-px" />
        <CourseReviewsSlider Reviews={reviews} Id={"CourseReview"} />
      </div>
    </div>
  );
};

export default VideoDetails;
