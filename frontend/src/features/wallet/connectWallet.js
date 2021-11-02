import Web3 from 'web3';
import { AUCTION_ADDRESS, ETHER_UNIT } from './constants';

export async function connectToMetamask() {
  console.log("Connect Metamask");
  window.web3 = new Web3('https://bsc-dataseed1.binance.org:443');
  // await window.ethereum.enable();
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  return accounts[0];
}

export async function connectToBinance() {
  console.log("Connect Binance");
  //window.BinanceChain = new Web3('https://bsc-dataseed1.binance.org:443');
  await window.BinanceChain.enable();
  const accounts = await window.BinanceChain.request({
    method: 'eth_requestAccounts'
  });
  return accounts[0];
}

export async function joinMetamaskAuction(bidAmount) {
  console.log("Join Metamask Auction");
  const transactionParameters = {
    value: Web3.utils.numberToHex(bidAmount * ETHER_UNIT), 
    // customizable by user during MetaMask confirmation.
    to: AUCTION_ADDRESS, // Required except during contract publications.
    from: window.ethereum.selectedAddress // must match user's active address.
  };
  
  return await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });
}

export async function joinBinanceAuction(bidAmount) {
  console.log("Join Binance Auction");
  const transactionParameters = {
    value: Web3.utils.numberToHex(bidAmount * ETHER_UNIT), 
    // customizable by user during MetaMask confirmation.
    to: AUCTION_ADDRESS, // Required except during contract publications.
    from: window.ethereum.selectedAddress // must match user's active address.
  };
  
  return await window.BinanceChain.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });
}