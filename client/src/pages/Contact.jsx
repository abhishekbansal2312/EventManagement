import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios"; // Adjust the import path as needed

const Contact = () => {
  const [formData, setFormData] = useState({
    message: "",
    subject: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const makeRequest = useAxios(); // Use makeRequest from useAxios
  const { user } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { message, subject } = formData;

    if (!message || !subject) {
      setError("Both message and subject are required.");
      return;
    }

    setError("");

    try {
      const data = await makeRequest(
        "http://localhost:4600/api/contact",
        "POST",
        { message, subject },
        true
      );

      setSuccessMessage(data.message || "Message sent successfully!");
      setFormData({ message: "", subject: "" });
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {user?.role === "admin" && (
            <Link to="/contact/allmails">
              <button className="mb-4 text-white bg-indigo-600 px-4 py-2 rounded-md shadow hover:bg-indigo-800 transition">
                Go to Mails
              </button>
            </Link>
          )}

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-16 lg:gap-x-24">
            <div className="flex items-center lg:mb-0 mb-10 px-4 sm:px-0">
              <div className="w-full">
                <h4 className="text-indigo-600 text-base font-medium leading-6 mb-4 lg:text-left text-center dark:text-indigo-400">
                  Contact Us
                </h4>
                <h2 className="text-gray-900 font-manrope text-3xl sm:text-4xl font-semibold leading-10 mb-6 lg:text-left text-center dark:text-white">
                  Reach Out To Us
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-14 shadow-sm text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none py-2 px-4 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
                    placeholder="Subject"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full h-40 sm:h-48 shadow-sm resize-none text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-2xl border border-gray-200 focus:outline-none px-4 py-4 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
                    placeholder="Message"
                  />
                  <button
                    type="submit"
                    className="w-full h-12 text-center text-white text-base font-semibold leading-6 rounded-full bg-indigo-600 shadow transition-all duration-700 hover:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {successMessage && (
                  <p className="text-green-500 mt-4">{successMessage}</p>
                )}
              </div>
            </div>
            <div className="w-full lg:max-w-xl h-auto flex items-center justify-center bg-cover bg-no-repeat bg-[url('https://pagedone.io/asset/uploads/1696245837.png')] p-4 sm:p-0">
              <div className="w-full">
                <div className="w-full h-auto bg-white shadow-xl p-4 sm:p-6 dark:bg-gray-800">
                  <a
                    href="tel:470-601-1911"
                    className="flex items-center mb-4 sm:mb-6"
                  >
                    <h5 className="text-black text-sm sm:text-base font-normal leading-6 ml-4 dark:text-gray-300">
                      470-601-1911
                    </h5>
                  </a>
                  <a
                    href="mailto:Pagedone1234@gmail.com"
                    className="flex items-center mb-4 sm:mb-6"
                  >
                    <h5 className="text-black text-sm sm:text-base font-normal leading-6 ml-4 dark:text-gray-300">
                      Pagedone1234@gmail.com
                    </h5>
                  </a>
                  <a href="#" className="flex items-center mb-4 sm:mb-6">
                    <h5 className="text-black text-sm sm:text-base font-normal leading-6 ml-4 dark:text-gray-300">
                      789 Greenhill Way, Atlanta, GA 30339
                    </h5>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
