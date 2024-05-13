import React, { ComponentProps } from "react";
import { Autocomplete } from "@peculiar/react-components";
import { countries } from "../../config/data";

interface CountrySelectProps {
  onSelect: (code: string) => void;
  className?: ComponentProps<"div">["className"];
  label?: string;
  placeholder?: string;
}

export const CountrySelect: React.FunctionComponent<CountrySelectProps> = (
  props
) => {
  const { className, label, placeholder, onSelect } = props;
  return (
    <Autocomplete
      getOptionLabel={({ value }) => value}
      className={className}
      options={countries}
      onChange={(_, value) => onSelect(value?.code as string)}
      placeholder={placeholder}
      label={label}
    />
  );
};
