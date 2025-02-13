---

# Discord Server Management Dashboard

![Project Logo](./preview.png)

A comprehensive and user-friendly dashboard built with **Next.js** and **Express.js** to manage Discord servers efficiently. This project provides an attractive and intuitive interface for server administrators to view messages, manage roles, kick/ban members, and access audit logs.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup and Installation](#setup-and-installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

---

## Introduction

This project is a **Discord Server Management Dashboard** designed to simplify server administration tasks. It consists of three main components:

1. **Backend**: Built with **Express.js**, it handles Discord API interactions, such as fetching messages, managing roles, and performing moderation actions.
2. **Frontend (HTML)**: A simple HTML-based frontend for basic interactions.
3. **Next.js Frontend**: A modern and responsive dashboard built with **Next.js** that provides a Discord-like interface for managing servers.

The backend interacts with the Discord API using the `discord.js` library, while the frontend provides a seamless user experience for server administrators.

---

## Features

- **View Server Information**: Fetch and display all connected Discord servers.
- **Channel Management**: List all channels in a server and fetch messages from specific channels.
- **Message Viewer**: View all messages in a channel, including attachments.
- **Audit Logs**: Access and display server audit logs.
- **Member Management**: Kick or ban members with optional reasons.
- **Role Management**: Create and delete roles with custom permissions and colors.
- **Responsive Dashboard**: A modern and intuitive interface built with Next.js.

---

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - discord.js (Discord API wrapper)
  - CORS (Cross-Origin Resource Sharing)
- **Frontend**:
  - Next.js (for the dashboard)
  - HTML/CSS (for the basic frontend)
- **Other Tools**:
  - npm (Node Package Manager)
  - Git (Version Control)

---

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)
- A Discord bot token (from the [Discord Developer Portal](https://discord.com/developers/applications))
- Git (optional, for cloning the repository)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Suhaib3100/Discord-Bot-Control-Panel.git
   cd Discord-Bot-Control-Panel
   ```

2. **Install Dependencies**:
   - Navigate to the `backend` folder and install dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Navigate to the `nextjs-frontend` folder and install dependencies:
     ```bash
     cd ../nextjs-frontend
     npm install
     ```

3. **Configure the Backend**:
   - Create a `.env` file in the `backend` folder and add your Discord bot token:
     ```env
     BOT_TOKEN=your-discord-bot-token
     ```

4. **Run the Backend**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - The backend will run on `http://localhost:5000`.

5. **Run the Next.js Frontend**:
   - Start the Next.js development server:
     ```bash
     cd ../nextjs-frontend
     npm run dev
     ```
   - The frontend will run on `http://localhost:3000`.

---

## Configuration

### Backend Configuration

- The backend uses the `discord.js` library to interact with the Discord API. Ensure your bot has the following permissions:
  - `View Channels`
  - `Read Messages`
  - `Kick Members`
  - `Ban Members`
  - `Manage Roles`
  - `View Audit Log`

- Update the `intents` in the `Client` initialization if additional permissions are required.

### Frontend Configuration

- The Next.js frontend is configured to interact with the backend API. Ensure the backend URL is correctly set in the frontend code (e.g., `http://localhost:5000`).

---

## Usage

1. **Access the Dashboard**:
   - Open your browser and navigate to `http://localhost:3000`.
   - Log in using your Discord credentials (if applicable).

2. **View Servers**:
   - The dashboard will display all servers your bot is connected to.

3. **Manage Channels**:
   - Select a server to view its channels and messages.

4. **Moderation Actions**:
   - Use the dashboard to kick/ban members, create/delete roles, and view audit logs.

---

## API Endpoints

The backend exposes the following REST API endpoints:

- **GET `/api/servers`**: Fetch all connected servers.
- **GET `/api/servers/:serverId/channels`**: Fetch all channels in a server.
- **GET `/api/servers/:serverId/channels/:channelId/messages`**: Fetch all messages in a channel.
- **GET `/api/servers/:serverId/audit-logs`**: Fetch server audit logs.
- **POST `/api/servers/:serverId/members/:memberId/kick`**: Kick a member.
- **POST `/api/servers/:serverId/members/:memberId/ban`**: Ban a member.
- **POST `/api/servers/:serverId/roles`**: Create a new role.
- **DELETE `/api/servers/:serverId/roles/:roleId`**: Delete a role.

---

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [Discord.js](https://discord.js.org) for the Discord API wrapper.
- [Next.js](https://nextjs.org) for the frontend framework.
- [Express.js](https://expressjs.com) for the backend framework.

---

Feel free to reach out if you have any questions or suggestions! 🚀

---
