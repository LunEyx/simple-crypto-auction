import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { getTtkTxList } from './api';
import { ETHER_UNIT } from './constants';

const MergedChartForTTK = (props) => {
  // const { walletAddress } = props;
  // const contractAddress = '0x39703A67bAC0E39f9244d97f4c842D15Fbad9C1f';
  // const walletAddress = '0xb4376ffb81dc664e95ffcec13a35560f62a71b97';

  const [isLoading, setIsLoading] = useState(true);
  const [retry, setRetry] = useState(1);
  const [rawData, setRawData] = useState([]);

  // const retryApi = (walletAddress, fn) => {
  //   let retry = 20;
  //   let delay = 1000;
    
  //   return Promise.resolve().then(async () => {
  //     for (let i = 0; i < retry; i++) {
  //       const response = await fn();
  //       if (response.status === '1') {
  //         const data = [];
  //         let counter = 1;
  //         for (const row of response.result) {
  //           const record = [];
  //           record.push('');
  //           const date = new Date(parseInt(row['timeStamp'] + '000'))
  //           record.push(roundDate(date));
  //           record.push(counter);
  //           counter += 1
  //           record.push(row['from'].toLowerCase() === walletAddress.toLowerCase() ? 'Sales' : 'Purchase');
  //           record.push(parseInt(row['value']) / ETHER_UNIT);
  //           data.push(record);
  //         }
  //         return data;
  //       }
  //       await new Promise((resolve) => setTimeout(() => resolve(), delay));
  //     }
  //   })
  // }

  // useEffect(async () => {
  //   Promise.all(walletAddresses.map((walletAddress) => retryApi(walletAddress, () => getTokenTx({ address: walletAddress, contractAddress: contractAddress }))))
  //   .then((values) => {
  //     setRawData(values.flat(1))
  //     setIsLoading(false)
  //   })
  // })

  /*
  useEffect(async () => {
    try {
      let retry = 20;
      let delay = 5000;
      for (let i = 0; i < retry; i++) {
        const response = await getTokenTx({address: walletAddress, contractAddress: contractAddress});
        if (response.status === '1') {
          setRawData(response.result);
          setIsLoading(false);
          break;
        } else {
          console.log(response.message);
          setRetry(i + 1)
          await new Promise((resolve) => setTimeout(() => resolve(), delay));
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  */

  useEffect(async () => {
    try {
      const response = await getTtkTxList();
      setRawData(response);
      setIsLoading(false)
    } catch (err) {
      console.log(err.message)
    }
  }, [])

  const roundDate = (timeStamp) => {
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);//subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
    return new Date(timeStamp);
  }

  const roundDateToHour = (timeStamp) => {
    timeStamp -= timeStamp % (6 * 60 * 60 * 1000);
    return new Date(timeStamp);
  }

  const data = [];
  let counter = 1;
  for (const walletAddress of Object.keys(rawData)) {
    for (const row of rawData[walletAddress]) {
      const record = [];
      record.push('');
      const date = new Date(parseInt(row['timeStamp'] + '000'))
      record.push(date);
      record.push(counter);
      counter += 1
      record.push(row['from'].toLowerCase() === walletAddress.toLowerCase() ? 'Sales' : 'Purchase');
      record.push(parseInt(row['value']) / ETHER_UNIT);
      data.push(record);
    }
  }

  const newData = {Sales: {}, Purchase: {}};
  for (const walletAddress of Object.keys(rawData)) {
    for (const row of rawData[walletAddress]) {
      const timeStamp = roundDateToHour(parseInt(row.timeStamp + '000'));
      const status = row['from'].toLowerCase() === walletAddress.toLowerCase() ? 'Sales' : 'Purchase';

      if (!newData[status][timeStamp]) {
        newData[status][timeStamp] = { count: 0, token: 0 };
      }
      newData[status][timeStamp].count += 1
      newData[status][timeStamp].token += row.value / ETHER_UNIT;
    }
  }

  let maxValue = 0;

  const chartData = [];
  for (const [timeStamp, row] of Object.entries(newData.Purchase)) {
    if (row.count > maxValue) maxValue = row.count;
    chartData.push(['', new Date(timeStamp), row.count, 'Purchase', row.token]);
  }
  for (const [timeStamp, row] of Object.entries(newData.Sales)) {
    if (row.count > maxValue) maxValue = row.count;
    chartData.push(['', new Date(timeStamp), row.count, 'Sales', row.token]);
  }



  return isLoading ? (
    <div>Retry...{retry}</div>
  ) : (
    <Chart
      chartType='BubbleChart'
      loader={<div>Loading Chart...</div>}
      data={[
        ['ID', 'Date', 'No. of Transactions', 'Status', 'No. of Token'],
        ...chartData
      ]}
      options={{
        title: 'MergedChartForTTK',
        vAxis: { title: 'Price', maxValue: maxValue },
        hAxis: { title: 'Date' },
        explorer: {
          axis: 'horizontal',
          actions: ['dragToZoom', 'rightClickToReset'],
          keepInBounds: true
        }
      }}
      chartPackages={['corechart', 'controls']}
      controls={[
        {
          controlType: 'DateRangeFilter',
          options: {
            filterColumnIndex: 1,
            ui: {
              step: 'hour'
            }
          },
          controlPosition: 'bottom',
          controlWrapperParams: {
            state: {
              range: {
                start: new Date(2000, 1, 1),
                end: new Date()
              }
            }
          }
        }
      ]}
    />
  );
};

export default MergedChartForTTK;