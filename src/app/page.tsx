import DailyCard from "../components/DailyCard";


export default function Page() {
  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
      <DailyCard />
    </div>
  );
}
