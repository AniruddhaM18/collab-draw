import { Input } from "@repo/ui/components/input";

const FormInput = ({
  id,
  name,
  type,
  placeholder,
  required,
}: {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) => {
  return (
    <Input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="focus-visible:border-blue-400/20 focus-visible:ring-blue-400/10"
    />
  );
};

export default FormInput;