import React, { useState } from "react";
import FacultySection from "../components/faculty/FacultySection";
import MemberSection from "../components/member/MemberSection";
import "../App.css";

const Members = ({ darkMode }) => {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pb-4 pt-5 dark:bg-gray-900 dark:text-white bg-white text-black">
      <div className="min-h-screen transition duration-500">
        <FacultySection darkMode={darkMode} />
        <MemberSection darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Members;
