const InputWithLabel = (props) => {
  const { name, displayName, value, onChange } = props;
  return (
    <>
      <label htmlFor={name}>{displayName}: </label>
      <input id={name} value={value} onChange={onChange}/>
    </>
  );
};

export default InputWithLabel;