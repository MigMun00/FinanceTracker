import { useState, useEffect, useCallback } from "react";

export function useListCRUD(fetchFn, deleteFn) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchFn();
    setItems(data);
  }, [fetchFn]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = useCallback(
    async (id) => {
      await deleteFn(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [deleteFn],
  );

  return {
    items,
    setItems,
    editingId,
    setEditingId,
    loading,
    setLoading,
    load,
    handleDelete,
  };
}
