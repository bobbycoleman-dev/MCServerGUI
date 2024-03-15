import axios, { AxiosError } from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000/api/v1/minecraft"
});

async function getUserData(username: string) {
  try {
    const response = await http.get(`/user-data/${username}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error connecting to EC2", (error as AxiosError).response?.data);
    return (error as AxiosError).response?.data;
  }
}


export { getUserData };
