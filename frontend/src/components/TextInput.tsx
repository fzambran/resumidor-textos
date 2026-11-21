import { useState, type FormEvent } from "react";
import type { SummaryLength } from "../types/summary";

interface Props {
  loading: boolean;
  onSubmit: (text: string, length: SummaryLength) => void;
}

export default function TextInput({ loading, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [length, setLength] = useState<SummaryLength>("medio");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (text.trim()) onSubmit(text, length);
  }

  return (
    <form onSubmit={handleSubmit} className="text-input">
      <label htmlFor="texto">Texto a resumir</label>
      <textarea
        id="texto"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="Pega aquí el texto…"
      />
      <div className="controls">
        <label>
          Extensión:{" "}
          <select value={length} onChange={(e) => setLength(e.target.value as SummaryLength)}>
            <option value="corto">Corto</option>
            <option value="medio">Medio</option>
            <option value="largo">Largo</option>
          </select>
        </label>
        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Resumiendo…" : "Resumir"}
        </button>
      </div>
    </form>
  );
}
