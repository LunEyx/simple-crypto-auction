import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/api'

export const getWalletAddressData = async () => {
  const response = await axios.get('/address/walletAddress');
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getContractAddressData = async () => {
  const response = await axios.get('/address/contractAddress');
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
}

export const getAccountBalance = async ({ address }) => {
  const params = { address };
  const response = await axios.get('/account/balance', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTxList = async ({ address }) => {
  const params = { address };
  const response = await axios.get('/account/txlist', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenTx = async ({ address, contractAddress }) => {
  const params = { address, contractaddress: contractAddress };
  const response = await axios.get('/account/tokentx', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenNftTx = async ({ address, contractAddress }) => {
  const params = { address, contractaddress: contractAddress };
  const response = await axios.get('/account/tokennfttx', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenBalance = async ({ address, contractAddress }) => {
  const params = { address, contractaddress: contractAddress };
  const response = await axios.get('/account/tokenbalance', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getAddressTokenBalance = async ({ address }) => {
  const params = { address };
  const response = await axios.get('/account/addressTokenBalance', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getAddressTokenNftBalance = async ({ address }) => {
  const params = { address };
  const response = await axios.get('/account/addressTokenNftBalance', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTxReceiptStatus = async ({ txHash }) => {
  const params = { txhash: txHash };
  const response = await axios.get('/transaction/gettxreceiptstatus', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenHolderList = async ({ contractAddress }) => {
  const params = { contractaddress: contractAddress };
  const response = await axios.get('/token/tokenholderlist', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};
export const getTokenInfo = async ({ contractAddress }) => {
  const params = { contractaddress: contractAddress };
  const response = await axios.get('/token/tokeninfo', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenSupply = async ({ contractAddress }) => {
  const params = { contractaddress: contractAddress };
  const response = await axios.get('/stats/tokensupply', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenCSupply = async ({ contractAddress }) => {
  const params = { contractaddress: contractAddress };
  const response = await axios.get('/stats/tokencsupply', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};