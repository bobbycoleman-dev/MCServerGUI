import { useState, useEffect } from "react";
import { Progress } from "./progress";

const CountdownTimer = () => {
  // Initialize the countdown time state to 30 seconds
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Decrease the countdown time by 1 every second
    const interval = setInterval(() => {
      setCountdown((currentCountdown) => currentCountdown + (100 / 30));
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty array means this effect runs only on mount

  // Stop the countdown when it reaches 0
  useEffect(() => {
    if (countdown >= 100) {
      // Optionally do something when the countdown reaches 0
      console.log("Countdown finished!");
    }
  }, [countdown]);

  return (
    <Progress className="mt-4" value={countdown} />
  )
};

export default CountdownTimer;
