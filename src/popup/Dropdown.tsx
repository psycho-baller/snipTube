import { type FC, useEffect, useRef, useState } from "react";

interface Props {}

const DropdownButton: FC<Props> = (props) => {
  const {} = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("newest");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "end-time", label: "End time" },
    // { value: 'tag-a-z', label: 'Tag (A-Z)' },
    // { value: 'tag-z-a', label: 'Tag (Z-A)' },
    { value: "title-a-z", label: "Title (A-Z)" },
    { value: "title-z-a", label: "Title (Z-A)" },
  ];

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // TODO: improve design, esp color palette
  // TODO: actually sort the snips lol
  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center py-1 pr-4 space-x-2 text-base text-blue-500 rounded-md focus:outline-none"
      >
        Sort
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          focusable="false"
          fill="currentColor"
          className={`h-5 w-5 transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <path d="M4 7l1.41 1.41L8 5.83V13h2V5.83l2.59 2.58L14 7 9 2 4 7zm16 10l-1.41-1.41L16 18.17V11h-2v7.17l-2.59-2.58L10 17l5 5 5-5z"></path>
        </svg>
      </button>

      <div
        className={
          "absolute w-24 right-0 py-2 mt-2 bg-gray-800 rounded-md shadow-lg origin-top duration-200 z-10" +
          (isOpen ? " scale-100" : " scale-0")
        }
      >
        {options.map((option) => (
          <a
            href={`#${option.value}`}
            key={option.value}
            onClick={() => {
              setSelectedOption(option.value);
              setIsOpen(false);
            }}
            className={
              "block px-4 py-2 text-sm text-gray-50 hover:bg-gray-700" +
              (selectedOption === option.value ? " bg-green-700" : "")
            }
          >
            {option.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default DropdownButton;
