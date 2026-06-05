import { useState } from "react";
import { translateSpanishToEnglish } from "../utils/groqTranslate";

const TranslatedField = ({
  label,
  nameEs,
  nameEn,
  valueEs = "",
  valueEn = "",
  onChange,
  multiline = false,
  required = false,
  placeholderEs = "",
  placeholderEn = "",
  className = "",
}) => {
  const [translating, setTranslating] = useState(false);
  const Field = multiline ? "textarea" : "input";
  const sharedClassName = `${className || "border p-2 rounded w-full"} ${multiline ? "min-h-[96px]" : ""}`.trim();

  const handleTranslate = async () => {
    try {
      setTranslating(true);
      const translatedText = await translateSpanishToEnglish(valueEs);
      onChange({ target: { name: nameEn, value: translatedText } });
    } catch (error) {
      alert(error.message);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-black text-slate-700">{label}</label>
        <button
          type="button"
          onClick={handleTranslate}
          className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={translating || !valueEs?.trim()}
        >
          {translating ? "Traduciendo..." : "Generar EN"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <span className="mb-1 block text-xs font-black uppercase text-slate-500">Español</span>
          <Field
            type={multiline ? undefined : "text"}
            name={nameEs}
            value={valueEs}
            onChange={onChange}
            className={sharedClassName}
            placeholder={placeholderEs}
            required={required}
          />
        </div>
        <div>
          <span className="mb-1 block text-xs font-black uppercase text-slate-500">English</span>
          <Field
            type={multiline ? undefined : "text"}
            name={nameEn}
            value={valueEn}
            onChange={onChange}
            className={sharedClassName}
            placeholder={placeholderEn}
          />
        </div>
      </div>
    </div>
  );
};

export default TranslatedField;
