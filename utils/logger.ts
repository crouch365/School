import pino from "pino";

// В проде — чистый JSON (удобно парсить логосборщикам вроде Loki/ELK).
// В деве — human-readable вывод через pino-pretty.
const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }),
});

export default logger;
