import { useState, useEffect } from "react";

const CountdownTimer = () => {
	// Initialize the countdown time state to 30 seconds
	const [countdown, setCountdown] = useState(30);

	useEffect(() => {
		// Decrease the countdown time by 1 every second
		const interval = setInterval(() => {
			setCountdown((currentCountdown) => currentCountdown - 1);
		}, 1000);

		// Clear the interval when the component unmounts
		return () => clearInterval(interval);
	}, []); // Empty array means this effect runs only on mount

	// Stop the countdown when it reaches 0
	useEffect(() => {
		if (countdown === 0) {
			// Optionally do something when the countdown reaches 0
			console.log("Countdown finished!");
		}
	}, [countdown]);

	return (
		<div className="text-center text-wrap">
			Server will be running in {countdown} {countdown === 1 ? "second" : "seconds"}
		</div>
	);
};

export default CountdownTimer;
