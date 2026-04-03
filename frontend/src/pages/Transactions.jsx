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

  const [date, setDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");

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
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  // map for fast lookup
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const handleSubmit = async () => {
    if (!(date && selectedCategory && amount)) return;

    setLoading(true);

    const transactionData = {
      date,
      category_id: Number(selectedCategory),
      description,
      type,
      amount: parseFloat(amount),
    };

    try {
      if (editingId) {
        await updateTransaction(editingId, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      // reset ONLY on success
      setDate(new Date().toISOString().split("T")[0]);
      setSelectedCategory("");
      setDescription("");
      setType("expense");
      setAmount("");
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
    setDate(t.date);
    setSelectedCategory(String(t.category_id));
    setDescription(t.description || "");
    setType(t.type);
    setAmount(t.amount);
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
      <div className="flex gap-2 mb-10">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="bg-(--elevated) rounded-2xl px-4 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="bg-(--elevated) px-4 py-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-max-sm"
        />

        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update" : "Add"}
        </Button>
      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl mb-5">Transaction List</h2>
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
