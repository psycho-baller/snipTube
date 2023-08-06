import { useState, type ChangeEvent, type FC, type Dispatch, type SetStateAction } from "react";

interface Props {
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
  className?: string;
  updateData?: (note: string) => void;
  defaultHeight?: number;
  [key: string]: any;
}

const DynamicTextarea: FC<Props> = (props) => {
  const { note, setNote, className, updateData, defaultHeight = 2, ...rest } = props;

  // const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [onFocus, setOnFocus] = useState<boolean>(false);
  const [rows, setRows] = useState(1);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setRows(event.target.value.split("\n").length);
    setNote(event.target.value);
    if (updateData) {
      updateData(event.target.value);
    }
  };

  const handleBlur = () => {
    setOnFocus(false);
  };
  return (
    <textarea
      // ref={textareaRef}
      // if focused, show the full text, otherwise show the first line and ellipsis as long as there are characters in the first line
      value={
        onFocus
          ? note
          : // eslint-disable-next-line unicorn/no-nested-ternary
          note.split("\n")[0]
          ? note.split("\n")[0] + "..."
          : ""
      }
      name="note"
      onChange={handleChange}
      onFocus={() => setOnFocus(true)}
      onBlur={handleBlur}
      placeholder="Write your note here..."
      role="textbox"
      aria-multiline="true"
      rows={1}
      {...rest}
      // if not focused, set the height to defaultHeight * 1.5rem (1 line)
      // if focused, set the height to the number of rows * 1.8rem
      // unless the number of rows is less than 4, then set the height to 4 * 1.8rem
      // (focus state has at least 4 lines)
      style={{
        height: ((onFocus ? (rows < 4 ? 4 : rows) : defaultHeight) * 1.5).toString() + "rem",
      }}
      className={
        "transition-all border border-gray-600 focus:rounded-xl rounded-md resize-none focus:outline-none overflow-x-hidden overflow-y-auto scrollbar scrolling-touch w-full bg-gray-700 text-gray-400 focus:bg-gray-900 focus:text-gray-300 placeholder-gray-500 focus:placeholder-transparent max-h-60 overflow-hidden ease-in-out duration-300 focus:ring-3 focus:ring-gray-600 " +
        className
      }
    />
  );
};

export default DynamicTextarea;
