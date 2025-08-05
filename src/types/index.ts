export type FieldConfig = {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    validator?: (value: string | number | Date | null) => string;
  };
  