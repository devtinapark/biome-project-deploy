"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { connect as connectJoy } from '@joyid/ckb';
import { disconnect as disconnectJoy } from '@joyid/evm';
import { NibiruQuerier, Testnet } from '@nibiruchain/nibijs';

export default function Home() {

  const [joyAddress, setJoyAddress] = useState<string | null>(null);
  const [leapConnected, setLeapConnected] = useState(false);
  const [leapAddress, setLeapAddress] = useState('');
  const [leapBalance, setLeapBalance] = useState(null);

  const onJoyConnect = async () => {
    try {
      const res = await connectJoy();
      setJoyAddress(JSON.stringify(res.address));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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

  const connectLeap = async () => {
    if (!window.leap) {
      alert('Leap Wallet is not installed');
      window.location.href = 'https://www.leapwallet.io/';
    } else {
      try {
        await window.leap.enable('cataclysm-1');
        getLeapKey();
      } catch (error) {
        console.error('Failed to connect to Leap Wallet:', error);
      }
    }
  };

  const getLeapKey = async () => {
    try {
      const key = await window.leap.getKey('cataclysm-1'); // Replace with your chain ID
      setLeapAddress(key.bech32Address);
      setLeapConnected(true);
      console.log('Cosmoshub address:', key.bech32Address);
    } catch (error) {
      console.error('Failed to get key from Leap Wallet:', error);
    }
  };

  const fetchLeapBalance = async () => {
    try {
      console.log('leapAddress', leapAddress);
      const CHAIN = Testnet(1);
      const querier = await NibiruQuerier.connect(CHAIN.endptTm);
      const balances = await querier.getAllBalances(leapAddress);
      setLeapAddress(JSON.stringify(balances));
      console.log("balances: %o", balances);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        BiomeProject
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          {/* {joyAddress ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => {
                  disconnectJoy();
                  setJoyAddress(null);
                }}
              >
                Disconnect JoyID {joyAddress}
              </button>
              <div className="divider" />
            </>
          ) : (
            <button className="btn btn-primary" onClick={onJoyConnect}>
              Connect JoyID
            </button>
          )} */}
          <div>
            {leapConnected ? (
              <div>
                <p>Leap Wallet Connected</p>
                <p>Leap Address: {leapAddress}</p>
                <button onClick={fetchLeapBalance}>Show Balance</button>
                {leapBalance && <pre>{JSON.stringify(leapBalance, null, 2)}</pre>}
              </div>
            ) : (
              <button onClick={connectLeap}>Connect Leap Wallet</button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-[-1] place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <p>text
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
