import { useState, useEffect } from "react";
import Button from "../components/Button";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        await updateCategory(editingId, { name });
      } else {
        await createCategory({ name });
      }

      setName("");
      setEditingId(null);
      await loadCategories();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category.id);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Categories Manager</h1>

      {/* Form */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update" : "Add"}
        </Button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center border px-3 py-2 rounded"
          >
            <span>{category.name}</span>

            <div className="flex gap-2">
              <Button onClick={() => handleEdit(category)} variant="outline">
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(category.id)}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
