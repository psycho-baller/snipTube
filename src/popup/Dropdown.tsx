import { type FC, useEffect, useRef, useState } from "react";
import { sortByOptions } from "~lib/constants";
import { useSnipsStore } from "~stores/sniptube";

interface Props {}

const DropdownButton: FC<Props> = (props) => {
  const {} = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sortBy = useSnipsStore((state) => state.sortBy);
  const setSortBy = useSnipsStore((state) => state.setSortBy);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      className="relative h-min w-min"
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

      <ul
        className={
          "absolute w-24 right-0 py-2 mt-2 bg-gray-800 rounded-md shadow-lg origin-top duration-200 z-10" +
          (isOpen ? " scale-100 " : " scale-0")
        }
      >
        {sortByOptions.map((option) => (
          <li
            key={option}
            onClick={() => {
              setSortBy(option);
              setIsOpen(false);
            }}
            className={
              "block cursor-pointer px-4 py-2 text-sm text-gray-50 hover:bg-gray-700" +
              (sortBy === option ? " bg-cyan-700" : "")
            }
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownButton;
