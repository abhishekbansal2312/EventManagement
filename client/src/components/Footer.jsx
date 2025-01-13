import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../provider/AuthProvider";

const Footer = () => {
  const { darkMode } = useAuth();
  return (
    <footer
      className={`p-16 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-white"
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        {/* Quick Links Section */}
        <div className="w-full md:w-auto mb-6 md:mb-0 text-center md:text-left">
          <h3
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-200"
            }`}
          >
            Quick Links
          </h3>
          <ul className="space-y-2 md:space-y-0 md:space-x-8 flex flex-col md:flex-row justify-center md:justify-start">
            <li>
              <a
                href="/contact"
                className={`hover:underline transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Contact Us
              </a>
            </li>

            <li>
              <a
                href="/reviews"
                className={`hover:underline transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Reviews
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="w-full md:w-auto text-center md:text-left">
          <h3
            className={`text-xl text-right font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-200"
            }`}
          >
            Follow Us
          </h3>
          <div className="flex justify-center md:justify-start space-x-6">
            <a
              href="https://facebook.com"
              className={`text-2xl transition-colors duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://twitter.com"
              className={`text-2xl transition-colors duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href="https://instagram.com"
              className={`text-2xl transition-colors duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 border-t border-gray-600 pt-4 text-center">
        <p className="text-sm md:text-base">
          &copy; 2024 College Activities. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
