// src/components/login/auth/input.jsx

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-green-900 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 
          bg-gray-50 
          border ${error ? "border-red-500" : "border-gray-300"} 
          rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition duration-200
        `}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
