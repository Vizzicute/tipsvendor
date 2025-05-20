import { Button } from "@/components/ui/button";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export function Filter({ options, selectedValue, onValueChange }: FilterProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selectedValue === option.value ? "default" : "outline"}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
} 