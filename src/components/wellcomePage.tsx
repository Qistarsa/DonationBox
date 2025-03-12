import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const wellcomePage = () => {
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputID, setInputID] = useState("");

  //   const handleSetID = () => {
  //     if (inputID) {
  //       setSearchParams({ id: inputID });

  //     }
  //   };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputID) {
      setSearchParams({ id: inputID });
    }
    console.log(searchParams);

    if (!inputID.trim()) {
      setError("Please enter an ID");
      return;
    }

    // Redirect to home page with ID as parameter
    // router.push(`/?id=${id}`);
  };
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="flex  gap-2 items-center mb-8">
        <div className="h-6 w-6">
          <svg
            viewBox="0 0 236 236"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M94.9 10.8c-11.8 5.9-37.2 18.8-56.4 28.4C19.2 49 3 57.4 2.4 57.9 0 60.1 0 57.5 0 118.1s-.1 58 2.4 60.2c.6.6 26.3 13.7 57.1 29.3 53.8 27.1 56.1 28.3 58.5 28.3s4.7-1.1 58.5-28.3c30.8-15.6 56.5-28.7 57.1-29.3 2.4-2.2 2.4.4 2.4-60.2s.1-58-2.4-60.2c-.6-.6-26.3-13.7-57.1-29.2C133.2 6.9 120 .4 118.4.2c-2-.2-3.1.3-23.5 10.6M162 51.6c24.2 12.1 44 22.1 44 22.3s-19.8 10-44 22l-44 21.8-44-21.8c-24.2-12-44-21.9-44-22 0-.2 87.3-44.1 87.9-44.2.1-.1 19.9 9.8 44.1 21.9"
              fill="url(#a)"
            />
            <defs>
              <linearGradient
                id="a"
                x1="118"
                y1=".17"
                x2="119"
                y2="144.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#bada55" />
                <stop offset="1" stop-color="#bada55" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="ml-3 font-bold text-base">حصالة</span>
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-3xl font-bold">مرحبا بك</h1>
          <p className="text-gray-500 mt-1 ">أدخل المعرف الخاص بالحصالة</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              id="id"
              placeholder="Enter your ID (e.g., 08142ef3-b69e-4374-bf0a-7611daebfd8f)"
              value={inputID}
              onChange={(e) => {
                setInputID(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bada55] focus:border-transparent"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md font-medium transition-colors duration-200"
            // onClick={handleSetID}
            style={{ backgroundColor: "#bada55", color: "#000" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#a5c548")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#bada55")
            }
          >
            عرض الحصالة
          </button>
        </form>
      </div>
    </div>
  );
};

export default wellcomePage;
