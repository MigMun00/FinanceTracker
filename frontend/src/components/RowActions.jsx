import Button from "./Button";

export default function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
