import React from "react";
import { useEffect, useState } from "react";
import "./progressBar.css";

const ProgressBar = ({
  backgroundColor,
  // expected format for visual parts
  percentage = "0%",
  bgColor = "#bada55",
}) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => {
      setWidth(percentage);
    });
  }, [percentage]);

  return (
    <div className="meter animate relative h-16 rounded-full border border-2 border-white p-1 overflow-hidden">
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

module.exports = ProgressBar;
