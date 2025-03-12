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
        <img className="h-6 w-6" src="./src/assets/logo.png" alt="Logo" />
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
