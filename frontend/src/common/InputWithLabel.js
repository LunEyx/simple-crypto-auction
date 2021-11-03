const InputWithLabel = (props) => {
  const { name, displayName, value, onChange } = props;
  return (
    <div>
      <label htmlFor={name}>{displayName}: </label>
      <input id={name} value={value} onChange={onChange}/>
    </div>
  );
};

export default InputWithLabel;