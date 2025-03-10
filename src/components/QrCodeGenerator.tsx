import { QRCodeCanvas } from "qrcode.react";
interface Props {
  id: string | null;
  clientId: string | null;
}
const DonationQRCode: React.FC<Props> = ({ id, clientId }) => {
  const donationUrl: string = clientId
    ? `https://app.donations-box.com/donation/${id}?clientId=${clientId}`
    : "";
  return (
    <div>
      {clientId ? (
        <div className=" w-full ">
          <QRCodeCanvas
            value={donationUrl}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};
export default DonationQRCode;
