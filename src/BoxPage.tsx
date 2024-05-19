import paymentMethodsSVG from "./assets/paymentMethods.svg";
import { useEffect, useState } from "react";
import ProgressBar from "./components/progressBar";
import { useURLID } from "./useURLID";
import axios from "axios";

const domainURL = "https://hassala.qistar.rent";
const mediaURl = `${domainURL}/storage/`;
const api = axios.create({
  baseURL: `${domainURL}/api/`,
});

type BoxData = {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  serial_no: string;
  association_id: number;
  status_id: number;
  target: number;
  image: string;
  hero_title: string;
  sub_title: string;
  qr_code: string;
  created_at: string;
  updated_at: string;
  media_type: string;
  share_text: string;
  quran: string;
  donations_sum_amount: number;
};

const BoxPage = () => {
  const { id } = useURLID();
  const [boxData, setBoxData] = useState<BoxData>({});
  const [isLoading, SetLoading] = useState(false);
  const [isImage, setImage] = useState(false);
  const [associationLogo, setassociationLogo] = useState(null);

  useEffect(() => {
    const fetchDonationBoxData = async () => {
      SetLoading(true);
      try {
        const response = await api.get(`hassala/${id}`);
        // console.log(response.data.data);
        setBoxData(response.data.data);
        setassociationLogo(response.data.data.association.logo);
        setImage(false);
      } catch (err: any) {
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
    };
    fetchDonationBoxData();
  }, [id]);

  // const donationCalcualions = () => {
  //   if()
  // }
  function numberWithCommas(x: number) {
    let num = Math.round(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function percentage(partial: number, total: number) {
    return `${(100 * Math.round(partial)) / Math.round(total)}%`;
  }
  return (
    <>
      {isLoading ? (
        <div className="loading">
          <div className="grid min-h-screen place-content-center">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="h-6 w-6 block rounded-full border-4 border-t-blue-300 animate-spin"></span>
              loading...
            </div>
          </div>
        </div>
      ) : (
        <div className="max-sm:h-auto w-screen h-screen overflow-hidden">
          {isImage ? (
            <div className="absolute  top-0 left-0 -z-20 h-screen w-full">
              <img
                src={`https://hassala.qistar.rent/storage/${boxData.image}`}
                alt="stockimage"
                className=" w-full h-full object-cover "
                loading="lazy"
              />
            </div>
          ) : (
            <video
              src="https://cdn.pixabay.com/video/2020/03/13/33631-398856295_large.mp4"
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 object-cover w-screen h-screen -z-20"
            ></video>
          )}

          <div className="-z-10 absolute top-0 left-0 h-screen w-screen bg-gradient-to-t from-black/80 to-black/50"></div>
          <div className="w-full h-full grid grid-cols-2 max-sm:grid-cols-1 z-50 mx-auto justify-center items-center">
            <div className="px-20 flex flex-col gap-4">
              <div>
                <p className="text-white font-kufam text-md mb-8 px-4 py-3 w-fit rounded-full border border-gray-800 bg-gray-50/10 flex gap-4 animate-marquee2">
                  <span className="text-sm mt-1">&#x6DD;</span>
                  <span className="mt-1">
                    لَنْ تَنَالُوا الْبِرَّ حَتَّى تُنْفِقُوا مِمَّا تُحِبُّونَ{" "}
                  </span>

                  <span className="mt-1">&#x6DD;</span>
                </p>
                <h1 className="text-6xl font-kufam font-black text-white text-right leading-tight">
                  {boxData.hero_title}
                </h1>
              </div>
              {/* <progress
              dir="rtl"
              max="100"
              min="0"
              value="65"
              className="animate-pulse"
            ></progress>  */}
              <ProgressBar
                backgroundColor="#bada55"
                percentage={percentage(
                  boxData.donations_sum_amount,
                  boxData.target
                )}
              />
              <div className="relative my-5">
                <div className="text-white font-kufam text-center font-bold pl-4 pt-6">
                  إجمالي التبرعات{" "}
                  {numberWithCommas(boxData.donations_sum_amount)}
                </div>
              </div>
              <div className="flex justify-between font-kufam  p-6 border bg-black/20 border-gray-700 rounded-lg">
                <div className="flex flex-col gap-4">
                  <p className="text-white">المبغ المتبقي</p>
                  <p className="text-3xl font-bold text-white">
                    {boxData.donations_sum_amount
                      ? numberWithCommas(
                          boxData.target - boxData.donations_sum_amount
                        )
                      : numberWithCommas(boxData.target)}{" "}
                    <span className="text-sm text-white">ر.س</span>
                  </p>
                </div>
                <div className="flex flex-col gap-4 text-white items-start px-2">
                  <p className="text-white">المبغ المستهدف</p>
                  <p className="text-3xl font-bold text-left">
                    {numberWithCommas(boxData.target)}
                    <span className="text-sm mr-2">ر.س</span>
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-full flex flex-col gap-6 h-f justify-center items-center">
              <div className="text-center text-white ">
                <p className="text-2xl text-center mt-4 font-bold font-kufam">
                  للتبرع
                </p>
                <p>فقط إمسح ال QR Code</p>
              </div>
              <div className="bg-white my-auto w-2/3 h-auto rounded-3xl flex flex-col gap-6 justify-center items-center ">
                <div className="w-full flex justify-center items-center rounded-t-3xl p-4 bg-zinc-100">
                  <div className="w-auto  min-w-8/12 ">
                    <img
                      src={`${mediaURl}${associationLogo}`}
                      alt="association logo"
                      className="w-full h-full object-fill max-h-20"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="h-full w-full">
                  <div className="w-8/12 mx-auto">
                    <img
                      src={`${mediaURl}${boxData.qr_code}`}
                      alt="design"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className=" bg-zinc-100  w-full p-6  rounded-3xl rounded-t-none flex justify-center">
                  <img
                    src={paymentMethodsSVG}
                    alt="payment methods logo"
                    className="w-2/3 h-full"
                  />
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
