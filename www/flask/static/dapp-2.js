

const AVALANCHE_MAINNET_PARAMS = {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/']
}

const POLYGON_MAINNET_PARAMS = {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://www.polygonscan.com']
}

// function addAvalancheNetwork() {
//   web3.getProvider().
//     then(provider => {provider.request({method: 'wallet_addEthereumChain', params: [AVALANCHE_MAINNET_PARAMS] })});
// }

function addAvalancheNetwork() {
  window.ethereum.request({ method: 'wallet_addEthereumChain', params: [AVALANCHE_MAINNET_PARAMS] }).
    then(() => console.log('Success')).
    catch((error) => console.log("Error"));
}

function addPolygonNetwork() {
  window.ethereum.request({ method: 'wallet_addEthereumChain', params: [POLYGON_MAINNET_PARAMS] }).
    then(() => console.log('Success')).
    catch((error) => console.log("Error"));
}




const STATIONS_VERSION = "0.0.2";

// const STATION_ABI = [ { "inputs": [ { "internalType": "address", "name": "_creator", "type": "address" }, { "internalType": "string", "name": "_station_name", "type": "string" }, { "internalType": "string", "name": "_station_frequency", "type": "string" }, { "internalType": "enum Stations.Station_Types", "name": "_station_type", "type": "uint8" }, { "internalType": "bool", "name": "_is_public_p", "type": "bool" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "who", "type": "address" }, { "indexed": false, "internalType": "string", "name": "username", "type": "string" }, { "indexed": false, "internalType": "string", "name": "content", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" } ], "name": "NewBroadcast", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "who", "type": "address" }, { "indexed": false, "internalType": "string", "name": "reason", "type": "string" } ], "name": "StationsError", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "who", "type": "address" }, { "indexed": false, "internalType": "string", "name": "username", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" } ], "name": "UserJoined", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "time_broadcast", "type": "uint256" } ], "name": "_add_broadcast_advanced", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "add_admin", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "admin_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "new_username", "type": "string" } ], "name": "change_username", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "degauss", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get_all_broadcasts", "outputs": [ { "components": [ { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" }, { "internalType": "enum Stations.Broadcast_Types", "name": "broadcast_type", "type": "uint8" } ], "internalType": "struct Stations.Broadcast[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "get_all_users", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "is_admin_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "is_allowed_in_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "username", "type": "string" } ], "name": "join_station", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" } ], "name": "make_a_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "remove_admin", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "reverse_whitelist", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "station_info", "outputs": [ { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "enum Stations.Station_Types", "name": "", "type": "uint8" }, { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "user_already_in_station_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "a_name", "type": "string" } ], "name": "username_already_in_station_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "whitelist_address", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "whoami", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ];
const STATION_ABI = [ { "inputs": [ { "internalType": "address", "name": "_creator", "type": "address" }, { "internalType": "string", "name": "_station_name", "type": "string" }, { "internalType": "string", "name": "_station_frequency", "type": "string" }, { "internalType": "string", "name": "_station_description", "type": "string" }, { "internalType": "enum Stations.Station_Types", "name": "_station_type", "type": "uint8" }, { "internalType": "bool", "name": "_is_public_p", "type": "bool" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "who", "type": "address" }, { "indexed": false, "internalType": "string", "name": "username", "type": "string" }, { "indexed": false, "internalType": "string", "name": "content", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "broadcast_id", "type": "uint256" } ], "name": "NewBroadcast", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "who", "type": "address" }, { "indexed": false, "internalType": "string", "name": "reason", "type": "string" } ], "name": "StationsError", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "who", "type": "address" }, { "indexed": false, "internalType": "string", "name": "username", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" } ], "name": "UserJoined", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "time_broadcast", "type": "uint256" } ], "name": "_add_broadcast_advanced", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "add_admin", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "new_username", "type": "string" } ], "name": "change_username", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "degauss", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id_to_delete", "type": "uint256" } ], "name": "delete_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id_to_edit", "type": "uint256" }, { "internalType": "string", "name": "newcontent", "type": "string" } ], "name": "edit_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get_all_broadcasts", "outputs": [ { "components": [ { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "unix_timestamp", "type": "uint256" }, { "internalType": "uint256", "name": "broadcast_id", "type": "uint256" }, { "internalType": "enum Stations.Broadcast_Types", "name": "broadcast_type", "type": "uint8" }, { "internalType": "bool", "name": "deleted_p", "type": "bool" }, { "internalType": "bool", "name": "edited_p", "type": "bool" }, { "internalType": "bool", "name": "render_p", "type": "bool" } ], "internalType": "struct Stations.Broadcast[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "get_all_users", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "is_admin_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "is_allowed_in_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "username", "type": "string" } ], "name": "join_station", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "content", "type": "string" } ], "name": "make_a_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "make_prime_broadcast", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "remove_admin", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "reverse_whitelist", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "station_info", "outputs": [ { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "enum Stations.Station_Types", "name": "", "type": "uint8" }, { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "who", "type": "address" } ], "name": "user_already_in_station_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "a_name", "type": "string" } ], "name": "username_already_in_station_p", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "someone", "type": "address" } ], "name": "whitelist_address", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "whoami", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ];

const DEBUG = true;

/* lookup table from chain name to RPC url */
const rpcURLMap = {
  "polygon": "https://rpc-mainnet.maticvigil.com/v1/a383485c02d70e19b2660c539983b17e9566a297",
  // "polygon": "https://mainnet.infura.io/v3/0ae659d27dcc457b9d3f7dde8f17eb23",
  "avalanche": "https://rpc.ankr.com/avalanche",
  // "avalanche": "https://speedy-nodes-nyc.moralis.io/f08cc0c31a3595e665f7d9d2/avalanche/mainnet",
};

function dlog(astring){ if(DEBUG) console.log(astring); }

const chain = document.documentElement.getAttribute("chain");
const contract = document.documentElement.getAttribute("contract");

/* set the proper RPC URL */
const rpcURLInUse = rpcURLMap[chain];

dlog("window.ethereum: " + window.ethereum);
dlog("chain: " + chain);
dlog("contract: " + contract);
dlog("rpc url in use: " + rpcURLInUse);


let ETH_WIN_AVAILABLE_P = false;
let web3;
let current_account = false;
let currentStationInfo;
let myContract;


function getBackStationInfoObject(error, objFromChain){
  currentStationInfo = {
    stationName: objFromChain["0"],
    stationFrequency: objFromChain["1"]
  };

  document.title = "[stations.network] " + currentStationInfo.stationName;
  $("#stationname").text(currentStationInfo.stationName);

  return currentStationInfo;
}


function connectToMetamask(){
  dlog("`connectToMetamask()` was called");
  if(window.ethereum){
    web3 = new Web3(window.ethereum);
    ETH_WIN_AVAILABLE_P = true;
  } else{
    alert("not detecting metamask! :(");
    return false; //TODO: what should I do here?
  }
  dlog("attempting to request accounts");
  web3.eth.requestAccounts().then(accounts => {
    current_account=accounts[0];
    web3.eth.defaultAccount=accounts[0];
    set_login_info(current_account);
  });

  // myContract = new web3.eth.Contract(STATION_ABI, contract);
  // TODO: fix this ugliness
  if(chain=="avalanche"){
    myContract = new web3.eth.Contract(STATION_ABI, contract);
  } else if(chain=="polygon"){
    myContract = new web3.eth.Contract(STATION_ABI, contract,
      { gasPrice: '70000000000'}); // 70 gwei
  }


  $("#broadcastthis").click(function() {
    myContract.methods.make_a_broadcast($("#thebroadcast").val()).send({from:
      current_account},
      function(error, result){ console.log(result); });
  });
  $("#addavaxnetwork").click(addAvalancheNetwork);
  $("#addpolygonnetwork").click(addPolygonNetwork);
}


// web3.eth.getChainId().then(console.log);
// avax is 43114
// polgon is 137


$(document).ready(function() {

  dlog("we're ready");

  /* connect to metamask */
  // if(window.ethereum){
  //   web3 = new Web3(window.ethereum);
  //   ETH_WIN_AVAILABLE_P = true;
  // } else{
  web3 = new Web3(rpcURLInUse);
  // }

  /* connect to the contract */
  // TODO: fix this ugliness
  if(chain=="avalanche"){
    myContract = new web3.eth.Contract(STATION_ABI, contract);
  } else if(chain=="polygon"){
    myContract = new web3.eth.Contract(STATION_ABI, contract,
      { gasPrice: '70000000000'}); // 70 gwei
  }

  /* get and station info (and populate relevant elements) */
  myContract.methods.station_info().call({}, getBackStationInfoObject);

  /* get and display all broadcasts */
  myContract.methods.get_all_broadcasts().call({},
    function(error, result){
      jQuery.each(result, function(){
        // TODO
        try{
          insert_broadcast(this);
          console.log(this);
        } catch (error){
          console.log("broadcast insertion failed: " + error);
        }
      });
  });

  if(ETH_WIN_AVAILABLE_P){
    dlog("attemping to set current account");
    web3.eth.requestAccounts().then(accounts => {
      current_account=accounts[0];
      web3.eth.defaultAccount=accounts[0];
      set_login_info(current_account);
    });
  } else{
    console.log("  there's no current account to get");
  }


  $("#morepseudobutton").click(function() {
    var correct_big_height = 180;
    // console.log($("#topbar").height());
    if($("#topbar").height()!=correct_big_height){
      $("#topbar").height("180px");
      $("#moreinside").show();
    } else {
      $("#topbar").height("20px");
      $("#moreinside").hide()
    }
  });

  $("#connectbutton").click(function() {
    dlog("click!");
    connectToMetamask();
  });

  $("#exportbutton").click(function() {
    let expFileName = `${currentStationInfo.stationFrequency}-export-${Date.now()}.json`;
    let allBroadcasts = [];
    dlog("beginning export");
    // TODO: about to do dirty hack
    myContract.methods.get_all_broadcasts().call({},
      function(error, result){
        jQuery.each(result, function(){
          // TODO
          try{
            let dirtyHack = JSON.stringify(this);
            allBroadcasts.push(this);
          } catch (error){
            console.log("no");
          }
        });
      download(expFileName, JSON.stringify(allBroadcasts));
      });
  });

  $("#importbutton").click(doupload);

});


    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

  function doupload() {
      let data = document.getElementById("file").files[0];
      let entry = document.getElementById("file").files[0];
      console.log('doupload',entry,data)
      fetch('uploads/' + encodeURIComponent(entry.name), {method:'PUT',body:data});
      alert('your file has been uploaded');
      location.reload();
  };


function set_login_info(current_account){
  if(current_account==false){
    $("#current_login").html("not logged in");
    console.log(">>>> NOT LOGGED IN");
  } else {
    $("#current_login").text("currently logged on as: " + current_account);
  }
}

function restrict(elem){
  var tf = _(elem);
  var rx = new RegExp;
  if(elem == "email"){
       rx = /[ '"]/gi;
  } else if(elem == "search" || elem == "comment"){
    rx = /[^a-z 0-9.,?]/gi;
  } else{
      rx =  /[^a-z0-9]/gi;
  }
  tf.value = tf.value.replace(rx , "" );
}


function safe(some){
  return $('<div/>').text(some).html();
}

function insert_broadcast(ajson){
  const htmlString = `
        <div class="broadcast piece">
          <div class="broadcast_header">
            <div class="username">${ajson.username}</div>
            <div class="betweenusernameandtimestamp">
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            </div>
            <div class="timestamp">${format_time(ajson.unix_timestamp)}</div>
          </div>
          <div class="bcontent_container">
            <label class="broadcast_content" id="currentbroadcast">${ajson.content}</label>
          </div>
        </div>`;
  $("#broadcasts_holder").prepend(htmlString);
  return true;
}

            // <label class="lyrics" id="currentsong">${ajson.lyrics}</label>
            //<label class="lyrics" id="currentsong">${safe(ajson.lyrics)}</label>

// <div class="address">${ajson.singer}</div>
// <div class="address">${format_time(ajson.unix_timestamp)}</div>

          // <div class="song_footer">
          //   <label class=thetime>${format_time(ajson.unix_timestamp)}</label>
          // </div>

// taken from stack overflow
function format_time(s) {
  // const dtFormat = new Intl.DateTimeFormat('default', {
  //   timeStyle: 'medium',
  //   timeZone: 'EST'
  // });
  // return dtFormat.format(new Date(s * 1e3));
  return new Intl.DateTimeFormat('default',
    {timeZone: 'America/New_York',
     hour: 'numeric', minute: 'numeric', second: 'numeric',
     year: 'numeric', month: 'numeric', day: 'numeric',
    }).format(s * 1e3);
}


