import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";
import CourseCard from "../components/core/Catalog/CourseCard";
import { toast } from "sonner";
import { motion } from "framer-motion";
import BounceToTop from "../components/common/BounceToTop";
import { FaStar } from "react-icons/fa";
import CatalogShimmer from "../components/common/CatalogShimmer";

const Catalog = () => {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [initialCourses, setInitialCourses] = useState([]);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  useEffect(() => {
    const getAllCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const categoryData = res?.data?.categoryDetails?.categories;
      const category_id = categoryData?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]?._id;
      setCategoryId(category_id);
    };
    getAllCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      setLoading(true);
      try {
        const res = await getCatalogPageData(categoryId);

        setCatalogPageData(res);
        if (!initialCourses.length) {
          setInitialCourses(res?.data?.selectedCategory?.courses || []);
        }
      } catch (error) {
        toast.error("Error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  const handleActiveChange = (option) => {
    if (option === 2) {
      const sortedCourses = [
        ...catalogPageData.data.selectedCategory.courses,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCatalogPageData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          selectedCategory: {
            ...prevData.data.selectedCategory,
            courses: sortedCourses,
          },
        },
      }));
    } else if (option === 1) {
      setCatalogPageData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          selectedCategory: {
            ...prevData.data.selectedCategory,
            courses: initialCourses,
          },
        },
      }));
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="w-full grid h-[70vh] place-items-center">
        <CatalogShimmer />
      </div>
    );
  }

  const selectedCategory = catalogPageData?.data?.selectedCategory;
  const tabs = [
    { id: 1, label: "Most Popular" },
    { id: 2, label: "Latest" },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen text-white mt-14 bg-ink-950">
        <div className="fixed z-[200]">
          <BounceToTop />
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-grid" />
          <div className="aurora-blob -top-32 right-0 h-[320px] w-[520px] bg-teal-500/15" />
          <div className="aurora-blob -bottom-40 -left-20 h-[300px] w-[400px] bg-indigo-500/15 [animation-delay:-8s]" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col justify-center w-11/12 gap-4 py-16 mx-auto max-w-maxContent md:py-20"
          >
            <nav className="flex items-center gap-2 text-xs text-slate-500 md:text-sm">
              <span>Home</span>
              <span>/</span>
              <span>Catalog</span>
              <span>/</span>
              <span className="text-teal-300">{selectedCategory?.name}</span>
            </nav>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {selectedCategory?.name}
            </h1>
            <p className="max-w-3xl text-base md:text-lg text-slate-400">
              {selectedCategory?.description}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-slate-400">
              <span className="px-3 py-1 rounded-full glass">
                {selectedCategory?.courses?.length ?? 0} courses
              </span>
            </div>
          </motion.div>
        </section>

        {/* Section: 1 */}
        <section className="w-11/12 py-16 mx-auto max-w-maxContent">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-2xl font-bold tracking-tight font-display md:text-3xl">
              Courses to get you started
            </h2>
            <div className="flex gap-1 p-1 rounded-full w-fit glass">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActive(tab.id);
                    handleActiveChange(tab.id);
                  }}
                  className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                    active === tab.id
                      ? "bg-white text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <CourseSlider Id={"slider1"} Courses={selectedCategory?.courses} />
          </div>
        </section>

        {/* Section: 2 */}
        <section className="w-11/12 py-16 mx-auto max-w-maxContent">
          <h2 className="text-2xl font-bold tracking-tight font-display md:text-3xl">
            Top courses in{" "}
            <span className="text-gradient">
              {catalogPageData?.data?.differentCategory?.name}
            </span>
          </h2>
          <div className="mt-16">
            <CourseSlider
              Id={"slider2"}
              Courses={catalogPageData?.data?.differentCategory?.courses}
            />
          </div>
        </section>

        {/* Section: 3 */}
        <section className="w-11/12 py-16 mx-auto max-w-maxContent">
          <h2 className="text-2xl font-bold tracking-tight font-display md:text-3xl">
            Frequently bought
          </h2>
          <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <CourseCard
                  course={course}
                  Width={"w-full"}
                  key={i}
                  Height={"h-[180px]"}
                />
              ))}
          </div>
        </section>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Catalog;
