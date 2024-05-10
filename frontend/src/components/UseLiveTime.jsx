import { useState, useEffect } from "react";

const useLiveTime = (timezone, interval = 1000) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        ...timeOptions,
        timeZone: timezone,
      });
      const now = new Date();
      const formattedTime = timeFormatter.format(now);
      setTime(formattedTime);
    };

    tick(); // initialize immediately
    const timerId = setInterval(tick, interval);

    return () => clearInterval(timerId);
  }, [timezone, interval]);

  return time;
};

export default useLiveTime;
