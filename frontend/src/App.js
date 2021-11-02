import React from 'react';
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
    <div>
      <Wallet />
      <Record />
    </div>
  );
}

export default App;