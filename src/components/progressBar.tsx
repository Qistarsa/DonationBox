import { useEffect, useState, FC } from "react";
import "./progressBar.css";

interface ProgressBarProps {
  backgroundColor?: string;
  percentage?: string;
  bgColor?: string;
}

const ProgressBar: FC<ProgressBarProps> = ({
  // backgroundColor,
  percentage = "0%",
  bgColor = "#bada55",
}) => {
  const [width, setWidth] = useState<string>("0%");
  useEffect(() => {
    requestAnimationFrame(() => {
      setWidth(percentage);
    });
  }, [percentage]);

  return (
    <div className="meter animate relative h-16 rounded-full border-2 border-white p-1 overflow-hidden">
      <div
        className={`bar overflow-hidden flex h-full items-center justify-end rounded-full bg-gradient-to-l leading-none 
        max-w-full`}
        style={{
          width: width,
          backgroundColor: bgColor,
        }}
      >
        <span></span>
        <p className="p-1 ml-2 text-white font-bold">{percentage}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
