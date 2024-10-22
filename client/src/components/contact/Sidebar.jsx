import React from "react";
import { FaInbox, FaRegPaperPlane, FaFolder } from "react-icons/fa";

const Sidebar = ({ selectedStatus, setSelectedStatus, sortOrder, setSortOrder, handleSort }) => {
  return (
    <aside className="w-1/5 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Labels</h3>
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => setSelectedStatus("all")}
            className={`w-full flex items-center p-2 rounded ${
              selectedStatus === "all"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-gray-700 dark:text-white"
            }`}
          >
            <FaInbox className="mr-2" /> Inbox
          </button>
        </li>
        <li>
          <button
            onClick={() => setSelectedStatus("unread")}
            className={`w-full flex items-center p-2 rounded ${
              selectedStatus === "unread"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-gray-700 dark:text-white"
            }`}
          >
            <FaRegPaperPlane className="mr-2" /> Unread
          </button>
        </li>
        <li>
          <button
            onClick={() => setSelectedStatus("read")}
            className={`w-full flex items-center p-2 rounded ${
              selectedStatus === "read"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-gray-700 dark:text-white"
            }`}
          >
            <FaFolder className="mr-2" /> Read
          </button>
        </li>
        <li>
          <button
            onClick={() => setSelectedStatus("replied")}
            className={`w-full flex items-center p-2 rounded ${
              selectedStatus === "replied"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-gray-700 dark:text-white"
            }`}
          >
            <FaRegPaperPlane className="mr-2" /> Replied
          </button>
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-4 dark:text-white">Sort by Date</h3>
      <button
        onClick={() => {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          handleSort();
        }}
        className="w-full text-left p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
      >
        Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
      </button>
    </aside>
  );
};

export default Sidebar;
