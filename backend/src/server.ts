// Load environment variables from .env file
require("dotenv").config();

import http from "http";

// Load express
import app from "./app";
import { connect } from "./config/db";

const PORT: number = Number(process.env.PORT) || 8080;

// Connect to MONGODB database
connect();

const server: http.Server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`);
});
