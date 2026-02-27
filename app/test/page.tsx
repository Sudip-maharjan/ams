import Image from "next/image";
const card = () => {
  return (
    <div className="bg-white border-2 border-gray-300 h-100 w-75 absolute left-100">
      <div className="relative h-60">
        <img
          src="/building.jpg"
          className="absolute object-cover h-full w-full"
          alt="building"
        />
        <div className="absolute z-99 bottom-0 bg-red-500 px-3 py-1 text-white font-bold uppercase font-sans text-sm">
          Category
        </div>
      </div>
      <div className="p-5 tracking-wide font-sans">
        <h2 className="font-bold text-lg">Title Goes Here</h2>
        <p className="text-red-500 text-sm">And Subtitle Goes Here.</p>
      </div>
      <div className="px-5 pt-10 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-xs text-gray-400 tracking-widest">
          6 mins ago
        </span>
      </div>
    </div>
  );
};
export default card;
