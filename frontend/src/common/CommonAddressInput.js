import Dropdown from 'react-multilevel-dropdown';
import InputWithLabel from "./InputWithLabel";
import { createDropdownItems } from "./Dropdown";
import { displayHash } from './util';
import { useSelector } from 'react-redux';
import { selectRecord } from '../features/record/recordSlice';

const CommonAddressInput = (props) => {
  const { name, displayName, disableWallet, disableContract, address, onChange, walletDropdownOptions, contractDropdownOptions, dropdownOnClick } = props;
  const record = useSelector(selectRecord);
  const addressName = record.addressDictionary[address] || '';

  const handleWalletDropdownItem = (key, value) => {
    document.getElementById(name + 'WalletDropdown').click();
    dropdownOnClick(key, value);
  }

  const handleContractDropdownItem = (key, value) => {
    document.getElementById(name + 'ContractDropdown').click();
    dropdownOnClick(key, value);
  }

  return (
    <>
      <InputWithLabel name={name + 'Input'} displayName={displayName} value={address || ''} onChange={(e) => onChange(e.target.value)} />
      {disableWallet ? null : (
        <Dropdown id={name + 'WalletDropdown'} title={'Select Address'} position='right'>
          {createDropdownItems(walletDropdownOptions, handleWalletDropdownItem)}
        </Dropdown>
      )}
      {disableContract ? null : (
        <Dropdown id={name + 'ContractDropdown'} title={'Select Contract Address'} position='right'>
          {createDropdownItems(contractDropdownOptions, handleContractDropdownItem)}
        </Dropdown>
      )}
      {addressName !== '' ? (
        <span>{displayHash(address, addressName)}</span>
      ) : null}
    </>
  );
};

export default CommonAddressInput;