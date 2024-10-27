import React, { useEffect, useState } from "react";
import { FaInbox, FaRegPaperPlane, FaFolder, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion"; // Importing Framer Motion for animations

const AllMails = () => {
  const [mails, setMails] = useState([]);
  const [filteredMails, setFilteredMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMail, setSelectedMail] = useState(null);

  // Fetching mails
  useEffect(() => {
    const fetchMails = async () => {
      try {
        const response = await fetch(
          "https://eventmanagement-b7vf.onrender.com/api/contact"
        );
        const data = await response.json();
        setMails(data);
        setFilteredMails(data);
      } catch (err) {
        setError("Failed to fetch mails.");
      } finally {
        setLoading(false);
      }
    };
    fetchMails();
  }, []);

  // Filtering mails based on status
  useEffect(() => {
    const filtered = mails.filter((mail) =>
      selectedStatus === "all" ? true : mail.status === selectedStatus
    );
    setFilteredMails(filtered);
  }, [selectedStatus, mails]);

  // Sorting mails by sent date
  const handleSort = () => {
    const sortedMails = [...filteredMails].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.sentAt) - new Date(b.sentAt)
        : new Date(b.sentAt) - new Date(a.sentAt);
    });
    setFilteredMails(sortedMails);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white dark:bg-gray-800 p-6 flex flex-col shadow-lg border-r border-gray-200">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Labels</h3>
        <ul className="space-y-2">
          {["all", "unread", "read", "replied"].map((status) => (
            <li key={status}>
              <button
                onClick={() => setSelectedStatus(status)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-300 ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-transparent text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {status === "all" && <FaInbox className="mr-2" />}
                {status === "unread" && <FaRegPaperPlane className="mr-2" />}
                {status === "read" && <FaFolder className="mr-2" />}
                {status === "replied" && <FaRegStar className="mr-2" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Sort */}
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          Sort by Date
        </h3>
        <button
          onClick={() => {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            handleSort();
          }}
          className="w-full text-left p-3 rounded-lg bg-transparent text-gray-800 dark:text-gray-300 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </aside>

      {/* Main content */}
      <main className="w-3/4 p-0 overflow-hidden">
        {" "}
        {/* Set padding to 0 */}
        <section className="py-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full border border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {selectedMail ? "Mail Details" : "All Mails"}
            </h2>

            {selectedMail ? (
              <motion.div
                className="mail-details p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <button
                  onClick={() => setSelectedMail(null)}
                  className="mb-4 text-blue-500 underline transition duration-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Back to Mails
                </button>
                <h3 className="text-2xl font-semibold mb-2 dark:text-white">
                  {selectedMail.subject}
                </h3>
                <p className="mb-2 dark:text-gray-300">
                  <strong>From:</strong> {selectedMail.email}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMail.sentAt).toLocaleString()}
                </p>
                <p className="mb-4 dark:text-gray-300">
                  <strong>Status:</strong> {selectedMail.status}
                </p>
                <p className="dark:text-gray-200">{selectedMail.message}</p>
              </motion.div>
            ) : (
              <div className="overflow-y-auto h-96">
                <motion.table
                  className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="px-4 py-3 text-left dark:text-gray-300">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left dark:text-gray-300">
                        From
                      </th>
                      <th className="px-4 py-3 text-left dark:text-gray-300">
                        Sent At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMails.map((mail) => (
                      <motion.tr
                        key={mail._id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedMail(mail)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="border px-4 py-3 dark:border-gray-600">
                          {mail.subject}
                        </td>
                        <td className="border px-4 py-3 dark:border-gray-600">
                          {mail.email}
                        </td>
                        <td className="border px-4 py-3 dark:border-gray-600">
                          {new Date(mail.sentAt).toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AllMails;
