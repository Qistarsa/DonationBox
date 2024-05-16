import React from "react";
import "./progressBar.css";

const progressBar = ({
  label,
  backgroundColor = "#e5e5e5",
  // expected format for visual parts
  percentage = "0%",
  color = "white",
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
        className={`bar overflow-hidden flex h-full items-center justify-end rounded-full bg-gradient-to-l from-lime-500 to-lime-400 leading-none 
        max-w-full`}
        style={{
          width: `${percentage(boxData.donations_sum_amount, boxData.target)}`,
        }}
      >
        <span></span>
        <p className="p-1 ml-2 text-white font-bold">
          {percentage(
            Math.round(boxData.donations_sum_amount),
            Math.round(boxData.target)
          )}
        </p>
      </div>
    </div>
  );
};

export default progressBar;
