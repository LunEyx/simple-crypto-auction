import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DateTimePicker from 'react-datetime-picker';
import Chart from 'react-google-charts';
import { useDispatch, useSelector } from 'react-redux';
import { recordSlice, selectRecord } from './recordSlice';
import InputWithLabel from '../../common/InputWithLabel';
import { CellWithCopy } from '../../common/CopyToClipboardButton';
import { displayHash, downloadCSV } from '../../common/util';
import AddressInput from '../../common/AddressInput';
import CommonAddressInput from '../../common/CommonAddressInput';
import { BSCSCAN_URL } from './constants';
import {
  getWalletAddressData, getContractAddressData,
  getAccountBalance, getTxList, getTokenTx, getTokenNftTx, getTokenBalance,
  getAddressTokenBalance, getAddressTokenNftBalance, getTxReceiptStatus,
  getTokenHolderList, getTokenInfo, getTokenSupply, getTokenCSupply
} from './api';
import {
  convertToTokenHolderListChartData, convertToTokenTxTransactionChartData, convertToTokenTxQuantityChartData
} from './chartData';
import './Record.css';
import MergedChartForTTK from './MergedChartForTTK';

const options = [
  { name: 'Account Balance', api: getAccountBalance, address: true },
  { name: 'Transaction List', api: getTxList, address: true, filter: ['contractAddress', 'from', 'to', 'timeStamp'] },
  {
    name: 'BEP-20 Token Transaction',
    api: getTokenTx, address: true,
    contractAddress: true,
    filter: ['from', 'to', 'timeStamp'],
    chartOptions: {
      chartTypes: ['BarChart', 'Bar'],
      options: [{}, {}],
      chartFns: [convertToTokenTxTransactionChartData, convertToTokenTxQuantityChartData]
    }
  },
  {
    name: 'BEP-721 Token Transaction',
    api: getTokenNftTx,
    address: true, contractAddress: true,
    filter: ['from', 'to', 'timeStamp'],
    chartOptions: {
      chartTypes: ['BarChart', 'Bar'],
      options: [{}, {}],
      chartFns: [convertToTokenTxTransactionChartData, convertToTokenTxQuantityChartData]
    }
  },
  { name: 'Token Balance', api: getTokenBalance, address: true, contractAddress: true },
  { name: 'Address BEP-20 Token Holding', api: getAddressTokenBalance, address: true, filter: ['TokenAddress'] }, 
  { name: 'Address BEP-721 Token Holding', api: getAddressTokenNftBalance, address: true, filter: ['TokenAddress'] },
  { name: 'Get Transaction Receipt Status', api: getTxReceiptStatus, txHash: true },
  {
    name: 'Token Holder List', api: getTokenHolderList, contractAddress: true, filter: ['TokenHolderAddress'],
    chartOptions: {
      chartTypes: ['PieChart'],
      options: [{is3D: true}],
      chartFns: [convertToTokenHolderListChartData],
    }
  },
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
  const [walletAddressOptions, setWalletAddressOptions] = useState({});
  const [contractAddressOptions, setContractAddressOptions] = useState({});
  const [filter, setFilter] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [chartOptions, setChartOptions] = useState(options[0].chartOptions);
  const [nextChartOptions, setNextChartOptions] = useState(options[0].chartOptions)
  let columns = [];
  let filteredData = data;

  const record = useSelector(selectRecord);
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      let dictionary = {};
      let data = await getWalletAddressData();
      setWalletAddressOptions(data.options);
      dictionary = data.dictionary;
      data = await getContractAddressData();
      setContractAddressOptions(data.options);
      dictionary = { ...dictionary, ...data.dictionary }
      dispatch(recordSlice.actions.setAddressDictionary(dictionary));
    };
    fetchData();
  }, []);

  const handleChangeDisplay = async (option) => {
    option.address ? setIsAddressEnabled(true) : setIsAddressEnabled(false);
    option.contractAddress ? setIsContractAddressEnabled(true) : setIsContractAddressEnabled(false);
    option.txHash ? setIsTxHashEnabled(true) : setIsTxHashEnabled(false);
    option.filter ? setFilter(option.filter) : setFilter([]);
    option.chartOptions ? setNextChartOptions(option.chartOptions) : setNextChartOptions(null);
    setApiFn(() => (params) => option.api(params));
    setCurrentOption(option.name);
  }

  const handleSearchButton = async (params) => {
    setIsLoading(true);
    setData([]);
    setFilterCriteria({});
    setChartOptions(nextChartOptions);
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
      if (['TokenHolderQuantity'].includes(key)) {
        result.sortFunction = (rowA, rowB) => {
          const a = parseInt(rowA.TokenHolderQuantity);
          const b = parseInt(rowB.TokenHolderQuantity);

          if (a > b) {
            return 1;
          } else if (a < b) {
            return -1;
          }
          return 0;
        }
      }
      if (['from', 'to', 'contractAddress', 'TokenAddress', 'TokenHolderAddress'].includes(key)) {
        result.cell = (row) => {
          const addressName = record.addressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return row[key];
          }
          let displayText = <a href={BSCSCAN_URL + 'address/' + row[key]} target='_blank' rel='noreferrer' className='noDecoLink'>{displayHash(row[key], addressName)}</a>
          return <CellWithCopy type='address' text={row[key]} displayText={displayText} />
        }
      } else if (['hash'].includes(key)) {
        result.cell = (row) => {
          const addressName = record.addressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return displayHash(row[key], addressName)
          }
          let displayText = <a href={BSCSCAN_URL + 'tx/' + row[key]} target='_blank' rel='noreferrer' className='noDecoLink'>{displayHash(row[key], addressName)}</a>
          return <CellWithCopy text={row[key]} displayText={displayText} />
        }
      } else if (['blockHash'].includes(key)) {
        result.cell = (row) => {
          const addressName = record.addressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return displayHash(row[key], addressName)
          }
          let displayText = <a href={BSCSCAN_URL + 'block/' + row[key]} target='_blank' rel='noreferrer' className='noDecoLink'>{displayHash(row[key], addressName)}</a>
          return <CellWithCopy text={row[key]} displayText={displayText} />
        }
      } else if (['input'].includes(key)) {
        result.cell = (row) => {
          const addressName = record.addressDictionary[row[key]];
          if (row[key].substring(0, 2) !== '0x') {
            return displayHash(row[key], addressName)
          }
          return <CellWithCopy text={row[key]} displayText={displayHash(row[key], addressName)} />
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
    setAddressName(record.addressDictionary[address]);
  }

  const handleContractAddressChange = (address) => {
    setContractAddress(address);
    setContractAddressName(record.addressDictionary[address]);
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

  const actionsMemo = <button disabled={data.length === 0} onClick={() => downloadCSV(data)}>Export CSV</button>
  let chartData = [];
  if (!!chartOptions) {
    const params = {
      address,
      contractAddress,
      txHash
    };
    for (const fn of chartOptions.chartFns) {
      chartData.push(fn(data, params, record.addressDictionary));
    }
  }

  return (
    <div>
      <hr />
      <h1>Record</h1>
      <MergedChartForTTK />
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
        {filter.map((criteria) => {
          if (criteria === 'timeStamp') {
            return (
              <div key={criteria}>
                Time Stamp:
                <DateTimePicker disableClock maxDetail='second' onChange={(value) => handleFilterChange('startDateTime', value)} value={filterCriteria['startDateTime']}/>
                {' → '}
                <DateTimePicker disableClock maxDetail='second' onChange={(value) => handleFilterChange('endDateTime', value)} value={filterCriteria['endDateTime']}/>
              </div>
            );
          } else {
            const name = criteria.charAt(0).toUpperCase() + criteria.slice(1);
            return (
              <div key={criteria}>
                <CommonAddressInput
                  name={'filter' + name}
                  displayName={name.replace(/([A-Z])/g, ' $1')}
                  address={filterCriteria[criteria]}
                  onChange={(value) => handleFilterChange(criteria, value)}
                  walletDropdownOptions={walletAddressOptions}
                  contractDropdownOptions={contractAddressOptions}
                  dropdownOnClick={handleFilterDropdownClick(criteria)}
                />
              </div>
            );
          }
        })}
      </div>
      {!!chartOptions && data.length > 0 ? (
        <>
          {chartOptions.chartTypes.map((chartType, index) =>
            <Chart
              width='700px'
              height='300px'
              chartType={chartType}
              loader={<div>Loading Chart</div>}
              data={chartData[index]}
              options={chartOptions.options[index]}
            />
          )}
        </>
      ) : null}
      <DataTable
        columns={columns}
        data={filteredData}
        actions={actionsMemo}
        pagination
        progressPending={isLoading}
      />
    </div>
  );
};

export default Record;