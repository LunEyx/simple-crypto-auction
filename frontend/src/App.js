import React from 'react';
import { IconContext } from 'react-icons';
import './App.css';
import Wallet from './features/wallet/Wallet';
import Record from './features/record/Record';

function App() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  } 
  if (typeof window.BinanceChain !== 'undefined') {
    console.log('BinanceWallet is installed!');
  }

  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' }}}>
      {/* <Wallet /> */}
      <Record />
    </IconContext.Provider>
  );
}

export default App;