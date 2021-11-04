import Dropdown from 'react-multilevel-dropdown';
import InputWithLabel from "./InputWithLabel";
import { createDropdownItems } from "./Dropdown";
import { displayHash } from './util';

const AddressInput = (props) => {
  const { name, displayName, address, addressName, onChange, dropdownOptions, dropdownOnClick } = props;

  const handleDropdownItem = (key, value) => {
    document.getElementById(name + 'Dropdown').click();
    dropdownOnClick(key, value);
  }

  return (
    <>
      <InputWithLabel name={name + 'Input'} displayName={displayName} value={address} onChange={(e) => onChange(e.target.value)} />
      <Dropdown id={name + 'Dropdown'} title={'Select ' + displayName} position='right'>
        {createDropdownItems(dropdownOptions, handleDropdownItem)}
      </Dropdown>
      {addressName !== '' ? (
        <span>{displayHash(address, addressName)}</span>
      ) : null}
    </>
  );
};

export default AddressInput;