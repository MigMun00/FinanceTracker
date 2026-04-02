import { useState, useEffect } from "react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category";

export default function Categories() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    const newCategory = {
      name: "New Category",
    };
    await createCategory(newCategory);
  };

  return (
    <div>
      <h1>Categories Manager</h1>
      <Button variant="success" onClick={() => handleAddCategory()}>
        Add Category
      </Button>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>- {category.name}</li>
        ))}
      </ul>
    </div>
  );
}
