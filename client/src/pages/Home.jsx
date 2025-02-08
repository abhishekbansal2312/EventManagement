import React, { useEffect, useState } from "react";
import "../App.css";
import Marquee from "react-marquee-slider";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaGamepad, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import Card from "./Card";
import useAxios from "../utils/useAxios"; // Import useAxios

const Home = ({ darkMode }) => {
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const makeRequest = useAxios(); // Initialize useAxios

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await makeRequest(
          "http://localhost:4600/api/events",
          "GET",
          null,
          true
        );
        const sortedEvents = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents([...sortedEvents, ...sortedEvents]); // Duplicate for marquee effect
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await makeRequest(
          "http://localhost:4600/api/reviews",
          "GET",
          null,
          true
        );
        const filteredReviews = data.filter(
          (review) => review.rating === 5 || review.rating === 4
        );
        setReviews(filteredReviews.slice(0, 3)); // Limit to first 3 reviews
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className={`bg-white ${darkMode ? "dark" : ""} font-sans`}>
      {/* Hero Section */}
      <div
        className={`relative bg-gradient-to-b ${
          darkMode
            ? "from-gray-400 via-gray-500 to-gray-600 text-white"
            : "from-purple-600 to-blue-600 text-white"
        } p-8 md:p-16 text-center shadow-lg`}
      >
        <h1 className="text-4xl md:text-6xl lg:text-9xl font-normal mb-4 bg-gradient-to-t to-blue-100 from-white bg-clip-text text-transparent">
          HOBBIES CLUB
        </h1>
        <p className="text-lg md:text-2xl mx-auto mb-2 text-gray-200">
          We plan and organize exciting events tailored for our college's needs.
        </p>
        <p className="text-sm md:text-md max-w-2xl mx-auto mb-8 text-gray-300">
          Join us for thrilling games, events, and competitions. Experience the
          fun!
        </p>
        <button
          className={`py-2 md:py-3 px-6 md:px-10 rounded-full shadow-lg transition duration-300 ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-indigo-600 hover:bg-gray-100"
          }`}
          onClick={() =>
            isAuthenticated ? navigate("/events") : navigate("/login")
          }
        >
          {isAuthenticated ? "Explore Events" : "Get Started"}
        </button>
      </div>

      {/* Services Section */}
      <div className="p-8 md:p-16 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <h2 className="text-xl md:text-2xl dark:text-gray-400 font-normal text-center mb-12">
          WHAT WE OFFER
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaGamepad />,
              title: "Exciting Games",
              desc: "Engaging and mind-refreshing games and fun activities.",
            },
            {
              icon: <FaCalendarAlt />,
              title: "Events",
              desc: "Monthly events and gatherings for students and fun lovers.",
            },
            {
              icon: <FaTrophy />,
              title: "Competitions",
              desc: "Competitions related to various areas from dance to singing.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:shadow-lg flex flex-col items-center justify-center relative"
            >
              <div className="p-2 border rounded-full flex justify-center items-center w-16 h-16 md:w-20 md:h-20 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-150%] bg-indigo-600">
                {service.icon}
              </div>
              <h3 className="text-md md:text-lg font-normal uppercase pt-8">
                {service.title}
              </h3>
              <p className="text-[12px] md:text-[14px] text-slate-500 dark:text-gray-300 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Carousel */}
      <div
        className={`py-8 md:py-16 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-xl md:text-2xl dark:text-gray-400 font-normal text-center mb-12 uppercase">
          Our Previous Events
        </h2>
        <div className="flex overflow-hidden">
          <Marquee velocity={40} minScale={1} resetAfterTries={200}>
            {events.map((image, index) => (
              <div key={index} className="px-2">
                <div className="w-32 h-48 md:w-48 md:h-auto bg-gray-200 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={image.offlinePoster}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-16">
        <h2 className="text-xl md:text-2xl font-normal text-center mb-12 dark:text-gray-400">
          What Our Members Say
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-400">
              No reviews available
            </div>
          ) : (
            reviews.map((review, index) => (
              <Card key={index} review={review} darkMode={darkMode} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
