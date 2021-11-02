import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import { selectWallet, connectMetamask, connectBinance, joinAuction } from './walletSlice';
import ConnectWalletButton from './ConnectWalletButton';
import 'rc-slider/assets/index.css';

const Wallet = (props) => {
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
        <input type="number" id="bidAmount" value={bidAmount}
          onChange={(e) => {
            let value = parseInt(e.target.value);
            if (value < 0.1) {
              value = 0.1
            }
            setBidAmount(value)
          }}
        />
        <label htmlFor="bidAmount">BNB</label>
      </p>

      <button className="joinAuctionButton btn" disabled={!isConnected} onClick={() => dispatch(joinAuction(bidAmount))}>Join Auction</button>

      <h2>Account: {connectedAccount}</h2>
      <h2>Status: {connectionStatus}</h2>
    </div>
  )
}

export default Wallet;