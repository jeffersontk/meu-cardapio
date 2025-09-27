import GroceryList from "@/components/GroceryList";

export default function MercadoPage() {
  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
      <GroceryList />
    </div>
  );
}
