import React from "react";

const MainContent = ({ filteredMails, selectedMail, setSelectedMail }) => {
  return (
    <main className="w-full lg:w-4/5 p-6 bg-gray-50 dark:bg-gray-900">
      <section className="py-12 h-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
            {selectedMail ? "Mail Details" : "All Mails"}
          </h2>

          {selectedMail ? (
            <div className="mail-details space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              <button
                onClick={() => setSelectedMail(null)}
                className="mb-4 text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
              >
                &larr; Back to Mails
              </button>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedMail.subject}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>From:</strong> {selectedMail.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Date:</strong>{" "}
                {new Date(selectedMail.sentAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full ${
                    selectedMail.status === "unread"
                      ? "bg-red-100 text-red-600"
                      : selectedMail.status === "read"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {selectedMail.status}
                </span>
              </p>
              <div className="text-lg text-gray-800 dark:text-gray-200 mt-4">
                {selectedMail.message}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto h-96 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-left">
                    <th className="px-6 py-3 text-sm font-medium">Name</th>
                    <th className="px-6 py-3 text-sm font-medium">Email</th>
                    <th className="px-6 py-3 text-sm font-medium">Subject</th>
                    <th className="px-6 py-3 text-sm font-medium">Status</th>
                    <th className="px-6 py-3 text-sm font-medium">Sent At</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {filteredMails.map((mail) => (
                    <tr
                      key={mail._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                      onClick={() => setSelectedMail(mail)}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        {mail.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        {mail.email}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        {mail.subject}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            mail.status === "unread"
                              ? "bg-red-100 text-red-600"
                              : mail.status === "read"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {mail.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        {new Date(mail.sentAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MainContent;
