# MC Server GUI

## Overview

If you play Minecrtaft and want to avoid paying a ton of money for a third-party service to host your server so you host it on your own VPS like AWS EC2 but you hate managing it through the CLI, just connect it to MC Server GUI to get a user interface to maintain, update, and send commands to your MC Server.

## Under the Hood

MC Server GUI is a desktop application built with Tauri, React, Node, and Express. 

Tauri is a framework for building desktop applications with web technologies. It's a great way to build a desktop application with a web developer's skillset. The backend is built with Node and Express to handle the server management and the frontend is built with React to provide a user interface for the server management.

The appplication also uses WebHooks and an SSH library to allow secure and fast connection to your EC2 instance using your private key file path and EC2 SSH domain. This allows you to send commands to your server, get live server logs, and manage it through the GUI.

## Features

- Start, stop, and restart your server
- Send commands to your server
- Get live server logs
- Update your server
- Manage your server's files
- Manage your server's plugins
- Manage your server's settings
- Manage your server's players
- Manage your server's backups
- Manage your server's world
- Manage your server's console
- Manage your server's server.properties file
- See who is online or offline

## Comming Soon

There is currently no authentication and the ssh is setup through the .env file. In the future, I plan to add authentication and a setup process for the ssh connection so make it more secure and user-friendly.

I will also be adding an instructional page to help users set up their EC2 instance and connect it to the app.

## Installation

### Prerequisites
- Rust must be installed on your machine
- Node must be installed on your machine

### Steps
- Pull the repository
- Run `npm install` in the `mc-server-gui` and `mc-server-gui-server` directory
- Run `npm run tauri dev` in the `mc-server-gui` directory
- Run `npm run start` in the `mc-server-gui-server` directory
