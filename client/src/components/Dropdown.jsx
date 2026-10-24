
import { useState, useRef, useEffect } from "react";

export default function MultiSelect({
  label,
  options,
  value = [],
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const toggleOption = (option) => {
    const selected = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(selected);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-gray-900"
      >
        <span className="truncate">
          {value.length > 0
            ? `${value.length} selected: ${value.join(", ")}`
            : `Select ${label.toLowerCase()}...`}
        </span>

        <span className="ml-2" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {options.map((option) => {
            const checked = value.includes(option);

            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option)}
                  className="h-4 w-4"
                />

                <span className="text-sm text-gray-800">
                  {option}
                </span>
              </label>
            );
          })}

          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-2 w-full border-t border-gray-200 px-2 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
            >
              Clear selections
            </button>
          )}
        </div>
      )}
    </div>
  );
}
