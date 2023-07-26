import axios from "axios";

const API_BASE_URL = process.env.NEWS_API_ENDPOINT;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
