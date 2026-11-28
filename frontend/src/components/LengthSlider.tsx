import { MAX_WORDS, MIN_WORDS } from "../types/summary";

interface Props {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export default function LengthSlider({ value, disabled, onChange }: Props) {
  return (
    <div className={`length-slider${disabled ? " disabled" : ""}`}>
      <input
        type="range"
        className="length-slider-input"
        min={MIN_WORDS}
        max={MAX_WORDS}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-labelledby="length-slider-text"
      />
      <div className="length-slider-scale" aria-hidden="true">
        <span>{MIN_WORDS}</span>
        <span>{MAX_WORDS}</span>
      </div>
      <span id="length-slider-text" className="length-slider-text">
        Largo del resumen {value} {value === 1 ? "palabra" : "palabras"}
      </span>
    </div>
  );
}
