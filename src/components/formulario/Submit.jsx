export default function Submit({value = "Guardar"}) {
  return (
    <input
      type="submit"
      className="formulario__submit"
      value={value}
    />
  );
}