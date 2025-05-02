/* eslint-disable react/prop-types */

import { X } from "lucide-react";

const SelectInput = ({
  label,
  open,
  setOpen,
  value,
  onChange,
  options,
  removeItem,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>

      <div
        className={`custom-select ${
          open ? "max-h-[150px]" : "h-auto"
        } overflow-auto p-2 bg-gray-200 rounded-sm mt-2 `}
      >
        <ul className="options-list">
          <li
            onClick={setOpen}
            className="cursor-pointer  text-slate-500 text-sm"
          >
            {!value ? "Select Category" : value}
          </li>
          {open &&
            options?.map((option, index) => (
              <li
                className="cursor-pointer flex items-center justify-between hover:bg-blue-400 px-2 text-sm rounded-sm hover:text-slate-100"
                key={index}
                value="option2"
              >
                <span
                  className="inline-block"
                  onClick={() => onChange(option?.label)}
                >
                  {option?.label}
                </span>

                <button onClick={(e) => removeItem(option?._id, e)}>
                  <X size={15} />
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectInput;
