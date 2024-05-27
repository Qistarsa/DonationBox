import paymentMethodsSVG from "./assets/paymentMethods.svg";
import { useEffect, useState } from "react";
import ProgressBar from "./components/progressBar";
import { useURLID } from "./useURLID";
import axios from "axios";
import Pusher from "pusher-js";

//extras
import useSound from "use-sound";
import thankYou from "./assets/sounds/thankyou.mp3";
import ConfettiExplosion from "react-confetti-explosion";

// import * as dotenv from "dotenv";
// dotenv.config();

const mediaURl = `${import.meta.env.VITE_BASEURL_STORAGE}`;
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASEURL_API}`,
});

interface BoxData {
  description_ar: string | null;
  target: number;
  image: string;
  hero_title: string;
  sub_title: string;
  qr_code: string;
  media_type: string;
  donations_sum_amount: number;
  quran: string;
}

interface donation {
  donation: {
    amount: number;
  };
}

const BoxPage = () => {
  const [sayThankYou] = useSound(thankYou);
  const { id } = useURLID();
  const [boxData, setBoxData] = useState<BoxData>({
    target: 0,
    description_ar: "",
    image: "",
    hero_title: "",
    sub_title: "",
    qr_code: "",
    media_type: "",
    donations_sum_amount: 0,
    quran: "لَنْ تَنَالُوا الْبِرَّ حَتَّى تُنْفِقُوا مِمَّا تُحِبُّونَ",
  });

  const [isLoading, SetLoading] = useState(false);
  const [associationLogo, setassociationLogo] = useState(null);
  const [currentDonationAmount, setcurrentDonationAmount] = useState(0);
  const [newDonation, setnewDonation] = useState(0);
  const [remainingDonationAmount, setremainingDonationAmount] = useState(0);

  useEffect(() => {
    const fetchDonationBoxData = async () => {
      SetLoading(false);
      try {
        const response = await api.get(`hassala/${id}`);
        setBoxData(response.data.data);
        setassociationLogo(response.data.data.association.logo);

        setcurrentDonationAmount(response.data.data.donations_sum_amount);
        console.log("api call currentDonation ", currentDonationAmount);
      } catch (err) {
        console.log(err);
        // if (err.response) {
        //   console.log(err.response.status);
        //   console.log(err.response.headers);
        // } else {
        //   console.log(err);
        // }
      } finally {
        // SetLoading(false);
      }
    };
    fetchDonationBoxData();
  }, [id, currentDonationAmount, newDonation]);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: "ap2",
    });
    const channel = pusher.subscribe(`donation.${id}`);
    channel.bind("update.donation", (data: donation) => {
      console.log("Received notification: ", data);
      setnewDonation(data.donation.amount);
      console.log(
        "🎯 from pusher useeffect pusher amount: ",
        data.donation.amount
      );

      console.log("📖 pusher: ", currentDonationAmount + newDonation);
    });

    return () => {
      pusher.unsubscribe(`donation.${id}`);
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    if (newDonation > 0) {
      sayThankYou();

      setInterval(() => {
        setIsExploding(true);
      }, 1300);
    }
    console.log(newDonation);
  }, [newDonation]);

  useEffect(() => {
    const toGo = Math.max(
      0,
      Number(boxData.target) - Number(currentDonationAmount)
    );
    setremainingDonationAmount(toGo);
  }, [currentDonationAmount]);

  function numberWithCommas(x: number) {
    const num = Math.round(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function percentage(partial: number, total: number) {
    return `${Math.round((100 * Math.round(partial)) / Math.round(total))}`;
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
        <div className="h-full md:w-screen md:h-screen overflow-hidden">
          {boxData.media_type === "Image" ? (
            <div className="absolute  top-0 left-0 -z-20 h-screen w-full">
              <img
                src={`${mediaURl}${boxData.image}`}
                alt="stockimage"
                className=" w-full h-full object-cover "
                loading="lazy"
              />
            </div>
          ) : (
            <video
              src={`${mediaURl}${boxData.image}`}
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 object-cover w-screen h-screen -z-20"
            ></video>
          )}

          <div className="-z-10 absolute top-0 left-0 h-screen w-screen bg-gradient-to-t from-black/80 to-black/50"></div>
          <div className="w-full h-full grid md:grid-cols-2 max-sm:grid-cols-1 z-50 mx-auto justify-center items-center">
            <div className="px-8 flex flex-col gap-8 pt-8 sm:pt-0">
              <div className="">
                <p className="text-md text-white font-kufam text-md mb-8 px-6 py-3 w-fit rounded-md border border-gray-400 bg-gray-50/30 backdrop-blur-lg flex gap-4 mx-auto md:mx-0">
                  <span className="mt-1">{boxData.quran}</span>
                </p>

                <h1 className="text-2xl sm:text-5xl lg:text-6xl  xl:text-7xl font-kufam font-black text-white text-center md:text-right sm:leading-tight mb-6">
                  {boxData.hero_title}
                </h1>
                <ProgressBar
                  bgColor="#bada55"
                  percentage={percentage(currentDonationAmount, boxData.target)}
                />
              </div>

              <div className="flex flex-wrap-reverse justify-between font-kufam  p-4 sm:p-6 border bg-black/20 border-gray-600 rounded-lg backdrop-blur-lg">
                <div className="flex flex-col gap-1 sm:gap-4">
                  <p className="text-white"> تم جمع</p>
                  <div className="text-lg sm:text-3xl font-bold text-white ">
                    {numberWithCommas(currentDonationAmount)}
                    <span className="text-sm text-white mr-2">ر.س</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 sm:gap-4">
                  <p className="text-white">المبلغ المتبقي</p>
                  <p className="text-lg sm:text-3xl font-bold text-white">
                    {/* {boxData.donations_sum_amount
                      ? numberWithCommas(boxData.target - currentDonationAmount)
                      : numberWithCommas(boxData.target)}{" "} */}
                    {numberWithCommas(remainingDonationAmount)}
                    <span className="text-sm text-white mr-2">ر.س</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-4 text-white items-start px-0 sm:px-2 mb-0 mb-4 sm:mb-0">
                  <p className="text-white">المبغ المستهدف</p>
                  <p className="text-lg sm:text-3xl font-bold text-left">
                    {numberWithCommas(boxData.target)}
                    <span className="text-sm mr-2">ر.س</span>
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-full flex flex-col gap-6 h-f justify-center items-center">
              <div className="text-center text-white">
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
