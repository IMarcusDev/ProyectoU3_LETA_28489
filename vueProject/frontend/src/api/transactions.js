import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getTransactions = () => {
  return axios.get(`${API_URL}/transactions/`);
};

export const createTransaction = (text) => {
  return axios.post(`${API_URL}/transactions/`, {
    text: text
  });
};
