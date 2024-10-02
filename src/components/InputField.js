export default function InputField({ label, type = "text", placeholder, value, onChange }) {
    return (
      <div className="mb-4 text-left">
        <label className="block text-white-700 text-sm font-bold mb-2">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="shadow appearance-none border rounded w-96 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    );
}
