import { Client } from "ssh2";
import fs from "fs";
import dotenv from "dotenv";

const client = new Client();
let isConnected = false;

dotenv.config();
const EC2_HOST = process.env.EC2_HOST;
const EC2_PRIVATE_KEY = process.env.EC2_PRIVATE_KEY;

const connSettings = {
  host: EC2_HOST,
  port: 22, // Normal is 22 port
  username: "ec2-user",
  privateKey: fs.readFileSync(EC2_PRIVATE_KEY),
};

const cdToServerDir = () => {
  client.exec("cd /opt/minecraft/server/ && ls", (err, stream) => {
    if (err) console.log(err);
    stream
      .on("close", (code, signal) => {
        console.log("Stream :: close :: code: " + code + ", signal: " + signal);
        console.log("Successfully changed directory to /opt/minecraft/server");
      })
      .on("data", (data) => {
        console.log("STDOUT: " + data);
      })
      .stderr.on("data", (data) => {
        console.log("STDERR: " + data);
      });
  });
};

const connectToEc2Ssh = (socket) => {
  client
    .on("ready", () => {
      console.log("Client :: ready");
      isConnected = true;
      socket.emit("connection_output", {
        message: "Connected to EC2",
        isConnected: true,
      });
    })
    .on("error", (err) => {
      console.error("Error connecting to EC2: ", err);
      socket.emit("connection_output", {
        message: "Error connecting to EC2",
        isConnected: false,
      });
    })
    .on("end", () => {
      console.log("Connection ended");
      isConnected = false;
      socket.emit("connection_output", {
        message: "EC2 Connection Ended",
        isConnected: false,
      });
    })
    .on("close", () => {
      console.log("Connection closed");
      isConnected = false;
      socket.emit("connection_output", {
        message: "EC2 Connection Closed",
        isConnected: false,
      });
    })
    .connect(connSettings);
};

const disconnectFromEc2Ssh = (socket) => {
  client.end();
  isConnected = false;
  socket.emit("connection_output", {
    message: "Disconnected from EC2",
    isConnected: false,
  });
};

const getLogs = (socket) => {
  if (!isConnected) {
    console.log("Not connected to EC2");
    socket.emit("log_output", "Not connected to EC2");
    return;
  }

  client.exec(
    "tail -f /opt/minecraft/server/logs/latest.log",
    (err, stream) => {
      if (err) console.log(err);
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal,
          );
        })
        .on("data", (data) => {
          // console.log("STDOUT: " + data);
          socket.emit("log_output", `${data.toString()}\n`);
        })
        .stderr.on("data", (data) => {
          console.log("STDERR: " + data);
        });
    },
  );
};

const startMcServer = async (socket) => {
  if (!isConnected) {
    console.log("Not connected to EC2");
    socket.emit("start_stop_output", "Not connected to EC2");
    return;
  }

  client.exec(
    "cd /opt/minecraft/server && screen -dmS mcserver sudo java -Xmx1024M -Xms1024M -jar server.jar nogui",
    (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal,
          );
          socket.emit("start_stop_output", {
            message: "Server Started",
            isRunning: true,
          });
          setTimeout(() => {
            getLogs(socket);
          }, 1000 * 30);
        })
        .on("data", (data) => {
          console.log("STDOUT: " + data);
          socket.emit("start_stop_output", {
            message: "Server Started",
            data: data.toString(),
            isRunning: true,
          });
        })
        .stderr.on("data", (data) => {
          console.log("STDERR: " + data);
          socket.emit("start_stop_output", {
            message: "Error starting server",
            data: data.toString(),
            isRunning: false,
          });
        });
    },
  );
};

const stopMcServer = (socket) => {
  if (!isConnected) {
    console.log("Not connected to EC2");
    socket.emit("start_stop_output", "Not connected to EC2");
    return;
  }

  client.exec("killall screen", (err, stream) => {
    if (err) throw err;
    stream
      .on("close", (code, signal) => {
        console.log("Stream :: close :: code: " + code + ", signal: " + signal);
        socket.emit("start_stop_output", {
          message: "Server Stopped",
          isRunning: false,
        });
      })
      .on("data", (data) => {
        console.log("STDOUT: " + data);
        socket.emit("start_stop_output", {
          message: "Server Stopped",
          data: data,
          isRunning: false,
        });
      })
      .stderr.on("data", (data) => {
        console.log("STDERR: " + data);
      });
  });
};

const getServerProperties = (socket) => {
  if (!isConnected) {
    console.log("Not connected to EC2");
    socket.emit("server_properties_output", "Not connected to EC2");
    return;
  }

  client.exec("cat /opt/minecraft/server/server.properties", (err, stream) => {
    if (err) throw err;
    stream
      .on("close", (code, signal) => {
        console.log("Stream :: close :: code: " + code + ", signal: " + signal);
      })
      .on("data", (data) => {
        console.log("STDOUT: " + data);
        socket.emit("server_properties_output", data);
      })
      .stderr.on("data", (data) => {
        console.log("STDERR: " + data);
      });
  });
};

const giveDiamond = (socket) => {
  if (!isConnected) {
    console.log("Not connected to EC2");
    socket.emit("give_diamond_output", "Not connected to EC2");
    return;
  }

  client.exec(
    "cd /opt/minecraft/server && screen -S mcserver -X stuff '/give TheBeard2017 diamond\n'",
    (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal,
          );
        })
        .on("data", (data) => {
          console.log("STDOUT: " + data);
          socket.emit("give_diamond_output", data);
        })
        .stderr.on("data", (data) => {
          console.log("STDERR: " + data);
        });
    },
  );
};

export {
  connectToEc2Ssh,
  disconnectFromEc2Ssh,
  cdToServerDir,
  startMcServer,
  stopMcServer,
  getLogs,
  getServerProperties,
  giveDiamond,
};
