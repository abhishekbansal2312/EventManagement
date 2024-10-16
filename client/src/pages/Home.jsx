import React from "react";
import "../App.css";
import Marquee from "react-marquee-slider";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaGamepad, FaCalendarAlt, FaTrophy } from "react-icons/fa"; // Importing icons
import Card from "./Card"; // Import the Card component

const Home = ({ darkMode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const images = [
    {
      src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
      alt: "Drink 1",
    },
    {
      src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      alt: "Drink 2",
    },
    {
      src: "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
      alt: "Drink 3",
    },
    {
      src: "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
      alt: "Drink 4",
    },
    {
      src: "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
      alt: "Drink 5",
    },
    {
      src: "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp",
      alt: "Drink 6",
    },
    {
      src: "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp",
      alt: "Drink 7",
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      feedback: "Amazing event planning, everything was perfect!",
    },
    { name: "Jane Smith", feedback: "The team exceeded our expectations!" },
    { name: "Emily Brown", feedback: "Highly recommend their services!" },
  ];

  return (
    <div className={`bg-white ${darkMode ? "dark" : ""} font-sans`}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-16 text-center shadow-lg">
        <h1 className="text-6xl font-extrabold mb-4">Hobbies Club</h1>
        <p className="text-xl mx-auto mb-2 max-w-3xl">
          We plan and organize exciting events tailored for our college's needs.
        </p>
        <p className="text-md max-w-2xl mx-auto mb-8">
          Join us for thrilling games, events, and competitions. Experience the fun!
        </p>
        <button
          className="bg-white text-indigo-600 py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          onClick={() => {
            isAuthenticated ? navigate("/events") : navigate("/login");
          }}
        >
          {isAuthenticated ? "Explore Events" : "Get Started"}
        </button>
      </div>

      {/* Services Section */}
      <div className="p-16 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:shadow-lg flex flex-col items-center">
            <FaGamepad className="text-5xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-4">Exciting Games</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Engaging and mind-refreshing games and fun activities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:shadow-lg flex flex-col items-center">
            <FaCalendarAlt className="text-5xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-4">Events</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Monthly events and gatherings for students and fun lovers.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:shadow-lg flex flex-col items-center">
            <FaTrophy className="text-5xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-4">Competitions</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Competitions related to various areas from dance to singing.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-indigo-50 text-indigo-900 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 p-8 rounded-lg shadow-md transition-colors duration-300"
            >
              <p className="italic mb-4 text-gray-600 dark:text-gray-300">
                "{testimonial.feedback}"
              </p>
              <h4 className="font-bold text-indigo-900 dark:text-indigo-400">
                {testimonial.name}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Image Carousel */}
      <div
        className={`py-16 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Previous Events
        </h2>
        <div className="px-4">
          <Marquee
            velocity={20}
            minScale={0.7}
            resetAfterTries={200}
            className="py-16"
          >
            {images.map((image, index) => (
              <div key={index} className="px-2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Card Section */}
      <div className="flex justify-center my-16">
        <Card />
      </div>

      {/* Call to Action Section */}
      <div className="p-16 bg-gray-800 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join Us Now!</h2>
        <p className="mb-6">
          Don't miss out on our upcoming events and activities! Sign up today to be part of our vibrant community.
        </p>
        <button
          className="bg-indigo-600 py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
          onClick={() => {
            isAuthenticated ? navigate("/events") : navigate("/login");
          }}
        >
          {isAuthenticated ? "View Events" : "Sign Up Now"}
        </button>
      </div>
    </div>
  );
};

export default Home;
