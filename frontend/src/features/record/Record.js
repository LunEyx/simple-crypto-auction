import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import InputWithLabel from '../../common/InputWithLabel';
import {
  getAccountBalance, getTxList, getTokenTx, getTokenNftTx, getTokenBalance,
  getAddressTokenBalance, getAddressTokenNftBalance, getTxReceiptStatus,
  getTokenHolderList, getTokenInfo, getTokenSupply, getTokenCSupply
} from './api';
import './Record.css';

const options = [
  { name: 'Account Balance', api: getAccountBalance, address: true },
  { name: 'Transaction List', api: getTxList, address: true },
  { name: 'BEP-20 Token Transaction', api: getTokenTx, address: true, contractAddress: true },
  { name: 'BEP-721 Token Transaction', api: getTokenNftTx, address: true, contractAddress: true },
  { name: 'Token Balance', api: getTokenBalance, address: true, contractAddress: true },
  { name: 'Address BEP-20 Token Holding', api: getAddressTokenBalance, address: true },
  { name: 'Address BEP-721 Token Holding', api: getAddressTokenNftBalance, address: true },
  { name: 'Get Transaction Receipt Status', api: getTxReceiptStatus, txHash: true },
  { name: 'Token Holder List', api: getTokenHolderList, contractAddress: true },
  { name: 'Token Info', api: getTokenInfo, contractAddress: true },
  { name: 'BEP-20 Token Supply', api: getTokenSupply, contractAddress: true },
  { name: 'BEP-20 Token CirculatingSupply', api: getTokenCSupply, contractAddress: true }
];

const Record = (props) => {
  const [address, setAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isAddressEnabled, setIsAddressEnabled] = useState(options[0].address);
  const [isContractAddressEnabled, setIsContractAddressEnabled] = useState(options[0].contractAddress);
  const [isTxHashEnabled, setIsTxHashEnabled] = useState(options[0].txhash);
  const [currentOption, setCurrentOption] = useState(options[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [apiFn, setApiFn] = useState(() => (params) => options[0].api(params));
  let columns = [];

  const handleChangeDisplay = async (option) => {
    option.address ? setIsAddressEnabled(true) : setIsAddressEnabled(false);
    option.contractAddress ? setIsContractAddressEnabled(true) : setIsContractAddressEnabled(false);
    option.txHash ? setIsTxHashEnabled(true) : setIsTxHashEnabled(false);
    setApiFn(() => (params) => option.api(params));
    setCurrentOption(option.name);
  }

  const handleSearchButton = async (params) => {
    setIsLoading(true);
    setData([]);
    try {
      const response = await apiFn(params);
      if (response.status === '1') {
        setData(response.result);
        setErrMsg('');
      } else {
        setErrMsg(response.message);
      }
    } catch (err) {
      setErrMsg(err);
    }
    setIsLoading(false);
  }

  if (data.length > 0) {
    columns = Object.keys(data[0]).map((key) => {
      const splitedKey = key.replace(/([A-Z])/g, ' $1');
      const name = splitedKey.charAt(0).toUpperCase() + splitedKey.slice(1);
      return {
        name,
        selector: (row) => row[key],
        width: '200px',
        wrap: true
      }
    });
  }

  let tempData = data;
  if (typeof data !== 'object') {
    tempData = { result: data };
  }
  if (!Array.isArray(data)) {
    tempData = [tempData];
  }
  if (tempData !== data) {
    setData(tempData);
  }

  return (
    <div>
      <hr />
      <h1>Record</h1>
      <h3>Select To Display</h3>
      {options.map((option) => (
        <button key={option.name} disabled={isLoading || currentOption === option.name} onClick={() => handleChangeDisplay(option)}>{option.name}</button>
      ))
      }
      <div className='recordSearchCriteria'>
        {isAddressEnabled ? (
          <InputWithLabel name='address' displayName='Address' value={address} onChange={ (e) => setAddress(e.target.value) } />
        ) : null}
        {isContractAddressEnabled ? (
          <InputWithLabel name='contractAddress' displayName='Contract Address' value={contractAddress} onChange={ (e) => setContractAddress(e.target.value) } />
        ) : null}
        {isTxHashEnabled ? (
          <InputWithLabel name='txHash' displayName='Transaction Hash' value={txHash} onChange={ (e) => setTxHash(e.target.value) } />
        ) : null}
        <button disabled={isLoading} onClick={() => handleSearchButton({ address, contractAddress, txHash })}>Search</button>
        <div>{errMsg}</div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
      />
    </div>
  );
};

export default Record;