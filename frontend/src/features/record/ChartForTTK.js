import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { getTokenTx } from './api';
import { ETHER_UNIT, walletAddresses } from './constants';

const ChartForTTK = (props) => {
  const { walletAddress } = props;
  const contractAddress = '0x39703A67bAC0E39f9244d97f4c842D15Fbad9C1f';
  // const walletAddress = '0xb4376ffb81dc664e95ffcec13a35560f62a71b97';

  const [isLoading, setIsLoading] = useState(true);
  const [retry, setRetry] = useState(1);
  const [rawData, setRawData] = useState([]);

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

  const roundDate = (timeStamp) => {
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);//subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
    return new Date(timeStamp);
  }

  const data = [];
  let counter = 1;
  for (const row of rawData) {
    const record = [];
    record.push('');
    const date = new Date(parseInt(row['timeStamp'] + '000'))
    record.push(roundDate(date));
    record.push(counter);
    counter += 1
    record.push(row['from'].toLowerCase() === walletAddress.toLowerCase() ? 'Sales' : 'Purchase');
    record.push(parseInt(row['value']) / ETHER_UNIT);
    data.push(record);
  }

  return isLoading ? (
    <div>Retry...{retry}</div>
  ) : (
    <Chart
      chartType='BubbleChart'
      loader={<div>Loading Chart...</div>}
      data={[
        ['ID', 'Date', 'Transaction Counter', 'Status', 'No. of Token'],
        ...data
      ]}
      options={{
        title: walletAddress
      }}
    />
  );
};

export default ChartForTTK;