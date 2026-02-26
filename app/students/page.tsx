const StudentPage = () => {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Student Application Form</h1>

      <p className="text-gray-600 mb-6">
        (We will build the full form step-by-step)
      </p>

      <div className="bg-white p-6 rounded shadow">
        <input className="border p-2 w-full mb-4" placeholder="Full Name" />

        <input type="date" className="border p-2 w-full mb-4" />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Save & Continue
        </button>
      </div>
    </main>
  );
};
export default StudentPage;
