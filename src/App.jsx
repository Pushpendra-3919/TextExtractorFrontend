import React from "react";
import FileUploader from "./components/FileUploader";
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-5">
      <h1 className="text-2xl font-bold text-red-800 mb-4">File Upload System</h1>
      <FileUploader />
    </div>
  );
}

export default App;



