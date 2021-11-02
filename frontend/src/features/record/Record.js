import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { getTxList, getTokenHolderList, getAddressTokenBalance } from './api';

const Record = (props) => {
  const [address, setAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  let columns = [];

  const searchTxList = async () => {
    try {
      const response = await getTxList(address, 1);
      if (response.status === '1') {
        setData(response.result);
        setPage(1);
        setErrMsg('');
      } else {
        setErrMsg(response.message);
      }
    } catch (err) {
      setErrMsg(err);
    }
  }

  const searchTokenHolderList = async () => {
    try {
      const response = await getTokenHolderList(contractAddress, 1);
      if (response.status === '1') {
        setData(response.result);
        setPage(1);
        setErrMsg('');
      } else {
        setErrMsg(response.message);
      }
    } catch (err) {
      setErrMsg(err);
    }
  }

  const serachAddressTokenBalance = async () => {
    try {
      const response = await getAddressTokenBalance(address, 1);
      if (response.status === '1') {
        setData(response.result);
        setPage(1);
        setErrMsg('');
      } else {
        setErrMsg(response.message);
      }
    } catch (err) {
      setErrMsg(err);
    }
  }

  if (data.length > 0) {
    columns = Object.keys(data[0]).map((key) => ({ name: key, selector: (row) => row[key] }))
  }

  return (
    <div>
      <hr />
      <h1>Record</h1>
      <div>
        <label htmlFor='address'>Address: </label>
        <input id='address' value={address} onChange={ (e) => setAddress(e.target.value) } />
      </div>
      <div>
        <label htmlFor='contractAddress'>Contract Address: </label>
        <input id='contractAddress' value={contractAddress} onChange={ (e) => setContractAddress(e.target.value) }/>
      </div>
      <button onClick={searchTxList}>Search Transaction List</button>
      <button onClick={serachAddressTokenBalance}>Search Address Token Balance</button>
      <button onClick={searchTokenHolderList}>Search Token Holder List</button>
      <div>{errMsg}</div>
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default Record;