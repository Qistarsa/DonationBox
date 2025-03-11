import { QRCodeSVG } from "qrcode.react";
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
      <div className=" w-full ">
        <QRCodeSVG
          value={qrUrl}
          size={size}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* <p>Loading QR Code...</p> */}
    </div>
  );
};
export default QrCodeGenerator;
