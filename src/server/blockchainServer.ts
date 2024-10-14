require("dotenv").config();
import express from "express";
import morgan from "morgan";
import blockchainRouter from "./routes";
import rateLimit from "express-rate-limit";

const PORT = parseInt(process.env.SERVER_PORT || "3000");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

/**
 * Create an instance of the Express framework.
 */
const app = express();

/**
 * Register midlewares
 * - morgan logs: run in development and production environments
 */
app.use(express.json());
/* c8 ignore start */
// directive /* c8 ... */ disable lines for test coverage
if (process.argv.includes("--run")) {
  app.use(morgan("tiny"));
}
/* c8 ignore stop */
// Apply the rate limiting middleware to all requests.
app.use(limiter);

/**
 * Routes
 */
app.use("/", blockchainRouter);

/**
 * Server startup message
 * listen run in development and production environments
 */
/* c8 ignore start */
// directive /* c8 .. */ disable lines for test coverage
if (process.argv.includes("--run")) {
  app.listen(PORT, () => {
    console.log(`Blockchain Server is running at ${PORT}`);
  });
}
/* c8 ignore stop */

export { app };
