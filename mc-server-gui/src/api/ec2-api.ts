import axios, { AxiosError } from "axios";

const http = axios.create({
	baseURL: "http://localhost:8000/api/v1/ec2"
});

async function connectToEc2() {
	try {
		const response = await http.get("/connect");
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error connecting to EC2", (error as AxiosError).response?.data);
		return (error as AxiosError).response?.data;
	}
}

async function startServer() {
	try {
		const response = await http.post("/start");
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error starting server", (error as AxiosError).response?.data);
		return (error as AxiosError).response?.data;
	}
}

export { connectToEc2, startServer };
