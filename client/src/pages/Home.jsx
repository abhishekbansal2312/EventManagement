import React from 'react';
import "../App.css";

const Home = ({ darkMode }) => {
    const images = [
        {
            src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
            alt: "Drink 1"
        },
        {
            src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
            alt: "Drink 2"
        },
        {
            src: "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
            alt: "Drink 3"
        },
        {
            src: "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
            alt: "Drink 4"
        },
        {
            src: "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
            alt: "Drink 5"
        },
        {
            src: "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp",
            alt: "Drink 6"
        },
        {
            src: "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp",
            alt: "Drink 7"
        },
    ];

    return (
        <div>
            {/* Carousel */}
            <div className={`overflow-x-auto ${darkMode ? 'dark' : ''}`}>
                <div className="flex space-x-4 scrollbar-hidden">
                    {images.map((image, index) => (
                        <div className="flex-none w-64 snap-start" key={index}>
                            <img 
                                src={image.src} 
                                alt={image.alt} 
                                className="w-full h-auto object-cover rounded-lg" 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gray-100 dark:bg-gray-800 p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to Hobbies Club
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    We help you plan and execute unforgettable events tailored to your needs. 
                    From Games to corporate gatherings, we've got you covered!We help you plan and execute unforgettable events tailored to your needs. 
                    From Games to corporate gatherings, we've got you covered!
                </p>
            </div>
        </div>
    );
};

export default Home;
