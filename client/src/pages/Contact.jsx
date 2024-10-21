const Contact = () => {
    return (
      <>
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-24">
              <div className="flex items-center lg:mb-0 mb-10">
                <div>
                  <h4 className="text-indigo-600 text-base font-medium leading-6 mb-4 lg:text-left text-center dark:text-indigo-400">
                    Contact Us
                  </h4>
                  <h2 className="text-gray-900 font-manrope text-4xl font-semibold leading-10 mb-9 lg:text-left text-center dark:text-white">
                    Reach Out To Us
                  </h2>
                  <form action="">
                    <input
                      type="text"
                      className="w-full h-14 shadow-sm text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none py-2 px-4 mb-8 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      className="w-full h-14 shadow-sm text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none py-2 px-4 mb-8 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
                      placeholder="Email"
                    />
                    <textarea
                      name=""
                      id="text"
                      className="w-full h-48 shadow-sm resize-none text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-2xl border border-gray-200 focus:outline-none px-4 py-4 mb-8 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500"
                      placeholder="Message"
                    />
                    <button className="w-full h-12 text-center text-white text-base font-semibold leading-6 rounded-full bg-indigo-600 shadow transition-all duration-700 hover:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-700">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
              <div className="lg:max-w-xl w-full h-[600px] flex items-center justify-center bg-cover bg-no-repeat bg-[url('https://pagedone.io/asset/uploads/1696245837.png')]">
                <div>
                  <div className="lg:w-96 w-auto h-auto bg-white shadow-xl lg:p-6 p-4 dark:bg-gray-800">
                    <a href="javascript:;" className="flex items-center mb-6">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        {/* SVG Path here */}
                      </svg>
                      <h5 className="text-black text-base font-normal leading-6 ml-5 dark:text-gray-300">
                        470-601-1911
                      </h5>
                    </a>
                    <a href="javascript:;" className="flex items-center mb-6">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        {/* SVG Path here */}
                      </svg>
                      <h5 className="text-black text-base font-normal leading-6 ml-5 dark:text-gray-300">
                        Pagedone1234@gmail.com
                      </h5>
                    </a>
                    <a href="javascript:;" className="flex items-center mb-6">
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
  