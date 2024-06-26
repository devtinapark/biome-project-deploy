"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';
import { Kanit, Pixelify_Sans } from 'next/font/google'
import { NibiruTxClient, NibiruQuerier, Chain, newSignerFromMnemonic, Testnet } from '@nibiruchain/nibijs';
import { coins } from "@cosmjs/proto-signing"
import logo from "../public/biom_logo.gif";
import NFTBox from "./components/NFTBox";

const mnemonic = "lemon physical muscle room only eye express crouch tree moral unaware pyramid boost proof mom cabin pave fade glare cinnamon detect juice cruel palace";
const kanit = Kanit({
  weight: '300',
  style: 'normal',
  subsets: ['latin'],
})
const teko = Pixelify_Sans({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
})


export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [biomeBalance, setBiomeBalance] = useState('');
  const [donatedBalance, setDonatedBalance] = useState('');
  const [activeMenu, setActiveMenu] = useState('globe');
  const [buyBalance, setBuyBalance] = useState('');
  const [supportBalance, setSupportBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const initialProjectState = {
    address: '',
    city: '',
    title: '',
    description: '',
    img: ''
  };
  const [project, setProject] = useState(initialProjectState);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//unpkg.com/globe.gl';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      loadGlobe();
    };
    const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;
    const loadGlobe = async () => {
      const myGlobe = window.Globe();
      const N = 50;
      const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: 7 + Math.random() * 30,
        color: ['red', 'blue', 'green'][Math.floor(Math.random() * 3)] // Random color selection
      }));

      // Add predefined items
      gData.push(
        {
          lat: 21.0285, // Hanoi latitude
          lng: 105.8542, // Hanoi longitude
          size: 30,
          color: 'white' // White color
        },
        {
          lat: 10.8231, // HCMC latitude
          lng: 106.6297, // HCMC longitude
          size: 40,
          color: 'white' // White color
        },
        {
          lat: 16.0544, // Danang latitude
          lng: 108.2022, // Danang longitude
          size: 20,
          color: 'white' // White color
        }
      );

      myGlobe
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .htmlElementsData(gData)
        .htmlElement(d => {
          const el = document.createElement('div');
          el.innerHTML = markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;
          el.style['pointer-events'] = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => onElClick(d);
          return el;
        })
      myGlobe.htmlTransitionDuration(1000);
      const myDOMElement = document.getElementById('globe-container');
      myGlobe(myDOMElement);
    };
  }, [activeMenu]);

  const onElClick = (d) => {
    console.info(d);
    connected && fetchBalance(account);
    if (d.lat === 21.0285 && d.lng === 105.8542) {
      fetchDonatedBalance('nibi1mxs5f2ge30jyg8furfwalpfl4frk6cx92csug7');
      setProject({
        address: 'nibi1mxs5f2ge30jyg8furfwalpfl4frk6cx92csug7',
        city: 'Hanoi',
        title: 'Hanoi Project',
        description: 'Description for Hanoi project',
        img: ''
      });
    } else if (d.lat === 10.8231 && d.lng === 106.6297) {
      fetchDonatedBalance('nibi1vyfv6mpn0zg7q7ayc3c6eldajs4q7s20mc84n8');
      setProject({
        address: 'nibi1vyfv6mpn0zg7q7ayc3c6eldajs4q7s20mc84n8',
        city: 'HCMC',
        title: 'Green Can Gio Initiative',
        description: 'Transform Can Gio district into a sustainable development model by 2035 through blue marine economy enhancements, eco-tourism, organic agriculture, rooftop solar installations, electric vehicles, and innovative waste management.',
        img: ''
      });
    } else if (d.lat === 16.0544 && d.lng === 108.2022) {
      fetchDonatedBalance('nibi1hf2l5an0w7wgr7at3k0yskqlr6f5z0k6c629wn');
      setProject({
        address: 'nibi1hf2l5an0w7wgr7at3k0yskqlr6f5z0k6c629wn',
        city: 'Da Nang',
        title: 'Da Nang Project',
        description: 'Description for Da Nang project',
        img: ''
      });
    }
    fetchBalance(account);
    setActiveMenu('support-project');
  };


  const CoinBox = () => {
    const handleBuyInput = (e) => {
      setSuccessMessage('');
      setErrorMessage('');
      const inputValue = e.target.value;
      if (/^[1-9]\d*$/.test(inputValue)) {
        setSupportBalance(inputValue);
      } else if (inputValue === '') {
        setSupportBalance('');
      }
    };

    const incrementBuyBalance = () => {
      setSuccessMessage('');
      setErrorMessage('');
      setBuyBalance(prevBalance => {
        const incrementedValue = parseInt(prevBalance || '0', 10) + 1;
        return incrementedValue.toString();
      });
    };

    const decrementBuyBalance = () => {
      setSuccessMessage('');
      setErrorMessage('');
      setBuyBalance(prevBalance => {
        const decrementedValue = Math.max(parseInt(prevBalance || '0', 10) - 1, 1);
        return decrementedValue.toString();
      });
    };

    const handleConfirmBuy = async () => {
      if (buyBalance > balance) {
        setErrorMessage('Buy balance exceeds available balance.');
      } else {
        setErrorMessage('');
        console.log('Success before try');
        try {
          const CHAIN = Testnet(1);
          const querier = await NibiruQuerier.connect(CHAIN.endptTm);
          const signer = await newSignerFromMnemonic(mnemonic);
          const txClient = await NibiruTxClient.connectWithSigner(CHAIN.endptTm, signer);
          const [{ address: fromAddr }] = await signer.getAccounts();

          const formattedBuyBalance = Math.round(buyBalance * 1000000);
          const tokens1 = coins(formattedBuyBalance, "unibi");
          const toAddr1 = "nibi1yxm7x2snd0mmymt6qg3dcn269vu5pvz8gcff3v"; // bank_wallet

          // Transfer unibi tokens to bank address
          const txResp1 = await txClient.sendTokens(fromAddr, toAddr1, tokens1, 500);
          console.log('buyBalance', buyBalance, 'unibi Transaction Response:', txResp1);

          if (txResp1.code === 0) { // Assuming '0' means success; adjust as necessary
            const bankMnemonic = "mail swallow acoustic menu desert evil taxi sausage shadow seek door question where anchor teach army warfare funny cheap exit fluid wheat popular sugar";
            const bankSigner = await newSignerFromMnemonic(bankMnemonic);
            const bankTxClient = await NibiruTxClient.connectWithSigner(CHAIN.endptTm, bankSigner);
            const [{ address: bankAddr }] = await bankSigner.getAccounts();

            const tokens2 = coins(formattedBuyBalance, "tf/nibi17d52wdz2a09vw93jf570d6w505pv3exn4nwzxnm2k2h9my9u4xesukcarj/biome"); // biome
            const toAddr2 = "nibi1k9cfgjcc7fverv209jgekkw60hm76y6k0mu60a"; // main_wallet

            // Transfer biome tokens to main wallet address
            const txResp2 = await bankTxClient.sendTokens(bankAddr, toAddr2, tokens2, 500);
            console.log('buyBalance', buyBalance, 'biome Transaction Response:', txResp2);
            setSuccessMessage('Transaction was made successfully!');
          } else {
            console.error('Failed to transfer unibi tokens:', txResp1.rawLog);
          }
        } catch (error) {
          console.error('Failed to transfer tokens:', error);
        }
      }
    };

    return (
      <div className="coin-box mx-auto p-6 rounded-lg">
        <h1 className="text-2xl mb-6">Buy Biome</h1>
        <div className="mb-4">
          <p className="font-bold">My Balance</p>
          <div className="flex flex-col p-2 my-2 border border-primary rounded-lg z-1">
            {balance} UNIBI
          </div>
          <div className="flex flex-col p-2 border border-primary rounded-lg z-1">
            {biomeBalance} BIOME
          </div>
        </div>
        <div className="mb-4">
          <p className="font-bold">Buy Biome</p>
          <div className="flex flex-col p-2 my-2 border border-primary rounded-lg relative">
            <input
              type="text"
              className="bg-transparent w-full pr-10" // Add padding to the right to accommodate buttons
              placeholder="Enter balance"
              value={buyBalance}
              onInput={handleBuyInput}
            />
            <button
              className="absolute right-0 top-0 bottom-0 px-2 flex items-center justify-center" // Positioning the button
              onClick={incrementBuyBalance}
            >
              +
            </button>
            <button
              className="absolute right-8 top-0 bottom-0 px-2 flex items-center justify-center" // Positioning the button
              onClick={decrementBuyBalance}
            >
              -
            </button>
          </div>
        </div>
        <button
        className="mt-10 flex flex-row items-center justify-around w-full bg-white bg-opacity-20 rounded-lg shadow-md backdrop-filter backdrop-blur-md border border-white border-opacity-30 p-4"
        style={{
            background: 'linear-gradient(#05FFE6, #510CA7)',
          }}
          onClick={() => handleConfirmBuy()}>
          Confirm Buy
        </button>
        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
      </div>
    );
  };

  const GlobeBox = () => {
    return (
      <div id="globe-container"></div>
    );
  };

  const ProjectBox = () => {
    const handleSupportInput = (e) => {
      const inputValue = e.target.value;
      if (/^[1-9]\d*$/.test(inputValue)) {
        setSupportBalance(inputValue);
      } else if (inputValue === '') {
        setSupportBalance('');
      }
    };

    const incrementSupportBalance = () => {
      setErrorMessage2('');
      setSupportBalance(prevBalance => {
        const incrementedValue = parseInt(prevBalance || '0', 10) + 1;
        return incrementedValue.toString();
      });
    };

    const decrementSupportBalance = () => {
      setErrorMessage2('');
      setSupportBalance(prevBalance => {
        const decrementedValue = Math.max(parseInt(prevBalance || '0', 10) - 1, 1);
        return decrementedValue.toString();
      });
    };


    const handleConfirmSend = async () => {
      if (supportBalance > biomeBalance) {
        setErrorMessage('Send balance exceeds available balance.');
      } else {
        setErrorMessage('');
        console.log('Success before try');
        try {
          const CHAIN = Testnet(1);
          const querier = await NibiruQuerier.connect(CHAIN.endptTm);
          const signer = await newSignerFromMnemonic(mnemonic);
          const txClient = await NibiruTxClient.connectWithSigner(CHAIN.endptTm, signer);
          const [{ address: fromAddr }] = await signer.getAccounts();

          const formattedBuyBalance = Math.round(buyBalance * 1000000);
          const tokens = coins(1000000, "tf/nibi17d52wdz2a09vw93jf570d6w505pv3exn4nwzxnm2k2h9my9u4xesukcarj/biome"); // biome
          const toAddr = project.address; //project_address

          const txResp = await txClient.sendTokens(fromAddr, toAddr, tokens, 500);
          console.log('buyBalance', buyBalance, 'unibi Transaction Response:', txResp);
        } catch (error) {
          console.error('Failed to transfer tokens:', error);
        }
      }
    };

    return (
      <div className="project-box mx-auto p-6 rounded-lg">
        <h1 className="text-2xl mb-6">Support Project</h1>
        <div className="mb-4">
          <p className="font-bold">Project Title</p>
          <div className="flex flex-col p-2 my-2 border border-primary rounded-lg z-1">
            <ul>
              <li>Location: {project.city}</li>
              <li>Description: {project.description}</li>
              <li>Donated: {donatedBalance} BIOME</li>
            </ul>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-bold">My Balance</p>
          <div className="flex flex-col p-2 my-2 border border-primary rounded-lg z-1">
            {biomeBalance} BIOME
          </div>
        </div>
        <div className="mb-4">
          <p className="font-bold">Send Biome</p>
          <div className="flex flex-col p-2 my-2 border border-primary rounded-lg relative">
            <input
              type="text"
              className="bg-transparent w-full pr-10" // Add padding to the right to accommodate buttons
              placeholder="Enter balance"
              value={supportBalance}
              onInput={handleSupportInput}
            />
            <button
              className="absolute right-0 top-0 bottom-0 px-2 flex items-center justify-center" // Positioning the button
              onClick={incrementSupportBalance}
            >
              +
            </button>
            <button
              className="absolute right-8 top-0 bottom-0 px-2 flex items-center justify-center" // Positioning the button
              onClick={decrementSupportBalance}
            >
              -
            </button>
          </div>
        </div>
          <button
            className="mt-10 flex flex-row items-center justify-around w-full bg-white bg-opacity-20 rounded-lg shadow-md backdrop-filter backdrop-blur-md border border-white border-opacity-30 p-4"
            style={{
              background: 'linear-gradient(#05FFE6, #510CA7)',
            }}
            onClick={() => handleConfirmSend()}>
            Confirm Send
          </button>
        {errorMessage2 && <p className="mt-2 text-red-500">{errorMessage2}</p>}
      </div>
    );
  };

  const Why = () => (
    <div className="coin-box mx-auto p-6 rounded-lg">
      <h1 className="text-2xl mb-6">My Story</h1>
      <h2>Why BiomeProject?</h2>
      <div className="my-5">The Biome Project enables users to purchase Biome tokens, carbon offset credits, to support global eco-projects, addressing the environmental impact of increasing digital nomads and travelers.</div>
      <div> Leveraging blockchain for transparency and security, users buy Biomes with Unibi coins and allocate them to projects via our interactive app globe. Individuals can also apply to list their eco-projects for support.</div>
      <p className="my-10"><a href="https://tinapark.dev/" className="bg-blue-500 text-white px-4 py-2 rounded-md">Made by Tina Park</a></p>
    </div>
  );

  useEffect(() => {
    const storedAccount = localStorage.getItem("selectedAccount");
    if (storedAccount) {
      setConnected(true);
      setAccount(storedAccount);
    }

    fetchBalance();
  }, []);

  async function connect() {
    if (!connected) {
      console.log('not connected');
      if (!window.leap) {
        alert('Leap Wallet is not installed');
        window.location.href = 'https://www.leapwallet.io/';
      } else {
        try {
          await window.leap.enable('cataclysm-1');
          getLeapKey();
          connected && fetchBalance(account);
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

  const handleNavigate = (activeMenu) => {
    setBuyBalance('');
    setDonatedBalance('');
    setSupportBalance('');
    setActiveMenu(activeMenu);
  }

  const handleBuyNavigate = () => {
    console.log('handleBuyNavigate');
    setBuyBalance('');
    setDonatedBalance('');
    setSupportBalance('');
    connected && fetchBalance(account);
    setActiveMenu('buy-biome');
  };

  const getLeapKey = async () => {
    console.log('getLeapKey');
    try {
      const key = await window.leap.getKey('cataclysm-1');
      const selectedAccount = (key.bech32Address);
      setConnected(true);
      console.log('selectedAccount', selectedAccount);
      console.log("Connected");
      setAccount(selectedAccount);
      localStorage.setItem("selectedAccount", selectedAccount);
      console.log("Account stored in local storage");
    } catch (error) {
      console.error('Failed to get key from Leap Wallet:', error);
    }
  };

  const fetchBalance = async (address) => {
    console.log('fetchBalance', 'address', address);
    try {
      if (address && address !== '') {
        console.log('fetchDonatedBalance after try');
        const currentAddress = address;
        const CHAIN = Testnet(1);
        const querier = await NibiruQuerier.connect(CHAIN.endptTm);
        console.log('querier', querier);
        const balances = await querier.getAllBalances(currentAddress);
        console.log('balances', balances);
        const balance1 = balances.find(balance => balance.denom === 'unibi');
        const formattedBalance1 = balance1 ? balance1.amount / 1000000 : '0';
        const balance2 = balances.find(balance => balance.denom === 'tf/nibi17d52wdz2a09vw93jf570d6w505pv3exn4nwzxnm2k2h9my9u4xesukcarj/biome');
        const formattedBalance2 = balance2 ? balance2.amount / 1000000 : '0';
        setBalance(formattedBalance1);
        setBiomeBalance(formattedBalance2);
        console.log("formattedBalance 1 and 2", formattedBalance1, formattedBalance2);
      } else {
        console.log('Empty address provided. Skipping balance fetch.');
      }
    } catch (error) {
      console.error('Failed to fetch formattedBalance:', error);
    }
  };


  const fetchDonatedBalance = async (address) => {
    console.log('fetchDonatedBalance', 'address', address);
    try {
      console.log('fetchDonatedBalance after try');
      const donatedAddress = address;
      const CHAIN = Testnet(1);
      const querier = await NibiruQuerier.connect(CHAIN.endptTm);
      console.log('querier', querier);
      const balances = await querier.getAllBalances(donatedAddress);
      console.log('balances', balances);
      const nibiBalance = balances.find(balance => balance.denom === 'tf/nibi17d52wdz2a09vw93jf570d6w505pv3exn4nwzxnm2k2h9my9u4xesukcarj/biome');
      const donatedBalance = nibiBalance ? nibiBalance.amount/1000000 : '0';
      localStorage.setItem("donatedBalance", donatedBalance);
      setDonatedBalance(donatedBalance);
      console.log("donatedBalance: %o", balances);
    } catch (error) {
      console.error('Failed to fetch donatedBalance:', error);
    }
  };

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'buy-biome':
        return <CoinBox />;
      case 'globe':
        return <GlobeBox />;
      case 'support-project':
        return <ProjectBox />;
      case 'make-project':
        return <NFTBox />;
      case 'why':
        return <Why />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[rgb(12,5,11)] min-h-screen text-white font-kanit">
      <nav className="fixed top-0 left-0 transition-top duration-200 ease-in-out h-20 w-full z-20 px-6 pt-4">
        <div className={`logo-div-bottom flex items-center ${teko.className}`}>
          <div className="mt-3 text-neon">
            B<span className="animation-delay-1">i</span>ome
          </div>
          <div className="flex items-center">
            <Image src={logo} alt="BiomeProject" width={80} height={80} className="pt-3" />
          </div>
          <div className="mt-3 text-neon">
            Pr<span className="animation-delay-2">o</span>j<span className="animation-delay-3">e</span>ct
          </div>
        </div>
        <div className="menu-div flex flex-wrap justify-between items-center w-full h-20 bg-transparent transform translate-y-0 px-4">
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-gray-300" onClick={() => handleBuyNavigate()}>BUY</a></li>
            <li><a href="#" className="hover:text-gray-300" onClick={() => handleNavigate('globe')}>FIND</a></li>
            <li><a href="#" className="hover:text-gray-300" onClick={() => handleNavigate('make-project')}>APPLY</a></li>
            <li><a href="#" className="hover:text-gray-300" onClick={() => handleNavigate('why')}>WHY</a></li>
          </ul>
          <div className={`logo-div flex items-center ${teko.className}`}>
            <div className="mt-3 text-neon">
              B<span className="animation-delay-1">i</span>ome
            </div>
            <div className="flex items-center">
              {/* Using the Image component */}
              <Image src={logo} alt="BiomeProject" width={80} height={80} className="pt-3" />
            </div>
            <div className="mt-3 text-neon">
              Pr<span className="animation-delay-2">o</span>j<span className="animation-delay-3">e</span>ct
            </div>
          </div>
          <div className="connect-div">
            <button
              className="text-white w-48 h-8 rounded-full"
              onClick={connect}
              style={{
                background: connected ? 'linear-gradient(#D20FFC, #A604C4)' : 'linear-gradient(#17F966, #05BB45)',
                padding: 'unset'
              }}
            >
              {connected ? 'CONNECTED' : 'CONNECT WALLET'}
            </button>
          </div>
        </div>
      </nav>

      <div className={activeMenu === 'globe' ? `${kanit.className} pt-20 md:pt-0 global-box-globe` : `${kanit.className} pt-40 global-box`}>
        {renderMenuContent()}
      </div>
    </div>
  );
}
