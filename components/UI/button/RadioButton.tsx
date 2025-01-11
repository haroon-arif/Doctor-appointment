import clsx from "clsx";
import React from "react";

interface Item {
  key: string;
  label: string;
  selected: boolean;
}

interface Props {
  name: string;
  onChange: (value: any) => void;
  options: Item[];
  className?: string;
}

const RadioButton = ({ name, onChange, options, className }: Props) => {
  if (options.length > 0) {
    return (
      <div className={clsx("flex items-center justify-start gap-6", className)}>
        {options.map((item, index) => (
          <div key={index} className="flex items-center justify-center gap-3">
            <input
              id={`${item.key}`}
              type="radio"
              value=""
              name={name}
              checked={item.selected}
              className="w-5 h-5 accent-accent"
              onChange={() => onChange(item.key)}
            />
            <label
              htmlFor={item.key}
              className="text-sm text-800 cursor-pointer"
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default RadioButton;
