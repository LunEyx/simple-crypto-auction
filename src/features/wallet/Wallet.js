import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import { selectWallet, connectMetamask, connectBinance } from './walletSlice';
import ConnectWalletButton from './ConnectWalletButton';
import 'rc-slider/assets/index.css';

export const Wallet = (props) => {
  const wallet = useSelector(selectWallet);
  const dispatch = useDispatch();
  const isConnected = wallet.connectedMetamask || wallet.connectedBinance;
  const connectedAccount = wallet.connectedAccount;
  const connectionStatus = wallet.connectionStatus;

  const [bidAmount, setBidAmount] = useState(1);

  return (
    <div>
      {isConnected ? (
          <Slider style={{ width: '50%', left: '10px' }} min={0.1} max={300} step={0.01} value={bidAmount} onChange={(value) => setBidAmount(value)} />
        ) : (
          <>
            <ConnectWalletButton name='Connect Metamask' onClick={() => dispatch(connectMetamask())} />
            <ConnectWalletButton name='Connect BinanceWallet' onClick={() => dispatch(connectBinance())} />  
          </>
        )}

      <p>
        <label htmlFor="bidAmount">Bid price:</label>
        <input type="number" id="bidAmount" value={bidAmount} onChange={(value) => setBidAmount(value)} />
        <label htmlFor="bidAmount">BNB</label>
      </p>

      <button className="joinAuctionButton btn" disabled>Join Auction</button>

      <h2>Account: <span className="showAccount">{connectedAccount}</span></h2>
      <h2>Status: <span className="status">{connectionStatus}</span></h2>
    </div>
  )
}