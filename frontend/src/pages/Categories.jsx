import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import RowActions from "../components/RowActions";
import { useListCRUD } from "../hooks/useListCRUD";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category";

export default function Categories() {
  const {
    items: categories,
    editingId,
    setEditingId,
    loading,
    setLoading,
    load,
    handleDelete,
  } = useListCRUD(getCategories, deleteCategory);

  const [name, setName] = useState("");

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
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category.id);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">
        {editingId ? "Edit" : "Add"} Category
      </h1>

      {/* Form */}
      <div className="flex gap-2 mb-10">
        <Input
          wrapperClassName="flex-1"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update" : "Add"}
        </Button>
      </div>

      <h2 className="text-2xl mb-5">My Categories</h2>
      {/* List */}
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center border px-3 py-2 rounded"
          >
            <span>{category.name}</span>
            <RowActions
              onEdit={() => handleEdit(category)}
              onDelete={() => handleDelete(category.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
