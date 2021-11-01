import React from 'react';
import './App.css';
import { Wallet } from './features/wallet/Wallet';

function App() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  } 
  if (typeof window.BinanceChain !== 'undefined') {
    console.log('BinanceWallet is installed!');
  }

  return (
    <Wallet />
  );
}

export default App;