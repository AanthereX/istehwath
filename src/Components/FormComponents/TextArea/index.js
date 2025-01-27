/**
 * eslint-disable react/prop-types
 *
 * @format
 */

export default function TextArea({
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  loading,
  selected,
  disabled,
  errorText,
  autoComplete = "off",
  type = "text",
  col,
  className = "",
  row,
  ...props
}) {
  return (
    <div>
      <textarea
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} ${
          error && "border border-c_FF3333 font-general_regular font-normal"
        }`}
        required={required}
        disabled={disabled || loading}
        name={name}
        id={name}
        aria-autocomplete='none'
        autoComplete={autoComplete}
        autoFocus={false}
        rows={row}
        cols={col}
        {...props}
      />
      {error && <p className={"text-c_FF3333 text-fs_12 mt-0"}>{errorText}</p>}
    </div>
  );
}
