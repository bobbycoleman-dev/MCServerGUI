import dotenv from "dotenv";
import server from "./config/express.js";

dotenv.config();
const PORT = process.env.PORT;

async function start() {
	try {
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server: ", error);
		process.exit(1);
	}
}

start();
