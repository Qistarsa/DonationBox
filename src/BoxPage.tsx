import React from "react";
// import { useState } from "react";
import mobileMockup from "./assets/mobileMockup.png";
import { useURLID } from "./useURLID";
import axios from "axios";

const api = axios.create({
  baseURL: "https://hassala.qistar.rent/api/",
});

import { useEffect, useState } from "react";

const BoxPage = () => {
  const { id } = useURLID();
  const [boxData, setBoxData] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchDonationBoxData = async () => {
      try {
        const response = await api.get(`hassala/${id}`);
        // console.log(response.data.data);
        setBoxData(response.data.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(err.message);
        }
      }
    };
    fetchDonationBoxData();
  }, [id]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function percentage(partial, total) {
    return `${(100 * partial) / total}%`;
  }
  return (
    <>
      <div className="relative container w-screen h-screen overflow-hidden ">
        <img
          src={`https://hassala.qistar.rent/storage/${boxData.image}`}
          alt="stockimage"
          className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        />
        <div className="-z-10 absolute top-0 left-0 h-full w-full bg-gradient-to-t from-gray-900 to-gray-50/5"></div>
        <div className="w-full h-full grid grid-cols-12 gricol z-50 mx-auto">
          <div className="py-[20%] px-20 flex flex-col col-start-2 col-span-5 gap-8">
            <h1 className="text-6xl font-kufam font-black text-white text-right leading-tight">
              {boxData.hero_title}
            </h1>
            {/* <progress
              dir="rtl"
              max="100"
              min="0"
              value="65"
              className="animate-pulse"
            ></progress>  */}
            <div className="relative mb-5">
              <div className="rounded-full border border-4 border-white p-1">
                <div
                  className={`flex h-16 items-center justify-end rounded-full animate-pulse duration-300 bg-gradient-to-l from-lime-500 to-lime-400 leading-none 
                     min-w-[20%]`}
                  style={{
                    width: `${percentage(
                      Math.round(boxData.donations_sum_amount),
                      Math.round(boxData.target)
                    )}`,
                  }}
                >
                  <span className="p-1 ml-2 text-white font-bold">
                    {percentage(
                      Math.round(boxData.donations_sum_amount),
                      Math.round(boxData.target)
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-white font-kufam">
              إجمالي التبرعات {boxData.donations_sum_amount}
            </div>
            <div className="flex justify-between font-kufam">
              <div className="flex flex-col gap-4">
                <p className="bg-white text-green-500 px-2">المبغ المتبقي</p>
                <p className="text-3xl font-bold text-white">
                  {boxData.donations_sum_amount
                    ? numberWithCommas(
                        Math.round(
                          boxData.target - boxData.donations_sum_amount
                        )
                      )
                    : numberWithCommas(Math.round(boxData.target))}{" "}
                  <span className="text-sm text-white">ر.س</span>
                </p>
              </div>
              <div className="flex flex-col gap-4 text-white items-start px-2">
                <p className="bg-white text-green-500 px-2">المبغ المستهدف</p>
                <p className="text-3xl font-bold text-left">
                  {numberWithCommas(Math.round(boxData.target))}
                  <span className="text-sm mr-2">ر.س</span>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-full flex justify-center col-span-5">
            <div className="bg-gray-500/30 backdrop-blur-md h-5/6 my-auto w-2/3 rounded-full rounded-b-none border border-gray-500/60 relative">
              <div className="text-center text-white">
                <p className="text-2xl text-center mt-12 font-bold font-kufam">
                  للتبرع
                </p>
                <p>فقط إمسح ال QR Code</p>
              </div>
              <div className="relative h-full w-full">
                <div className="absolute w-40 h-40 z-50 top-[20%] left-[33%]">
                  <img
                    src={boxData.qr_code}
                    alt="design"
                    className="w-full h-full pl-3"
                  />
                </div>
                <div className="imageContainer absolute -bottom-4 -left-20 w-[544px] h-[694px]">
                  <img
                    src={mobileMockup}
                    className="w-full h-full object-contain"
                    alt="mobile mockup"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoxPage;
