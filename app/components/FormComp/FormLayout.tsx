import Header from "../Header";
import StudentDetails from "./StudentDetails";

export default function FormLayout() {
  return (
    <>
      <div className="min-h-screen font-sans pb-20">
        <Header />
        <main className="max-w-4xl mx-auto px-2 mt-2 space-y-6">
          <StudentDetails />
        </main>
      </div>
    </>
  );
}
