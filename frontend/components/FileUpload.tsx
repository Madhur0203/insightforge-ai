"use client";

type Props = {
  file: File | null;
  setFile: (file: File | null) => void;
  onAnalyze: () => void;
  loading: boolean;
};

export default function FileUpload({ file, setFile, onAnalyze, loading }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
      <h2 className="mb-3 text-2xl font-bold">Upload Dataset</h2>
      <p className="mb-4 text-sm text-slate-300">
        Upload CSV, Excel, or SQL data and let InsightForge analyze it automatically.
      </p>

      <input
        type="file"
        accept=".csv,.xlsx,.xls,.sql,.json"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm"
      />

      {file && (
        <p className="mb-4 text-sm text-cyan-300">
          Selected: {file.name}
        </p>
      )}

      <button
        onClick={onAnalyze}
        disabled={!file || loading}
        className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Dataset"}
      </button>
    </div>
  );
}