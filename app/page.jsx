"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { NibiruQuerier, Testnet } from '@nibiruchain/nibijs';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const storedAccount = localStorage.getItem("selectedAccount");
    if (storedAccount) {
      setConnected(true);
    }
  }, []);

  async function connect() {
    if (!connected) {
      console.log('not connected');
      if (!window.leap) {
        alert('Leap Wallet is not installed');
        window.location.href = 'https://www.leapwallet.io/';
      } else {
        try {
          console.log('try1');
          await window.leap.enable('cataclysm-1');
          console.log('try2');
          getLeapKey();
          console.log('try4');
        } catch (error) {
          console.error('Failed to connect to Leap Wallet:', error);
        }
      }
    } else {
      console.log('connected');
      try {
        localStorage.removeItem("selectedAccount");
        setConnected(false);
        console.log('connected false', connected);
        await window.leap.disconnect('cataclysm-1');
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  }

  useEffect(() => {
    if (window.leap) {
      window.addEventListener('leap_keystorechange', getLeapKey);
    }
    return () => {
      if (window.leap) {
        window.removeEventListener('leap_keystorechange', getLeapKey);
      }
    };
  }, []);

  const getLeapKey = async () => {
    console.log('try3');
    try {
      const key = await window.leap.getKey('cataclysm-1');
      const selectedAccount = (key.bech32Address);
      setConnected(true);
      console.log(selectedAccount);
      console.log("Connected");
      localStorage.setItem("selectedAccount", selectedAccount);
      console.log("Account stored in local storage");
    } catch (error) {
      console.error('Failed to get key from Leap Wallet:', error);
    }
  };

  const fetchLeapBalance = async () => {
    try {
      console.log('leapAddress', account);
      const CHAIN = Testnet(1);
      const querier = await NibiruQuerier.connect(CHAIN.endptTm);
      const balances = await querier.getAllBalances(account);
      setAccount(JSON.stringify(balances));
      console.log("balances: %o", balances);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  return (
    <div className="bg-[rgb(12,5,11)] min-h-screen text-white font-kanit">
      <nav className="fixed top-0 left-0 transition-top duration-200 ease-in-out h-20 w-full z-20">
        <div className="flex justify-between items-center w-full h-20 bg-transparent transform translate-y-0 px-4">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-gray-300">Buy Biomes</a></li>
            <li><a href="#" className="hover:text-gray-300">Support Projects</a></li>
            <li><a href="#" className="hover:text-gray-300">Make a Project</a></li>
          </ul>
          <div>
            <button
              className="text-white w-48 h-8 rounded-full"
              onClick={connect}
              style={{
                background: connected ? 'linear-gradient(#D20FFC, #A604C4)' : 'linear-gradient(#17F966, #05BB45)',
                padding: 'unset'
              }}
            >
              {connected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-40">
        <div className="coin-box mx-auto p-6 rounded-lg">
          <h1 className="text-2xl mb-4">Buy Biomes</h1>
          <div className="mb-4">
            <p className="font-bold">Nibiru</p>
            <div className="flex flex-col p-2 border border-primary rounded-lg z-1">
              <input type="text" className="bg-transparent w-full" placeholder="Enter balance" />
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">Biome</p>
            <div className="flex flex-col p-2 border border-primary rounded-lg z-1">
              <input type="text" className="bg-transparent w-full" placeholder="Enter balance" />
            </div>
          </div>
          <div className="mt-4 flex flex-row items-center justify-around w-full bg-white bg-opacity-20 rounded-lg shadow-md backdrop-filter backdrop-blur-md border border-white border-opacity-30 p-4">
            <button>Confirm Buy</button>
          </div>
        </div>
      </div>

    </div>
  );
}
