import React from "react";
import paymentMethodsSVG from "./assets/paymentMethods.svg";
import { useEffect, useState } from "react";
import { useURLID } from "./useURLID";
import axios from "axios";

const api = axios.create({
  baseURL: "https://hassala.qistar.rent/api/",
});

const BoxPage = () => {
  const { id } = useURLID();
  const [boxData, setBoxData] = useState("");
  const [isLoading, SetLoading] = useState(false);
  const [associationLogo, setassociationLogo] = useState("");

  useEffect(() => {
    const fetchDonationBoxData = async () => {
      SetLoading(true);
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
      } finally {
        SetLoading(false);
      }
      setassociationLogo(boxData.association.logo);
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
      {isLoading ? (
        <div className="loading">
          <div class="grid min-h-screen place-content-center">
            <div class="flex items-center gap-2 text-gray-500">
              <span class="h-6 w-6 block rounded-full border-4 border-t-blue-300 animate-spin"></span>
              loading...
            </div>
          </div>
        </div>
      ) : (
        <div className="max-sm:h-auto w-screen h-screen overflow-hidden">
          {/* <img
            src={`https://hassala.qistar.rent/storage/${boxData.image}`}
            alt="stockimage"
            className="absolute top-0 left-0 w-full h-full object-cover -z-20"
          /> */}
          <video
            src="https://cdn.pixabay.com/video/2020/03/13/33631-398856295_large.mp4"
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 object-cover w-screen h-screen -z-20"
          ></video>
          <div className="-z-10 absolute top-0 left-0 h-screen w-screen bg-gradient-to-t from-black/80 to-black/50"></div>
          <div className="w-full h-full grid grid-cols-2 max-sm:grid-cols-1 z-50 mx-auto justify-center items-center">
            <div className="px-20 flex flex-col  gap-8 ">
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
            <div className=" w-full flex flex-col gap-6 h-f justify-center items-center">
              <div className="text-center text-white ">
                <p className="text-2xl text-center mt-12 font-bold font-kufam">
                  للتبرع
                </p>
                <p>فقط إمسح ال QR Code</p>
              </div>
              <div className="bg-white my-auto w-2/3 h-auto rounded-2xl p-6 flex flex-col gap-6 justify-center items-center ">
                <div className="min-w-5/6 w-2/3 mx-auto">
                  <img
                    src={`https://hassala.qistar.rent/storage/${associationLogo}`}
                    alt="association logo"
                    className="w-full h-full object-fill max-h-20"
                  />
                </div>
                <div className="h-full w-full">
                  <div>
                    <img
                      src={boxData.qr_code}
                      alt="design"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="w-3/5">
                  <img src={paymentMethodsSVG} alt="payment methods logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoxPage;
