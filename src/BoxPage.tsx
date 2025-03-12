import paymentMethodsSVG from "./assets/paymentMethods.svg";
import { useEffect, useState } from "react";
import ProgressBar from "./components/progressBar";
import { useURLID } from "./useURLID";
import axios from "axios";
// import Pusher from "pusher-js";
import { v4 as uuidv4 } from "uuid";
import WebFont from "webfontloader";
import WellcomePage from "./components/wellcomePage";

//extras
import useSound from "use-sound";
import thankYou from "./assets/sounds/thankyou.mp3";
import ConfettiExplosion from "react-confetti-explosion";
import QrCodeGenerator from "./components/QrCodeGenerator";
import { usePusher } from "./hooks/usePusher";

// import * as dotenv from "dotenv";
// dotenv.config();

const mediaURl = `${import.meta.env.VITE_BASEURL_STORAGE}`;
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASEURL_API}`,
});

interface Association {
  logo: string;
  primary_color?: string;
  text_color?: string;
  donation_license?: string;
  association_license?: string;
}

interface BoxData {
  association: Association;
  image: string;
  sub_title: string;
  font_name?: string;
  target: number;
  hero_title: string;
  qr_code: string;
  primary_color: string;
  text_color: string;
  media_type: string;
  donations_sum_amount: number;
  quran: string;
}

const BoxPage: React.FC = () => {
  const [sayThankYou] = useSound(thankYou);
  const { id } = useURLID();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [boxData, setBoxData] = useState<BoxData | null>(null);
  const [associationLogo, setAssociationLogo] = useState<string | null>(null);
  const [currentDonationAmount, setCurrentDonationAmount] = useState<number>(0);

  const [remainingDonationAmount, setRemainingDonationAmount] =
    useState<number>(0);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [clientId, setClientId] = useState<string>("");
  const [customFont, setCustomFont] = useState<string>("");
  const [brandColor, setBrandColor] = useState<string>("#bada55");
  const [textColor, setTextColor] = useState<string>("#ffff");
  const [certificationUrl, setCertificationUrl] = useState<string>("");
  // const [associationLicenceUrl, setAssociationLicenceUrl] =
  //   useState<string>("");
  const hassalahID = id ? id : "";
  const { donationData, deviceDonationData, updateHassalah } = usePusher(
    clientId,
    hassalahID
  );

  const numberWithCommas = (x: number) => {
    const num = Math.round(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function percentage(partial: number, total: number) {
    return `${Math.round((100 * Math.round(partial)) / Math.round(total))}`;
  }

  const fetchDonationBoxData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`hassala/${id}`);
      const data: BoxData = response.data.data;
      setBoxData(data);
      setAssociationLogo(data.association.logo);
      setCurrentDonationAmount(data.donations_sum_amount);
      console.log(response.data.data);

      setBrandColor(data.primary_color || brandColor);
      setTextColor(data.text_color || textColor);
      setCustomFont(data.font_name || customFont);
      setCertificationUrl(data.association.donation_license || "");
      // setAssociationLicenceUrl(data.association.association_license || "");
    } catch (err) {
      const error = err as {
        response?: { data: unknown; status: number; headers: unknown };
        message: string;
      };
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // loading custom fonts using web fonts loader
  useEffect(() => {
    if (customFont) {
      console.log("==", customFont);

      WebFont.load({
        google: {
          families: [customFont + ":400,700", "Kufam:400,700"],
        },
        active: () => {
          document.documentElement.style.setProperty("--main-font", customFont);
        },
        inactive: () => {
          console.error("Failed to load the font:", customFont);
        },
      });
    }
  }, [customFont]);

  useEffect(() => {
    fetchDonationBoxData();
  }, [id, updateHassalah]);

  useEffect(() => {
    console.log("======", donationData?.donation.amount);

    if (donationData && donationData.donation && donationData.donation.amount) {
      setCurrentDonationAmount(
        (prevAmount) => Number(prevAmount) + donationData.donation.amount
      );
    }
  }, [donationData]);
  useEffect(() => {
    console.log("====== cd :", currentDonationAmount);
  }, [currentDonationAmount]);

  useEffect(() => {
    let storedId = localStorage.getItem("clientId") ?? uuidv4();
    if (!localStorage.getItem("clientId")) {
      localStorage.setItem("clientId", storedId);
    }
    setClientId(storedId);
  }, []);

  // useEffect(() => {
  //   const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  //     cluster: "ap2",
  //   });
  //   // const clientId = localStorage.getItem("clientId");

  //   const device_channel = pusher.subscribe(
  //     `donation.notification.${clientId}`
  //   );

  //   device_channel.bind("update.donation.notification", (data: donation) => {
  //     console.log("Received device_channel data", data);
  //     sayThankYou();
  //     setIsExploding(true);
  //   });

  //   const hassalah_channel = pusher.subscribe(`donation.${id}`);
  //   hassalah_channel.bind("update.donation", (data: donation) => {
  //     console.log("Received hassalah_channel data: ", data);
  //     setNewDonation(data.donation.amount);
  //     // console.log("📖 pusher: ", currentDonationAmount + newDonation);
  //   });
  //   // hassalah_channel.bind("update.data", () => {
  //   //   fetchDonationBoxData();
  //   // });

  //   return () => {
  //     device_channel.unbind_all();
  //     device_channel.unsubscribe();
  //     hassalah_channel.unbind_all();
  //     hassalah_channel.unsubscribe();
  //   };
  // }, [clientId]);

  useEffect(() => {
    if (deviceDonationData) {
      // console.log("===", donationData);
      // console.log("===device data ", deviceDonationData);
      if (deviceDonationData.clientId === clientId) {
        console.log(
          "donation ===",
          deviceDonationData.clientId,
          "clientId =",
          clientId
        );
        sayThankYou();
        setIsExploding(true);
        const timer = setTimeout(() => setIsExploding(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [deviceDonationData]);

  useEffect(() => {
    if (boxData) {
      const toGo = Math.max(
        0,
        Number(boxData.target) - Number(currentDonationAmount)
      );
      setRemainingDonationAmount(toGo);
    }
  }, [boxData, currentDonationAmount]);

  // added by chat gpt to fix the sound block issue
  useEffect(() => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const resumeAudio = async () => {
      if (context.state === "suspended") {
        await context.resume();
      }
      window.removeEventListener("click", resumeAudio);
    };
    window.addEventListener("click", resumeAudio);
    return () => window.removeEventListener("click", resumeAudio);
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="grid min-h-screen place-content-center">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="h-6 w-6 block rounded-full border-4 border-t-blue-300 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div>
        <WellcomePage />
      </div>
    );
  }

  if (!boxData) {
    return <div className="loading">no data </div>;
  }

  return (
    <div className="h-full md:w-screen md:h-screen overflow-hidden">
      {boxData.media_type === "Image" ? (
        <div className="absolute top-0 left-0 -z-20 h-screen w-full">
          <img
            src={`${mediaURl}${boxData.image}`}
            alt="Stock"
            className="w-full h-full object-cover"
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
        />
      )}

      <div className="-z-10 absolute top-0 left-0 h-screen w-screen bg-gradient-to-t from-black/80 to-black/30" />
      <div className="w-full h-full grid md:grid-cols-2 max-sm:grid-cols-1 z-50 mx-auto justify-center items-center">
        <div className="px-8 flex flex-col gap-8 pt-8 sm:pt-0">
          <div>
            <p className="text-md text-white font-kufam mb-8 px-6 py-3 w-fit rounded-md border border-slate-50/10 bg-slate-100/30 backdrop-blur-lg flex gap-4 mx-auto md:mx-0">
              <span className="mt-1">{boxData.quran}</span>
            </p>

            <h1
              style={{ color: textColor }}
              className="hero_title_CustomFont text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-center md:text-right sm:leading-tight xl:leading-normal mb-6"
            >
              {boxData.hero_title}
            </h1>

            <ProgressBar
              bgColor={brandColor}
              percentage={percentage(currentDonationAmount, boxData.target)}
            />
          </div>

          <div className="flex flex-wrap-reverse justify-between font-kufam p-4 sm:p-6 border bg-slate-800/10 border-slate-50/20 rounded-lg backdrop-blur-lg">
            <div className="flex flex-col gap-1 sm:gap-4">
              <p className="text-white">تم جمع</p>
              <div className="text-lg sm:text-3xl font-bold text-white">
                <span
                  className="text-2xl text-white mr-2"
                  style={{ fontFamily: "saudi_riyal" }}
                >
                  &#xE900;
                </span>
                {numberWithCommas(currentDonationAmount)}
              </div>
            </div>
            <div className="flex flex-col gap-1 sm:gap-4">
              <p className="text-white">المبلغ المتبقي</p>
              <p className="text-lg sm:text-3xl font-bold text-white">
                <span
                  className="text-2xl text-white mr-2"
                  style={{ fontFamily: "saudi_riyal" }}
                >
                  &#xE900;
                </span>
                {numberWithCommas(remainingDonationAmount)}
              </p>
            </div>
            <div className="flex flex-col gap-1 sm:gap-4 text-white items-start px-0 sm:px-2 mb-4 sm:mb-0">
              <p className="text-white">المبلغ المستهدف</p>
              <p className="text-lg sm:text-3xl font-bold text-left">
                <span
                  className="text-2xl text-white mr-2"
                  style={{ fontFamily: "saudi_riyal" }}
                >
                  &#xE900;
                </span>
                {numberWithCommas(boxData.target)}
              </p>
            </div>
          </div>

          <div className="flex ">
            <div className="text-xl text-white flex flex-col items-center gap-5">
              {/* {associationLicenceUrl && (
                <>
                  <p className="text-sm">تبرع بأمان - ترخيص الجمعية</p>
                  <div className="p-2 bg-white rounded-md shadow-md">
                    <QrCodeGenerator
                      url={`${mediaURl}/${associationLicenceUrl}`}
                      size={120}
                    />
                  </div>
                </>
              )} */}
            </div>
            <div className="text-xl text-white flex flex-col  gap-5">
              {certificationUrl && (
                <>
                  <p className="text-sm">ترخيص جمع التبرعات </p>
                  <QrCodeGenerator
                    url={`${mediaURl}/${certificationUrl}`}
                    size={undefined}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-6 justify-center items-center">
          <div className="text-center text-white">
            <p
              style={{ color: textColor }}
              className="text-2xl mt-4 font-bold font-kufam"
            >
              للتبرع
            </p>
            <p>فقط إمسح ال QR Code</p>
            {isExploding && <ConfettiExplosion />}
          </div>
          <div className="bg-white my-auto w-2/3 h-auto rounded-3xl flex flex-col gap-6 justify-center items-center">
            <div className="w-full flex justify-center items-center rounded-t-3xl p-4 bg-zinc-100">
              <div className="w-auto min-w-8/12">
                {associationLogo && (
                  <img
                    src={`${mediaURl}${associationLogo}`}
                    alt="Association Logo"
                    className="w-full h-full object-fill max-h-20"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
            <div className="h-full w-full">
              <div className="w-8/12 mx-auto">
                {id && clientId && (
                  <QrCodeGenerator
                    url={`https://app.donations-box.com/donation/${id}?clientId=${clientId}`}
                    size={12}
                  />
                )}
              </div>
            </div>
            <div className="bg-zinc-100 w-full p-6 rounded-3xl rounded-t-none flex justify-center">
              <img
                src={paymentMethodsSVG}
                alt="Payment Methods"
                className="w-2/3 h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxPage;
