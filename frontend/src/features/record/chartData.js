import { displayHash } from "../../common/util";

export const convertToTokenHolderListChartData = (data, params, addressDictionary) => {
  const chartData = [];
  if (data.length > 0) {
    chartData.push(Object.keys(data[0]));
    const tempData = data.sort((a, b) => b.TokenHolderQuantity - a.TokenHolderQuantity);
    let temp = tempData.map((row) => {
      const values = Object.values(row);
      values[0] = displayHash(values[0], addressDictionary[values[0]]);
      values[1] = parseInt(values[1]);
      return values;
    })
    return [...chartData, ...temp];
  }
  return [];
}

const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const groupValueByMonth = (data, key) => {
  const grouped = {};
  for (const row of data) {
    const date = new Date(parseInt(row.timeStamp + '000'));
    const displayMonth = monthAbbr[date.getMonth()] + ' ' + date.getFullYear();
    if (!grouped[displayMonth]) {
      grouped[displayMonth] = 0;
    }
    grouped[displayMonth] += parseInt(row[key]);
  }
  return grouped;
};

export const convertToTokenTxQuantityChartData = (data, params, addressDictionary) => {
  if (data.length > 0) {
    const headers = ['Month', 'Quantity'];
    const tempData = data.sort((a, b) => a.timeStamp - b.timeStamp);
    const targetAddress = params.address;
    const from = tempData.filter((row) => row.from === targetAddress);
    const to = tempData.filter((row) => row.to === targetAddress);
    const groupedFrom = groupValueByMonth(from, 'value');
    const groupedTo = groupValueByMonth(to, 'value');

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const firstDate = new Date(parseInt(tempData[0].timeStamp + '000'));
    let currentMonth = firstDate.getMonth();
    let currentYear = firstDate.getFullYear();

    const chartData = [headers];
    let total = 0;

    while (true) {
      const displayMonth = monthAbbr[currentMonth] + ' ' + currentYear;
      const fromCount = groupedFrom[displayMonth] || 0;
      const toCount = groupedTo[displayMonth] || 0;
      total = total - fromCount + toCount;
      chartData.push([displayMonth, total]);
      if (currentMonth === todayMonth && currentYear === todayYear) {
        break;
      }
      currentMonth += 1;
      if (currentMonth === 12) {
        currentMonth = 0;
        currentYear += 1;
      }
    }

    return chartData;
  }
}

const groupCountByMonth = (data, key) => {
  const grouped = {};
  for (const row of data) {
    const date = new Date(parseInt(row.timeStamp + '000'));
    const displayMonth = monthAbbr[date.getMonth()] + ' ' + date.getFullYear();
    if (!grouped[displayMonth]) {
      grouped[displayMonth] = 0;
    }
    grouped[displayMonth] += 1;
  }
  return grouped;
};

export const convertToTokenTxTransactionChartData = (data, params, addressDictionary) => {
  if (data.length > 0) {
    const headers = ['Month', 'Transaction'];
    const tempData = data.sort((a, b) => a.timeStamp - b.timeStamp);
    const grouped = groupCountByMonth(tempData);

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const firstDate = new Date(parseInt(tempData[0].timeStamp + '000'));
    let currentMonth = firstDate.getMonth();
    let currentYear = firstDate.getFullYear();

    const chartData = [headers];

    while (true) {
      const displayMonth = monthAbbr[currentMonth] + ' ' + currentYear;
      const count = grouped[displayMonth] || 0;
      chartData.push([displayMonth, count]);
      if (currentMonth === todayMonth && currentYear === todayYear) {
        break;
      }
      currentMonth += 1;
      if (currentMonth === 12) {
        currentMonth = 0;
        currentYear += 1;
      }
    }

    return chartData;
  }
}