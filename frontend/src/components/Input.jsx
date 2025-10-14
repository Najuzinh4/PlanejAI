export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm text-gray-600">{label}</span>}
      <input
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}