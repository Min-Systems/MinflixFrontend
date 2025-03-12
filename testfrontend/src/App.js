import { useState } from "react";

function ButtonComponent({ onClick, isLoading, text }) {
  return (
    <button 
      onClick={onClick} 
      className="w-32 h-12 bg-black text-white rounded-none text-lg"
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : text}
    </button>
  );
}

function TextAreaComponent({ text }) {
  return <textarea value={text} readOnly className="w-full h-72 p-2 border rounded-lg text-lg" />;
}

export default function App() {
  const [text, setText] = useState("Click button to fetch data");
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchFilms = async () => {
    setIsLoading(true);
    setText("Fetching films...");
    
    try {
      console.log("Attempting to fetch films from backend...");
      
      const response = await fetch("https://minflixbackend-611864661290.us-west2.run.app/films", {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain'
        },
        mode: 'cors'
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}...`);
      }
      
      // Check the content type to determine how to parse the response
      const contentType = response.headers.get("content-type");
      console.log("Content type:", contentType);
      
      let data;
      if (contentType && contentType.includes("application/json")) {
        // Parse as JSON
        data = await response.json();
        console.log("Received JSON data:", data);
        
        if (Array.isArray(data)) {
          // Format the film data into a detailed text format similar to users endpoint
          let textResult = "";
          
          data.forEach(film => {
            // Film basic details
            textResult += `id: ${film.id}, title: ${film.title || film.name}, length: ${film.length || "unknown"} min\n`;
            textResult += `location: ${film.technical_location || "unknown"}, producer: ${film.producer || "unknown"}\n`;
            
            // Cast information
            textResult += "Cast:\n";
            if (film.film_cast && film.film_cast.length > 0) {
              film.film_cast.forEach(cast => {
                textResult += `  ${cast.name} as ${cast.role}\n`;
              });
            } else {
              textResult += "  No cast information available\n";
            }
            
            // Production team
            textResult += "Production Team:\n";
            if (film.production_team && film.production_team.length > 0) {
              film.production_team.forEach(member => {
                textResult += `  ${member.name} - ${member.role}\n`;
              });
            } else {
              textResult += "  No production team information available\n";
            }
            
            textResult += "\n"; // Add a blank line between films
          });
          
          setText(textResult || "No films found in database");
        } else {
          setText("Unexpected data format received");
          console.error("Unexpected data format:", data);
        }
      } else {
        // Treat as plain text
        const textData = await response.text();
        console.log("Received text data:", textData);
        setText(textData || "No films found in database");
      }
    } catch (error) {
      console.error("Error details:", error);
      setText(`Error fetching films: ${error.message}\n\nPlease check the browser console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchUsers = async () => {
    setIsLoading(true);
    setText("Fetching users...");
    
    try {
      console.log("Attempting to fetch users from backend...");
      
      const response = await fetch("https://minflixbackend-611864661290.us-west2.run.app/users", {
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        },
        mode: 'cors'
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}...`);
      }
      
      // For users, we expect plain text response
      const textData = await response.text();
      setText(textData || "No users found in database");
      
    } catch (error) {
      console.error("Error details:", error);
      setText(`Error fetching users: ${error.message}\n\nPlease check the browser console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 space-y-4 flex flex-col items-center">
      <TextAreaComponent text={text} />
      <div className="flex space-x-4">
        <ButtonComponent onClick={handleFetchFilms} isLoading={isLoading} text="Fetch Films" />
        <ButtonComponent onClick={handleFetchUsers} isLoading={isLoading} text="Fetch Users" />
      </div>
    </div>
  );
}