/** @format */

export const VITE_APP_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5173"
    : "https://web.istehwath.net";
