import Web3 from 'web3';

export async function connectToMetamask() {
  console.log("Connect Metamask");
  window.web3 = new Web3('https://bsc-dataseed1.binance.org:443');
  await window.ethereum.enable();
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