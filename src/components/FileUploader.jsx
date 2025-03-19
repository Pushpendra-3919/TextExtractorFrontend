import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { CloudUpload, FileText, XCircle, CheckCircle } from "lucide-react";
import { API_URL } from "../../config";

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, application/pdf",
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.filter(
        (file) => !files.some((existingFile) => existingFile.name === file.name)
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError("No files selected for upload.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
      setFiles([]);
    } catch (error) {
      console.error("Upload error", error);
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      {/* Drag and Drop Box */}
      <div
        {...getRootProps()}
        className="w-96 h-96 p-6 border-2 border-dashed border-purple-300 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 cursor-pointer hover:border-purple-500 flex flex-col items-center justify-center text-center shadow-lg transition-all hover:shadow-xl relative overflow-hidden"
      >
        <input {...getInputProps()} />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200 opacity-0 hover:opacity-100 transition-opacity"></div>
        <CloudUpload size={60} className="text-purple-500 mb-4 z-10" />
        <p className="text-purple-600 text-sm z-10">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-purple-400 text-xs mt-2 z-10">Supports: Images, PDFs</p>
      </div>

      {/* Selected Files Section */}
      {files.length > 0 && (
        <div className="bg-white mt-6 p-6 rounded-2xl shadow-md w-96">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-purple-800">
            Selected Files
          </h2>
          <ul className="space-y-3">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-purple-800"
              >
                <div className="flex items-center">
                  <FileText className="text-purple-600 mr-2" size={18} />
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XCircle size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={uploadFiles}
        className="mt-6 px-8 py-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading || files.length === 0}
      >
        {uploading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload Files"
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Upload Response */}
      {response && (
        <div className="mt-6 w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">
            Upload Response
          </h2>
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center">
            <CheckCircle size={18} className="mr-2" />
            {response.message}
          </div>
          {response.results && response.results.length > 0 && (
            <div className="mt-4 w-full">
              {response.results.map((file, index) => (
                <div
                  key={index}
                  className="p-6 my-4 rounded-2xl bg-white border-4 border-double border-purple-400 hover:border-purple-500 transition-all shadow-lg hover:shadow-xl"
                >
                  <p className="font-semibold text-purple-600 text-sm mb-4">
                    {file.filename}
                  </p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        textAlign: "justify", // Added for justified text
                      }}
                    >
                      {file.extractedText}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}