import { useState, useEffect } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState();

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
    setCategories(data);
  };

  const handleSubmit = async () => {
    if (!(date && selectedCategory && description && amount)) return;

    setLoading(true);

    const transactionData = {
      date,
      category_id: selectedCategory,
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
    } catch {
    } finally {
      setDate("");
      setSelectedCategory("");
      setDescription("");
      setType("expense");
      setAmount("");
      setLoading(false);
      setEditingId(null);
      await loadTransactions();
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setDate(transaction.date);
    setSelectedCategory(transaction.category_id);
    setDescription(transaction.description);
    setType(transaction.type);
    setAmount(transaction.amount);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Transactions Manager</h1>
      <div className="flex gap-2 mb-4">
        <Input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="bg-(--elevated) rounded-2xl px-4 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Input
          type="text"
          placeholder="Description"
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
        />
        <Button variant="success" onClick={handleSubmit}>
          {editingId ? "Update" : "Add"}
        </Button>
      </div>

      <ul>
        {transactions.map((t) => {
          return (
            <li key={t.id}>
              <div className="w-full flex items-center gap-4 mb-3">
                {t.date} -{" "}
                {categories.find((c) => c.id === t.category_id)?.name ||
                  "Uncategorized"}{" "}
                - {t.description} - {t.type} - ${t.amount}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleEdit(t);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete(t.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
