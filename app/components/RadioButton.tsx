import React from "react";

interface RadioButtonProps {
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selectedOption,
  onChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center cursor-pointer space-x-2 text-gray"
        >
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={(e) => onChange(e.target.value)}
            className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-300"
          />
          <span className="text-sm md:text-base">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
