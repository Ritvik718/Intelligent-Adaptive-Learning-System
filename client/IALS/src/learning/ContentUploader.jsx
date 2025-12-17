import React, { useState } from "react";
import { parsePDF } from "../utils/pdfParser";

export default function ContentUploader({ onContentLoaded }) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await parsePDF(file);
      onContentLoaded(text);
    } catch (err) {
      console.error("PDF parsing failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 space-y-3">
      <h3 className="text-indigo-300 font-semibold">
        Upload Learning Material
      </h3>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="block w-full text-sm text-slate-300
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:bg-indigo-600 file:text-white
                   hover:file:bg-indigo-500"
      />

      {loading && <p className="text-sm text-slate-400">Extracting content…</p>}

      {fileName && !loading && (
        <p className="text-xs text-slate-400">
          Loaded: <span className="text-slate-300">{fileName}</span>
        </p>
      )}
    </div>
  );
}
