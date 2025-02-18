import { useState } from "react";

function ButtonComponent({ onClick }) {
  return <button onClick={onClick} className="w-32 h-12 bg-black text-white rounded-none text-lg">Fetch Films</button>;
}

function TextAreaComponent({ text }) {
  return <textarea value={text} readOnly className="w-full h-32 p-2 border rounded-lg text-lg" />;
}

export default function App() {
  const [text, setText] = useState("Click button to fetch films");

  const handleFetchData = async () => {
    try {
      const response = await fetch("https://minflixbackend-611864661290.us-west2.run.app/films");
      const data = await response.json();
      let textResult = "";
      for (let i = 0; i < data.length; i++) {
        textResult += data[i].name + "\n";
      }
      setText(textResult || "No films found");
    } catch (error) {
      console.log("Error", error.stack);
      console.log("Error", error.name);
      console.log("Error", error.message);
      setText("Error fetching films");
    }
  };

  return (
    <div className="p-4 space-y-4 flex flex-col items-center">
      <TextAreaComponent text={text} />
      <ButtonComponent onClick={handleFetchData} />
    </div>
  );
}
