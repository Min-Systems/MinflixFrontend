import { useState } from "react";

function ButtonComponent({ onClick, isLoading }) {
  return (
    <button 
      onClick={onClick} 
      className="w-32 h-12 bg-black text-white rounded-none text-lg"
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Fetch Films'}
    </button>
  );
}

function TextAreaComponent({ text }) {
  return <textarea value={text} readOnly className="w-full h-32 p-2 border rounded-lg text-lg" />;
}

export default function App() {
  const [text, setText] = useState("Click button to fetch films");
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = async () => {
  setIsLoading(true);
  setText("Fetching films...");
  
  try {
    console.log("Attempting to fetch films from backend...");
    
    const response = await fetch("https://minflixbackend-611864661290.us-west2.run.app/films", {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://minflixhd.web.app'
      }
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}...`);
    }
    
    const data = await response.json();
    console.log("Received data:", data);
    
    if (Array.isArray(data)) {
      const textResult = data.map(film => film.name).join('\n');
      setText(textResult || "No films found in database");
    } else {
      setText("Unexpected data format received");
      console.error("Unexpected data format:", data);
    }
  } catch (error) {
    console.error("Error details:", error);
    setText(`Error fetching films: ${error.message}\n\nPlease check the browser console for more details.`);
    console.log("Error name: ", error.name);
    console.log("Error stack: ", error.stack);
  } finally {
    setIsLoading(false);
  }
};
  
  return (
    <div className="p-4 space-y-4 flex flex-col items-center">
      <TextAreaComponent text={text} />
      <ButtonComponent onClick={handleFetchData} />
    </div>
  );
}
