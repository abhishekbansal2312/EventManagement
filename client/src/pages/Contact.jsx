import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Corrected to default import
import { Link } from "react-router-dom";

const Contact = () => {
    const [formData, setFormData] = useState({
        message: "",
        subject: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

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

        // Validate the input
        if (!message || !subject) {
            setError("Both message and subject are required.");
            return;
        }

        setError(""); // Clear any previous error message

        try {
            const response = await fetch("http://localhost:4600/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include credentials (cookies, authorization headers)
                body: JSON.stringify({ message, subject }), // Structure the request body
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || "Message sent successfully!"); // Handle success response
                setFormData({ message: "", subject: "" }); // Reset form fields
            } else {
                setError(data.message || "An error occurred. Please try again."); // Handle error response
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const checkUserRole = () => {
            const token = Cookies.get("authtoken");
            if (token) {
                const decodedToken = jwtDecode(token);
                setIsAdmin(decodedToken.role === "admin");
            }
        };
        checkUserRole();
    }, []);

    return (
        <>
            <section className="py-8 bg-white dark:bg-gray-900">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdmin && (
                        <Link to="/contact/allmails"> {/* Corrected path */}
                            <button className="mb-4 text-white bg-indigo-600 px-4 py-2 rounded-md shadow">
                                Go to Mails
                            </button>
                        </Link>
                    )}
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-24">
                        <div className="flex items-center lg:mb-0 mb-10">
                            <div>
                                <h4 className="text-indigo-600 text-base font-medium leading-6 mb-4 lg:text-left text-center dark:text-indigo-400">
                                    Contact Us
                                </h4>
                                <h2 className="text-gray-900 font-manrope text-4xl font-semibold leading-10 mb-9 lg:text-left text-center dark:text-white">
                                    Reach Out To Us
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full h-14 shadow-sm text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none py-2 px-4 mb-8 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
                                        placeholder="Subject"
                                    />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full h-48 shadow-sm resize-none text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-2xl border border-gray-200 focus:outline-none px-4 py-4 mb-8 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
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
                                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                            </div>
                        </div>
                        <div className="lg:max-w-xl w-full h-[600px] flex items-center justify-center bg-cover bg-no-repeat bg-[url('https://pagedone.io/asset/uploads/1696245837.png')]">
                            <div>
                                <div className="lg:w-96 w-auto h-auto bg-white shadow-xl lg:p-6 p-4 dark:bg-gray-800">
                                    <a href="tel:470-601-1911" className="flex items-center mb-6">
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                            {/* SVG Path here */}
                                        </svg>
                                        <h5 className="text-black text-base font-normal leading-6 ml-5 dark:text-gray-300">
                                            470-601-1911
                                        </h5>
                                    </a>
                                    <a href="mailto:Pagedone1234@gmail.com" className="flex items-center mb-6">
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                            {/* SVG Path here */}
                                        </svg>
                                        <h5 className="text-black text-base font-normal leading-6 ml-5 dark:text-gray-300">
                                            Pagedone1234@gmail.com
                                        </h5>
                                    </a>
                                    <a href="#" className="flex items-center mb-6">
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                            {/* SVG Path here */}
                                        </svg>
                                        <h5 className="text-black text-base font-normal leading-6 ml-5 dark:text-gray-300">
                                            789 Oak Lane, Lakeside, TX 54321
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
