import { useEffect, useRef } from "react";

interface Props {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

export default function TextInput({ value, disabled, onChange }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => ref.current?.focus(), []);

  // Tras pegar un texto largo, vuelve al inicio para que se lea desde el principio.
  function handlePaste() {
    setTimeout(() => {
      if (ref.current) ref.current.scrollTop = 0;
    }, 0);
  }

  return (
    <textarea
      ref={ref}
      className="text-area"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onPaste={handlePaste}
      placeholder="Pegar el texto aquí"
      aria-label="Texto a resumir"
    />
  );
}
