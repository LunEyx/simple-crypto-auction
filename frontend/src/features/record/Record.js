import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DateTimePicker from 'react-datetime-picker';
import InputWithLabel from '../../common/InputWithLabel';
import { CellWithCopy } from '../../common/CopyToClipboardButton';
import { displayHash } from '../../common/util';
import AddressInput from '../../common/AddressInput';
import CommonAddressInput from '../../common/CommonAddressInput';
import { BSCSCAN_URL } from './constants';
import {
  getWalletAddressData, getContractAddressData,
  getAccountBalance, getTxList, getTokenTx, getTokenNftTx, getTokenBalance,
  getAddressTokenBalance, getAddressTokenNftBalance, getTxReceiptStatus,
  getTokenHolderList, getTokenInfo, getTokenSupply, getTokenCSupply
} from './api';
import './Record.css';

const options = [
  { name: 'Account Balance', api: getAccountBalance, address: true },
  { name: 'Transaction List', api: getTxList, address: true, filter: ['contractAddress', 'timeStamp', 'from', 'to'] },
  { name: 'BEP-20 Token Transaction', api: getTokenTx, address: true, contractAddress: true, filter: ['timeStamp', 'from', 'to'] },
  { name: 'BEP-721 Token Transaction', api: getTokenNftTx, address: true, contractAddress: true, filter: ['timeStamp', 'from', 'to'] },
  { name: 'Token Balance', api: getTokenBalance, address: true, contractAddress: true },
  { name: 'Address BEP-20 Token Holding', api: getAddressTokenBalance, address: true, filter: ['TokenAddress'] }, 
  { name: 'Address BEP-721 Token Holding', api: getAddressTokenNftBalance, address: true, filter: ['TokenAddress'] },
  { name: 'Get Transaction Receipt Status', api: getTxReceiptStatus, txHash: true },
  { name: 'Token Holder List', api: getTokenHolderList, contractAddress: true, filter: ['TokenHolderAddress'] },
  { name: 'Token Info', api: getTokenInfo, contractAddress: true },
  { name: 'BEP-20 Token Supply', api: getTokenSupply, contractAddress: true },
  { name: 'BEP-20 Token CirculatingSupply', api: getTokenCSupply, contractAddress: true }
];

const Record = (props) => {
  const [address, setAddress] = useState('');
  const [addressName, setAddressName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [contractAddressName, setContractAddressName] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isAddressEnabled, setIsAddressEnabled] = useState(options[0].address);
  const [isContractAddressEnabled, setIsContractAddressEnabled] = useState(options[0].contractAddress);
  const [isTxHashEnabled, setIsTxHashEnabled] = useState(options[0].txhash);
  const [currentOption, setCurrentOption] = useState(options[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [apiFn, setApiFn] = useState(() => (params) => options[0].api(params));
  const [addressDictionary, setAddressDictionary] = useState({});
  const [walletAddressOptions, setWalletAddressOptions] = useState({});
  const [contractAddressOptions, setContractAddressOptions] = useState({});
  const [walletAddressDictionary, setWalletAddressDictionary] = useState({});
  const [contractAddressDictionary, setContractAddressDictionary] = useState({});
  const [filter, setFilter] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  let columns = [];
  let filteredData = data;

  useEffect(() => {
    const fetchData = async () => {
      let dictionary = {};
      let data = await getWalletAddressData();
      setWalletAddressOptions(data.options);
      setWalletAddressDictionary(data.dictionary);
      dictionary = data.dictionary;
      data = await getContractAddressData();
      setContractAddressOptions(data.options);
      setContractAddressDictionary(data.dictionary);
      dictionary = { ...dictionary, ...data.dictionary }
      setAddressDictionary(dictionary)
    };
    fetchData();
  }, []);

  const handleChangeDisplay = async (option) => {
    option.address ? setIsAddressEnabled(true) : setIsAddressEnabled(false);
    option.contractAddress ? setIsContractAddressEnabled(true) : setIsContractAddressEnabled(false);
    option.txHash ? setIsTxHashEnabled(true) : setIsTxHashEnabled(false);
    option.filter ? setFilter(option.filter) : setFilter([]);
    setApiFn(() => (params) => option.api(params));
    setCurrentOption(option.name);
  }

  const handleSearchButton = async (params) => {
    setIsLoading(true);
    setData([]);
    setFilterCriteria({});
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
      const result = {
        name,
        selector: (row) => row[key],
        wrap: true,
        sortable: true,
        width: '200px'
      };
      if (['from', 'to', 'contractAddress', 'TokenAddress', 'TokenHolderAddress'].includes(key)) {
        result.cell = (row) => {
          const walletName = walletAddressDictionary[row[key]];
          const contractName = contractAddressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return row[key];
          }
          let displayText = <a href={BSCSCAN_URL + 'address/' + row[key]} target='_blank' className='noDecoLink'>{displayHash(row[key], walletName || contractName)}</a>
          return <CellWithCopy type='address' text={row[key]} displayText={displayText} />
        }
      } else if (['hash'].includes(key)) {
        result.cell = (row) => {
          const walletName = walletAddressDictionary[row[key]];
          const contractName = contractAddressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return displayHash(row[key], walletName || contractName)
          }
          let displayText = <a href={BSCSCAN_URL + 'tx/' + row[key]} target='_blank' className='noDecoLink'>{displayHash(row[key], walletName || contractName)}</a>
          return <CellWithCopy text={row[key]} displayText={displayText} />
        }
      } else if (['blockHash'].includes(key)) {
        result.cell = (row) => {
          const walletName = walletAddressDictionary[row[key]];
          const contractName = contractAddressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return displayHash(row[key], walletName || contractName)
          }
          let displayText = <a href={BSCSCAN_URL + 'block/' + row[key]} target='_blank' className='noDecoLink'>{displayHash(row[key], walletName || contractName)}</a>
          return <CellWithCopy text={row[key]} displayText={displayText} />
        }
      } else if (['input'].includes(key)) {
        result.cell = (row) => {
          const walletName = walletAddressDictionary[row[key]];
          const contractName = contractAddressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return displayHash(row[key], walletName || contractName)
          }
          return <CellWithCopy text={row[key]} displayText={displayHash(row[key], walletName || contractName)} />
        }
      } else if (['timeStamp'].includes(key)) {
        result.cell = (row) => new Date(parseInt(row[key] + '000')).toLocaleString();
      }
      return result;
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

  const handleWalletDropdownClick = (key, value) => {
    setAddressName(key);
    setAddress(value);
  }

  const handleContractDropdownClick = (key, value) => {
    setContractAddressName(key);
    setContractAddress(value);
  }

  const handleAddressChange = (address) => {
    setAddress(address);
    setAddressName(walletAddressDictionary[address]);
  }

  const handleContractAddressChange = (address) => {
    setContractAddress(address);
    setContractAddressName(contractAddressDictionary[address]);
  }

  const handleFilterChange = (key, value) => {
    const newFilterCriteria = { ...filterCriteria, [key]: value };
    setFilterCriteria(newFilterCriteria);
  }

  const handleFilterDropdownClick = (key) => {
    return (name, address) => {
      const newFilterCriteria = { ...filterCriteria, [key]: address };
      setFilterCriteria(newFilterCriteria);
    }
  }

  for (const criteria of filter) {
    if (criteria === 'timeStamp') {
      if (!!filterCriteria['startDateTime']) {
        filteredData = filteredData.filter((row) => row[criteria] * 1000 >= filterCriteria['startDateTime'].getTime());
      }
      if (!!filterCriteria['endDateTime']) {
        filteredData = filteredData.filter((row) => row[criteria] * 1000 <= filterCriteria['endDateTime'].getTime());
      }
    } else if (!!filterCriteria[criteria]) {
      filteredData = filteredData.filter((row) => row[criteria].startsWith(filterCriteria[criteria]));
    }
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
          <div>
            <AddressInput
              name='searchAddress'
              displayName='Address'
              address={address}
              addressName={addressName}
              onChange={handleAddressChange}
              dropdownOptions={walletAddressOptions}
              dropdownOnClick={handleWalletDropdownClick}
            />
          </div>
        ) : null}
        {isContractAddressEnabled ? (
          <div>
            <AddressInput
              name='searchContractAddress'
              displayName='Contract Address'
              address={contractAddress}
              addressName={contractAddressName}
              onChange={handleContractAddressChange}
              dropdownOptions={contractAddressOptions}
              dropdownOnClick={handleContractDropdownClick}
            />
          </div>
        ) : null}
        {isTxHashEnabled ? (
          <InputWithLabel name='txHash' displayName='Transaction Hash' value={txHash} onChange={ (e) => setTxHash(e.target.value) } />
        ) : null}
        <button disabled={isLoading} onClick={() => handleSearchButton({ address, contractAddress, txHash })}>Search</button>
        <div>{errMsg}</div>
      </div>
      <div id='datatableFilter'>
        <h3>Filter</h3>
        {filter.includes('contractAddress') ? (
          <div>
            <CommonAddressInput
              name='filterContractAddress'
              displayName='Contract Address'
              address={filterCriteria['contractAddress']}
              addressName={addressDictionary[filterCriteria['contractAddress']]}
              onChange={(value) => handleFilterChange('contractAddress', value)}
              walletDropdownOptions={walletAddressOptions}
              contractDropdownOptions={contractAddressOptions}
              dropdownOnClick={handleFilterDropdownClick('contractAddress')}
            />
          </div>
        ) : null}
        {filter.includes('TokenAddress') ? (
          <div>
            <CommonAddressInput
              name='filterTokenAddress'
              displayName='Token Address'
              address={filterCriteria['TokenAddress']}
              addressName={addressDictionary[filterCriteria['TokenAddress']]}
              onChange={(value) => handleFilterChange('TokenAddress', value)}
              walletDropdownOptions={walletAddressOptions}
              contractDropdownOptions={contractAddressOptions}
              dropdownOnClick={handleFilterDropdownClick('TokenAddress')}
            />
          </div>
        ) : null}
        {filter.includes('TokenHolderAddress') ? (
          <div>
            <CommonAddressInput
              name='filterTokenHolderAddress'
              displayName='Token Holder Address'
              address={filterCriteria['TokenHolderAddress']}
              addressName={addressDictionary[filterCriteria['TokenHolderAddress']]}
              onChange={(value) => handleFilterChange('TokenHolderAddress', value)}
              walletDropdownOptions={walletAddressOptions}
              contractDropdownOptions={contractAddressOptions}
              dropdownOnClick={handleFilterDropdownClick('TokenHolderAddress')}
            />
          </div>
        ) : null}
        {filter.includes('from') ? (
          <div>
            <CommonAddressInput
              name='filterFrom'
              displayName='From'
              address={filterCriteria['from']}
              addressName={addressDictionary[filterCriteria['from']]}
              onChange={(value) => handleFilterChange('from', value)}
              walletDropdownOptions={walletAddressOptions}
              contractDropdownOptions={contractAddressOptions}
              dropdownOnClick={handleFilterDropdownClick('from')}
            />
          </div>
        ) : null}
        {filter.includes('to') ? (
          <div>
            <CommonAddressInput
              name='filterTo'
              displayName='To'
              address={filterCriteria['to']}
              addressName={addressDictionary[filterCriteria['to']]}
              onChange={(value) => handleFilterChange('to', value)}
              walletDropdownOptions={walletAddressOptions}
              contractDropdownOptions={contractAddressOptions}
              dropdownOnClick={handleFilterDropdownClick('to')}
            />
          </div>
        ) : null}
        {filter.includes('timeStamp') ? (
          <div>
            Time Stamp:
            <DateTimePicker disableClock maxDetail='second' onChange={(value) => handleFilterChange('startDateTime', value)} value={filterCriteria['startDateTime']}/>
            {' → '}
            <DateTimePicker disableClock maxDetail='second' onChange={(value) => handleFilterChange('endDateTime', value)} value={filterCriteria['endDateTime']}/>
          </div>
        ) : null}
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        progressPending={isLoading}
      />
    </div>
  );
};

export default Record;