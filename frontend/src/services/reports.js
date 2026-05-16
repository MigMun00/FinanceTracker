import api from "./api";

export const getMonthlyReport = async (year, month) => {
  const res = await api.get("/reports/monthly", { params: { year, month } });
  return res.data;
};

export const getExpensesByCategory = async () => {
  const res = await api.get("/reports/expenses-by-category");
  return res.data;
};

export const getCashflow = async () => {
  const res = await api.get("/reports/cashflow");
  return res.data;
};
