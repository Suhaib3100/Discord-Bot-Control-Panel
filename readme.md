# Discord Message Fetcher

A Node.js backend that fetches **all messages** from a Discord channel using the Discord API.

## Features
- ✅ Fetches all messages from a given Discord text channel (not limited to 10).
- ✅ Uses **pagination** to retrieve the entire history.
- ✅ Returns structured JSON with message details.
- ✅ Built with **Express.js** and **Discord.js**.

## Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/discord-message-fetcher.git
cd discord-message-fetcher
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add:
```env
BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
```

### 4️⃣ Start the Server
```sh
node server.js
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Fetch All Messages from a Channel
```http
GET /messages/:channelId
```
#### Example Response:
```json
[
  {
    "id": "123456789",
    "author": "User1",
    "content": "Hello World!",
    "timestamp": 1700000000000
  },
  {
    "id": "987654321",
    "author": "User2",
    "content": "Hi there!",
    "timestamp": 1700000001000
  }
]
```

## File Structure
```
/discord-backend
│── .env               # Store the bot token here
│── package.json       # Dependencies and scripts
│── server.js          # Main Express server
│── config.js          # Bot configuration
│── routes/
│   ├── messages.js    # Fetch all messages from a channel
│── bot.js             # Bot client initialization
```

## License
This project is open-source under the **MIT License**.

---
### ⚡ Developed with ❤️ by [Your Name]

