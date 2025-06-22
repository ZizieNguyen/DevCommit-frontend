export default function Campo({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false
}) {
  return (
    <div className="formulario__campo">
      <label 
        htmlFor={id}
        className="formulario__label"
      >
        {label}
      </label>
      <input 
        type={type}
        id={id}
        name={id}
        className="formulario__input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}