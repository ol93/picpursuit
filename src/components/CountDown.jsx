import React, { useState, useEffect } from "react";

export default function Timer({ expirationTime }) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const expirationTimeMs = new Date(expirationTime).getTime();
      setTimeRemaining(expirationTimeMs - Date.now());

      const interval = setInterval(() => {
        setTimeRemaining(expirationTimeMs - Date.now());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, 10); // delay of 10 ms

    return () => clearTimeout(timer);
  }, [expirationTime]);

  const hours = timeRemaining ? Math.floor(timeRemaining / 3600000) : 0;
  const minutes = timeRemaining
    ? Math.floor((timeRemaining % 3600000) / 60000)
    : 0;
  const seconds = timeRemaining
    ? Math.floor((timeRemaining % 60000) / 1000)
    : 0;
  const isExpired =
    timeRemaining <= 0 || timeRemaining === undefined || timeRemaining === null;

  return (
    <p className="font-bold" style={{ color: "grey" }}>
      {isExpired
        ? "Expired"
        : `Expires in: ${hours} h ${minutes} m ${seconds} sec`}
    </p>
  );
}
