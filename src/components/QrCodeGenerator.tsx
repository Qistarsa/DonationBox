import { QRCodeSVG } from "qrcode.react";
// import clsx
import { clsx } from "clsx";
interface Props {
  url: string | null;
  size: number | undefined;
}
const QrCodeGenerator: React.FC<Props> = ({ url, size }) => {
  const qrUrl: string = url ? url : "";
  //   ? `https://app.donations-box.com/donation/${id}?clientId=${clientId}`
  //   : "";
  return (
    <div>
      <div className="w-full h-full ">
        <div
          className={clsx(
            "bg-white ",
            !size ? "p-1 w-[80px] rounded-0" : "w-full"
          )}
        >
          <QRCodeSVG
            value={qrUrl}
            size={size}
            style={{
              width: !size ? "100%" : "100%",
              height: !size ? "100%" : "100%",
            }}
          />
        </div>
      </div>

      {/* <p>Loading QR Code...</p> */}
    </div>
  );
};
export default QrCodeGenerator;
