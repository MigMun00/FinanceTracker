import Button from "./Button";

export default function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button size="sm" variant="outline" onClick={onEdit}>
        Edit
      </Button>
      <Button size="sm" variant="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
