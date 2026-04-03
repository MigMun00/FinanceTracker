import { useState, useEffect } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction";
import { getCategories } from "../services/category";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    date: "",
    category_id: "",
    description: "",
    type: "expense",
    amount: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    setCategories(sorted);
  };

  useEffect(() => {
    loadTransactions();
    loadCategories();

    // default date = today
    setForm((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  // map for fast lookup
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const handleSubmit = async () => {
    if (!(form.date && form.category_id && form.amount)) return;

    setLoading(true);

    const transactionData = {
      date: form.date,
      category_id: Number(form.category_id),
      description: form.description,
      type: form.type,
      amount: parseFloat(form.amount),
    };

    try {
      if (editingId) {
        await updateTransaction(editingId, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      // reset ONLY on success
      setForm({ ...initialForm, date: new Date().toISOString().split("T")[0] });
      setEditingId(null);

      await loadTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      date: t.date,
      category_id: String(t.category_id),
      description: t.description || "",
      type: t.type,
      amount: t.amount,
    });
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-300 mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">
        {editingId ? "Edit" : "Add"} Transaction
      </h1>

      {/* Form */}
      <div className="w-full flex justify-between gap-2 mb-10">
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <select
          className="bg-(--elevated) rounded-lg outline-none transition-all px-4 py-2"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <Input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />

        <select
          className="bg-(--elevated) rounded-lg outline-none transition-all px-4 py-2"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <Input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-max-sm"
        />

        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update" : "Add"}
        </Button>
      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl mb-5">My Transactions</h2>
        <table className="min-w-full border-collapse border border-slate-300 bg-(--elevated)">
          <thead className="bg-(--surface)">
            <tr>
              <th className="border border-slate-300 px-3 py-2 text-left">
                Date
              </th>
              <th className="border border-slate-300 px-3 py-2 text-left">
                Category
              </th>
              <th className="border border-slate-300 px-3 py-2 text-left">
                Description
              </th>
              <th className="border border-slate-300 px-3 py-2 text-left">
                Type
              </th>
              <th className="border border-slate-300 px-3 py-2 text-right">
                Amount
              </th>
              <th className="border border-slate-300 px-3 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="odd:bg-transparent even:bg-transparent">
                <td className="border border-slate-300 px-3 py-2">{t.date}</td>
                <td className="border border-slate-300 px-3 py-2">
                  {categoryMap[t.category_id] || "Uncategorized"}
                </td>
                <td className="border border-slate-300 px-3 py-2">
                  {t.description}
                </td>
                <td className="border border-slate-300 px-3 py-2 capitalize">
                  {t.type}
                </td>
                <td className="border border-slate-300 px-3 py-2 text-right">
                  ${t.amount}
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => handleEdit(t)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(t.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
