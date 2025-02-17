// components/SaveButton.jsx
import { FaSave } from 'react-icons/fa';

export default function SaveButton() {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <FaSave className="text-xl" />
      <span>Save</span>
    </button>
  );
}
