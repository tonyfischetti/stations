
'use strict';

import {
  PROVIDER_PARAMS, CHAIN_ID_MAPPING
} from './chain-info.js';

import * as ethers from '../dependencies/ethers-5.2.esm.min.js';

export const isMetaMaskInstalled = () => {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};

// TODO: return unsuccessful if not on chain
export const addOrSwitchNetwork = async (chain) => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [PROVIDER_PARAMS[chain]]
  });
};

export const connectToMetaMask = async (stationState) => {
  window._DEBUG('connecting to metamask');
  return new Promise(async (resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    let signer;
    let myAddress;

    try {
      await provider.send('eth_requestAccounts', []);
      const currentChainId = ethereum.networkVersion;
      const detectedChain = CHAIN_ID_MAPPING[currentChainId];
      if (PROVIDER_PARAMS[stationState.contract.chain].chainName !== detectedChain) {
        console.log('WRONG!!');
        if (confirm("Switch to correct chain?\n\nAfterwards, when the page reloads, you'll have to connect again")) {
          await addOrSwitchNetwork(stationState.contract.chain);
        } else {
          throw new Error('user declined to change networks... bailing out');
        }
      }
      signer = provider.getSigner();
      myAddress = await signer.getAddress();
      resolve({
        _provider: provider,
        _signer: signer,
        _myAddress: myAddress
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const connectToEncJSONWallet = async (provider, rawjson, passwd) => {
  window._DEBUG('attempting to connect to encrypted JSON wallet');
  return new Promise(async (resolve, reject) => {
    ethers.Wallet.fromEncryptedJson(rawjson, passwd)
      .then((wallet) => {
        wallet = wallet.connect(provider);
        resolve({
          _signer: wallet,
          _myAddress: wallet.address
        });
      })
      .catch((error) => { reject(new Error(error)); });
  });
};

export const connectToPrivateKey = async (provider) => {
  window._DEBUG('attempting to connect to encrypted JSON wallet');
  return new Promise(async (resolve, reject) => {
    ethers.Wallet.fromEncryptedJson(rawjson, passwd)
      .then((wallet) => {
        wallet = wallet.connect(provider);
        resolve({
          _signer: wallet,
          _myAddress: wallet.address
        });
      })
      .catch((error) => { reject(new Error(error)); });
  });
};
