import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = ({ darkMode }) => {
    const navigate = useNavigate();

    let [studentId, setStudentId] = useState('');
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    function onSubmit(e) {
        e.preventDefault();
        const url = 'http://localhost:4600/api/auth/register';

        fetch(url, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ studentId, name, email, password })
        })
        .then((res) => {
            if (!res.ok) throw new Error("Response wasn't received properly");
            return res.json();
        })
        .then((data) => {
            console.log("Data has been stored", data);
            localStorage.setItem('authToken', data.token);
            navigate('/');
        })
        .catch((err) => {
            console.error("Error msg", err.message);
        });
    }

    return (
        <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-100'}`}>
            <div className={`p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-dark-text' : 'text-black'}`}>
                    Sign Up
                </h2>
                <form onSubmit={(e) => onSubmit(e)} action="POST">
                    <div className="mb-4">
                        <label htmlFor="studentId" className={`block font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                            Student Id:
                        </label>
                        <input
                            type="number"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            name="studentId"
                            placeholder="Enter student Id"
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'border-dark-border text-dark-input' : 'border-gray-300 text-black'}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className={`block font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                            Name:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name"
                            placeholder="Enter your name"
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'border-dark-border text-dark-input' : 'border-gray-300 text-black'}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className={`block font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                            Email:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            placeholder="john@example.com"
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'border-dark-border text-dark-input' : 'border-gray-300 text-black'}`}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className={`block font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                            Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Enter your password"
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'border-dark-border text-dark-input' : 'border-gray-300 text-black'}`}
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 transition-colors font-semibold">
                        Register
                    </button>
                    <p className={`mt-4 text-center ${darkMode ? 'text-dark-text' : 'text-gray-600'}`}>
                        Already registered? <Link to="/auth/login" className="text-indigo-500 hover:underline">Click Here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
