

const STATION_ABIS = {
  v6: [ { "inputs": [ { "internalType": "address", "name": "_creator", "type": "address" }, { "internalType": "string", "name": "_station_name", "type": "string" }, { "internalType": "string", "name": "_station_frequency", "type": "string" }, { "internalType": "string", "name": "_station_description", "type": "string" }, { "internalType": "bytes2", "name": "_station_type", "type": "bytes2" }, { "internalType": "bytes2", "name": "_station_flags", "type": "bytes2" }, { "internalType": "string", "name": "_station_metadata", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "components": [ { "internalType": "uint256", "name": "broadcast_id", "type": "uint256" }, { "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "uint256", "name": "parent", "type": "uint256" }, { "internalType": "bytes2", "name": "broadcast_type", "type": "bytes2" }, { "internalType": "bytes2", "name": "broadcast_flags", "type": "bytes2" }, { "internalType": "string", "name": "broadcast_metadata", "type": "string" } ], "indexed": false, "internalType": "struct Stations.Broadcast", "name": "thebroadcast", "type": "tuple" } ], "name": "NewBroadcast", "type": "event" }, { "anonymous": false, "inputs": [ { "components": [ { "internalType": "address", "name": "user_address", "type": "address" }, { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "uint256", "name": "time_joined", "type": "uint256" }, { "internalType": "string", "name": "user_metadata", "type": "string" } ], "indexed": false, "internalType": "struct Stations.User", "name": "theuser", "type": "tuple" } ], "name": "UserJoined", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "bytes2", "name": "broadcast_type", "type": "bytes2" }, { "internalType": "bytes2", "name": "broadcast_flags", "type": "bytes2" }, { "internalType": "string", "name": "broadcast_metadata", "type": "string" } ], "name": "_make_broadcast_forge_timestamp", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "add_admin", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "new_username", "type": "string" } ], "name": "change_username", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id_to_delete", "type": "uint256" } ], "name": "delete_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "msg_hash", "type": "bytes32" }, { "internalType": "bytes", "name": "sig", "type": "bytes" } ], "name": "ec_recover_signer", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id_to_edit", "type": "uint256" }, { "internalType": "string", "name": "newcontent", "type": "string" }, { "internalType": "bytes", "name": "newsignature", "type": "bytes" } ], "name": "edit_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get_all_broadcasts", "outputs": [ { "components": [ { "internalType": "uint256", "name": "broadcast_id", "type": "uint256" }, { "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "uint256", "name": "parent", "type": "uint256" }, { "internalType": "bytes2", "name": "broadcast_type", "type": "bytes2" }, { "internalType": "bytes2", "name": "broadcast_flags", "type": "bytes2" }, { "internalType": "string", "name": "broadcast_metadata", "type": "string" } ], "internalType": "struct Stations.Broadcast[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "get_all_users", "outputs": [ { "components": [ { "internalType": "address", "name": "user_address", "type": "address" }, { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "uint256", "name": "time_joined", "type": "uint256" }, { "internalType": "string", "name": "user_metadata", "type": "string" } ], "internalType": "struct Stations.User[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "text", "type": "string" } ], "name": "get_hash", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256[]", "name": "unix_timestamp", "type": "uint256[]" }, { "internalType": "address[]", "name": "author", "type": "address[]" }, { "internalType": "string[]", "name": "content", "type": "string[]" }, { "internalType": "bytes[]", "name": "signature", "type": "bytes[]" }, { "internalType": "uint256[]", "name": "parent", "type": "uint256[]" }, { "internalType": "bytes2[]", "name": "broadcast_type", "type": "bytes2[]" }, { "internalType": "bytes2[]", "name": "broadcast_flags", "type": "bytes2[]" }, { "internalType": "string[]", "name": "broadcast_metadata", "type": "string[]" } ], "name": "import_broadcasts", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "username", "type": "string" } ], "name": "inaugurate_station", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "is_admin_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "is_allowed_in_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "username", "type": "string" } ], "name": "join_station", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "bytes2", "name": "broadcast_type", "type": "bytes2" }, { "internalType": "bytes2", "name": "broadcast_flags", "type": "bytes2" }, { "internalType": "string", "name": "broadcast_metadata", "type": "string" } ], "name": "make_broadcast_simple", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "remove_admin", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id_to_edit", "type": "uint256" }, { "internalType": "string", "name": "newmetadata", "type": "string" } ], "name": "replace_broadcast_metadata", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newmetadata", "type": "string" } ], "name": "replace_station_metadata", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newmetadata", "type": "string" } ], "name": "replace_user_metadata", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "reverse_whitelist", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes", "name": "sig", "type": "bytes" } ], "name": "split_signature", "outputs": [ { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "station_info", "outputs": [ { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes2", "name": "", "type": "bytes2" }, { "internalType": "bytes2", "name": "", "type": "bytes2" }, { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "user_already_in_station_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "a_name", "type": "string" } ], "name": "username_already_in_station_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "address", "name": "alleged_author", "type": "address" }, { "internalType": "bytes", "name": "sig", "type": "bytes" } ], "name": "verify_broadcast_author", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "whitelist_address", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "whoami", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
};


const PROVIDER_PARAMS = {
  polygon: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://www.polygonscan.com']
  },
  avalanche: {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/']
  },
  fantom: {
    chainId: '0xFA',
    chainName: 'Fantom Opera',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorerUrls: ['https://ftmscan.com/']
  },
  harmony: {
    chainId: '0x63564C40',
    chainName: 'Harmony Mainnet',
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18
    },
    rpcUrls: ['https://api.harmony.one'],
    blockExplorerUrls: ['https://explorer.harmony.one/']
  }
};


const RPC_URL_MAP = {
  polygon: "https://rpc-mainnet.maticvigil.com/v1/a383485c02d70e19b2660c539983b17e9566a297",
  avalanche: "https://rpc.ankr.com/avalanche",
  fantom: "https://rpc.ftm.tools",
  harmony: "https://api.harmony.one"
};

const addOrSwitchNetwork = (chain) => {
  window.ethereum.request({ method: 'wallet_addEthereumChain',
    params: [ PROVIDER_PARAMS[chain] ] }).
    then(() => console.log('Success')).
    catch((error) => console.log("Error"));

};


// TODO: complete with this data: https://chainlist.org/
const CHAIN_ID_MAPPING = {
  "1":          "Ethereum Mainnet",
  "3":          "Ropsten",
  "4":          "Rinkeby",
  "5":          "Görli",
  "42":         "Kovan",
  "137":        "Polygon Mainnet",
  "250":        "Fantom Opera",
  "4002":       "Fantom Testnet",
  "43113":      "Avalanche Fuji Testnet",
  "43114":      "Avalanche Mainnet C-Chain",
  "1666600000":	"Harmony Mainnet"
};


const makeWrongChainMessage = (currentChainId, detectedChain, correctChain) => {
  let mes = `Your metamask is connected to chain ID ${currentChainId} ` +
    (detectedChain ? `(${detectedChain})` : "(unrecognized blockchain)") +
    ` but this station is on ${correctChain}.\n` +
    `\nWould you like to switch to the correct network?`;
  console.log(mes);
  return mes;
};


