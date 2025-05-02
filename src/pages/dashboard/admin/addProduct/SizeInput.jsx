/* eslint-disable react/prop-types */
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

const SizeInput = ({ label, onChange, options, removeSize, selectedItems }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        {options
          ?.sort((a, b) => a.value - b.value)
          ?.map((item) => (
            <div
              className="flex items-center gap-1 group relative "
              key={item?._id}
            >
              <Checkbox
                checked={selectedItems?.includes(item?.value)}
                onCheckedChange={(event) => onChange(event, item?.value)}
                id={item?.label}
              />
              <label
                htmlFor={item?.label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item?.label}
              </label>

              <button
                type="button"
                onClick={(event) => removeSize(event, item?._id)}
                className="hidden group-hover:block bg-orange-500 text-white  rounded absolute -top-4 left-0 z-10"
              >
                <X size={15} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SizeInput;
