import axios from 'axios';
import { OFFSET } from './constants';

axios.defaults.baseURL = 'http://localhost:3001'

export const getTxList = async (address, page = 1) => {
  const params = { address, page, offset: OFFSET };
  const response = await axios.get('/account/txList', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getAddressTokenBalance = async (address, page = 1) => {
  const params = { address, page, offset: OFFSET };
  const response = await axios.get('/account/addressTokenBalance', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};

export const getTokenHolderList = async (contractAddress, page = 1) => {
  const params = { contractaddress: contractAddress, page, offset: OFFSET };
  const response = await axios.get('/token/tokenholderlist', { params })
  if (response.status === 200) {
    return response.data;
  } else {
    return response.message;
  }
};