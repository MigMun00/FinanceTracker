import api from "./api";

export const getTransactions = async () => {
  const res = await api.get("/transactions");
  return res.data;
};

export const createTransaction = async (transactionData) => {
  const res = await api.post("/transactions", transactionData);
  return res.data;
};

export const updateTransaction = async (transactionId, transactionData) => {
  const res = await api.put(`/transactions/${transactionId}`, transactionData);
  return res.data;
};

export const deleteTransaction = async (transactionId) => {
  const res = await api.delete(`/transactions/${transactionId}`);
  return res.data;
};
