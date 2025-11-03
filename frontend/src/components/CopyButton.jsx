import React from "react";
export default function CopyButton({ text='' }){
  return (
    <button type="button" className="ml-2 rounded-md border px-3 py-2 text-sm disabled:opacity-50" disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>Copiar</button>
  );
}
