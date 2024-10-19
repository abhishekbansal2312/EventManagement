import React from "react";

const Radio = ({ options, selectedValue, handleChange }) => {
  return (
    <div className="radio-inputs bg-gray-200 dark:bg-gray-700 p-1 rounded-md shadow-sm flex text-[12px]">
      {options.map((option, index) => (
        <label key={index} className="radio flex-1 text-center">
          <input
            type="radio"
            name="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => handleChange(option.value)}
            className="hidden"
          />
          <span
            className={`name block py-1 px-2 rounded-sm cursor-pointer text-nowrap transition-colors ease-in-out duration-500 
            ${
              selectedValue === option.value
                ? "bg-white dark:bg-gray-900 font-semibold"
                : ""
            }
            text-gray-800 dark:text-gray-200`}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default Radio;
