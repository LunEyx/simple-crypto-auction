import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import CommonAddressInput from '../../common/CommonAddressInput';
import { getTtkTxList, getTtkHistoricalPrice, getUserAddress } from './api';
import { ETHER_UNIT } from './constants';

const MergedChartForTTK = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rawData, setRawData] = useState([]);
  const [historicalPrice, setHistoricalPrice] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userDropdownOptions, setUserDropdownOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await getUserAddress();
        setUserDropdownOptions(response.options);
        response = await getTtkHistoricalPrice();
        setHistoricalPrice(response.data.quotes);
        response = await getTtkTxList();
        const rawData = {};
        for (const [key, value] of Object.entries(response)) {
          rawData[key.toLowerCase()] = value;
        }
        setRawData(rawData);
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchData();
  }, [])

  const roundDateToHour = (timeStamp) => {
    timeStamp -= timeStamp % (60 * 60 * 1000);
    return new Date(timeStamp);
  }

  const ttkHistoricalPrice = {};
  for (const row of historicalPrice) {
    const time = roundDateToHour(new Date(row.timestamp).getTime());
    if (!ttkHistoricalPrice[time]) {
      ttkHistoricalPrice[time] = row.quote.USD.price
    }
  }

  const newData = {Sales: {}, Purchase: {}};
  if (!!selectedUser && rawData[selectedUser]) {
    const walletAddress = selectedUser;
    for (const row of rawData[walletAddress]) {
      const timeStamp = roundDateToHour(parseInt(row.timeStamp + '000'));
      const price = ttkHistoricalPrice[timeStamp] || 0;
      const status = row['from'].toLowerCase() === walletAddress.toLowerCase() ? 'Sales' : 'Purchase';

      if (!newData[status][timeStamp]) {
        newData[status][timeStamp] = { price, token: 0 };
      }
      newData[status][timeStamp].token += row.value / ETHER_UNIT;
    }
  } else {
    for (const walletAddress of Object.keys(rawData)) {
      for (const row of rawData[walletAddress]) {
        const timeStamp = roundDateToHour(parseInt(row.timeStamp + '000'));
        const price = ttkHistoricalPrice[timeStamp] || 0;
        const status = row['from'].toLowerCase() === walletAddress.toLowerCase() ? 'Sales' : 'Purchase';

        if (!newData[status][timeStamp]) {
          newData[status][timeStamp] = { price, token: 0 };
        }
        newData[status][timeStamp].token += row.value / ETHER_UNIT;
      }
    }
  }

  let maxValue = 0;

  const chartData = [];
  for (const [timeStamp, row] of Object.entries(newData.Purchase)) {
    if (row.price > maxValue) maxValue = row.price;
    chartData.push(['', new Date(timeStamp), row.price, 'Purchase', row.token]);
  }
  for (const [timeStamp, row] of Object.entries(newData.Sales)) {
    if (row.price > maxValue) maxValue = row.price;
    chartData.push(['', new Date(timeStamp), row.price, 'Sales', row.token]);
  }

  const dropdownOnClick = (key, value) => {
    setSelectedUser(value);
  }

  const changeSelectedUser = (value) => {
    setSelectedUser(value);
  }

  return isLoading ? (
    <div>Extracting Data...</div>
  ) : (
    <>
      <Chart
        width={'100%'}
        height={'500px'}
        chartType='BubbleChart'
        loader={<div>Loading Chart...</div>}
        data={[
          ['ID', 'Date', 'Price (USD)', 'Status', 'No. of Token'],
          ...chartData
        ]}
        options={{
          title: 'MergedChartForTTK',
          vAxis: { title: 'Price (USD)', maxValue: maxValue },
          hAxis: { title: 'Date' },
          explorer: {
            axis: 'horizontal',
            actions: ['dragToZoom', 'rightClickToReset'],
            keepInBounds: true
          }
        }}
      />
      <CommonAddressInput
        name='user'
        displayName='User'
        disableContract='true'
        address={selectedUser}
        onChange={changeSelectedUser}
        walletDropdownOptions={userDropdownOptions}
        dropdownOnClick={dropdownOnClick}
      />
      {!selectedUser || !!rawData[selectedUser] ? null : <div style={{ color: 'red', fontWeight: 'bold' }}>User Not Found</div>}
    </>
  );
};

export default MergedChartForTTK;