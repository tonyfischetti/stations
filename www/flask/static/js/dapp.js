
// TODO: react to network changes

const CLIENT_STATIONS_VERSION = "v1";

const DEBUG             = true;
const CHAIN             = document.documentElement.getAttribute("chain");
const CONTRACT_ADDRESS  = document.documentElement.getAttribute("contract");
const STATIONS_VERSION  = document.documentElement.getAttribute("version");
const DEBUG_P           = document.documentElement.getAttribute("debug");
const RPC_URL_IN_USE    = RPC_URL_MAP[CHAIN];
const ABI_IN_USE        = STATION_ABIS[STATIONS_VERSION];

let web3;
let myContract;
let stationInfo;
let allBroadcasts;
let allUsers = {};

let _DEBUG;




/* ---------------------------------------------------------------- */

/*************************************/
/* runs when DOM is finished loading */
/*************************************/
const startDapp = async () => {

  makeDebugFunction();

  _DEBUG("document ready");
  _DEBUG("chain:            " + CHAIN);
  _DEBUG("contract address: " + CONTRACT_ADDRESS);
  _DEBUG("stations version: " + STATIONS_VERSION);
  _DEBUG("\n");

  const connectButton = document.getElementById("connectButton");

  MetaMaskClientCheck();

  _DEBUG("after metamask client check");
  web3 = new Web3(RPC_URL_IN_USE);
  _DEBUG("made new web3 object. attempting to connect to contract");
  myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);
  _DEBUG("made contract object");

  await myContract.methods.station_info().call({}, getStationInfo);
  await myContract.methods.get_all_users().call({}, getUserInfo);
  await getAllBroadcasts();

  let exportButton = document.getElementById("exportButton");
  exportButton.onclick = exportBroadcasts;

  const modal = document.getElementById("myModal");
  const composeButton = document.getElementById("composeButton");
  const modClose = document.getElementsByClassName("close")[0];
  composeButton.onclick = function() { modal.style.display = "block"; }
  modClose.onclick = function() { modal.style.display = "none"; }

  /* When the user clicks anywhere outside of the modal, close it */
  window.onclick = function(event) {
    if (event.target == modal) { modal.style.display = "none"; }
  }

  let broadcastButton = document.getElementById("broadcastButton");
  broadcastButton.onclick = function(){
    let toBroadcast = document.getElementById("compositionArea").value;
    console.log(toBroadcast);
  };

};

/* ---------------------------------------------------------------- */

const isMetaMaskInstalled = () => {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};

const MetaMaskClientCheck = () => {
  _DEBUG("checking for metamask client");
  if (!isMetaMaskInstalled()) {
    _DEBUG("metamask not found");
    connectButton.innerText = "connect";
    connectButton.onclick = connectButtonClicked_Onboard;
  } else {
    _DEBUG("metamask detected");
    connectButton.innerText = 'Connect';
    connectButton.onclick = connectButtonClicked_Connect;
    connectButton.disabled = false;
  }
};

const setUpLoggedInElements = () => {
  let connectButton = document.getElementById("connectButton");
  connectButton.innerText = "logged in as " +
  window.ethereum.selectedAddress.substring(0, 7) + "...";
  connectButton.onclick = connectButtonClicked_Info;

  /* have to use metamask provider now--so we'll change the web3 var */
  replaceWeb3andMyContractAfterLogin();

  toggleElementVisibility("#composeButton", "inline");

  let broadcastButton = document.getElementById("broadcastButton");
  broadcastButton.onclick = makeSimpleBroadcast;
};

const replaceWeb3andMyContractAfterLogin = () => {
  web3 = new Web3(window.ethereum);
  myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);

  // TODO: fix this ugliness
  // if(CHAIN=="polygon"){
  //   myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS,
  //     { gasPrice: '500000000000'}); // 500 gwei
  // } else {
  //   myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);
  // }
};

const connectButtonClicked_Connect = async () => {
  try {
    _DEBUG("\nattempting to connect to metamask client");
    let connectButton = document.getElementById("connectButton");
    await ethereum.request({ method: 'eth_requestAccounts' });
    let currentChainId = ethereum.networkVersion;
    let detectedChain = CHAIN_ID_MAPPING[currentChainId];
    _DEBUG("selected address: " + window.ethereum.selectedAddress);
    _DEBUG("network version: " + currentChainId);
    if (PROVIDER_PARAMS[CHAIN].chainName===detectedChain) {
      setUpLoggedInElements();
      _DEBUG("we appear to be on the right blockchain");
    } else {
      let ermes = makeWrongChainMessage(currentChainId, detectedChain,
        PROVIDER_PARAMS[CHAIN].chainName);
      if (confirm(ermes)) {
        _DEBUG("switching to the correct network");
        addOrSwitchNetwork(CHAIN);
      } else {
        _DEBUG("user declined to change networks... bailing out");
        return;
      }
    }
    setUpLoggedInElements();
  } catch (error) {
    alert("UNHANDLED ERROR:\n" + error);
  }
};

const connectButtonClicked_Info = () => {
  alert("NOT IMPLEMENTED (connection info)");
};

const connectButtonClicked_Onboard = () => {
  alert("NOT IMPLEMENTED (onboarding)");
};

const makeDebugFunction = () => {
  /* if debug is true, this constructs the a working _DEBUG
   * function. If not, it's a no-op function */
  if(DEBUG_P==="true"){
    console.log("debug is true");
    let tmp = document.getElementById("debugContainer");
    tmp.style.display = "block";
    let area = document.getElementById("debugArea");
    area.value = "";
    _DEBUG = (msg) => {
      let tmp = area.value;
      area.value = tmp + "\n" + msg;
    };
  } else{
    _DEBUG = (msg) => { return; }
  }
};

function fillStationInfoOnDOM(){
  document.title = "[stations.network] " + stationInfo.stationName;
  const elStationName           = document.getElementById("stationName");
  const elStationDescription    = document.getElementById("stationDescription");
  elStationName.textContent = stationInfo.stationName;
  elStationDescription.textContent = stationInfo.stationDescription;
}

function getStationInfo(error, objFromChain){
  if (error){ alert("UNHANDLED ERROR:\n" + error); return; }

  stationInfo = {
    stationName:          objFromChain["0"],
    stationFrequency:     objFromChain["1"],
    stationDescription:   objFromChain["2"],
    stationVersion:       objFromChain["3"],
    creator:              objFromChain["4"],
    createdOn:            objFromChain["5"],
    stationType:          objFromChain["6"],
    stationFlags:         objFromChain["7"],
    stationMetadata:      objFromChain["8"],
  };

  fillStationInfoOnDOM();
  _DEBUG("got station info");
}

function getUserInfo(error, objFromChain){
  if (error){ alert("UNHANDLED ERROR:\n" + error); return; }

  objFromChain.map(it => {
    if(it[1]!=="uncaused-cause"){
      let tmpaddress =  it[0];
      allUsers[tmpaddress] = {
        username:       it[1],
        time_joined:    it[2],
        user_metadata:  it[3]
      };
    }
  });
  _DEBUG("got user info");
}

const formatTimestamp = (atimestamp) => {
  return new Intl.DateTimeFormat('default',
    { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      year: 'numeric', month: 'numeric', day: 'numeric',
    }).format(atimestamp * 1e3);
}

const insertBroadcast = (bcast) => {
  // TODO: write this better
  if(spec_bcastCheckDeleted(+bcast.broadcast_flags) ||
     spec_bcastCheckSystem(+bcast.broadcast_flags)){
    return;
  }
  // TODO: dispatch based on type
  insertBroadcast_HTML(bcast);
};

// TODO: does the templating make this unsafe?
const insertBroadcast_HTML = (bcast) => {
  let containerElement = document.getElementById("broadcastsHolder");
  const htmlString = `
        <div id=${bcast.broadcast_id} class="broadcast">
          <div class="broadcastHeader">
            <div class="username">
              ${allUsers[bcast.author].username}
            </div>
            <div class="broadcastTimestamp">
              ${formatTimestamp(bcast.unix_timestamp)}
            </div>
          </div>
          <div class="broadcastContentContainer">
            <label class="broadcastContent">${bcast.content}</label>
          </div>
        </div>`;
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

/* get and display all broadcasts */
async function getAllBroadcasts(){
  myContract.methods.get_all_broadcasts().call({},
    function(error, result){
      if (error){ alert("UNHANDLED ERROR:\n" + error); return; }
      console.log(result);
      allBroadcasts = result;
      result.map(bcast => {
        try{
          insertBroadcast(bcast);
        } catch (error){
          console.log("broadcast insertion failed: " + error);
        }
      });
  });
  _DEBUG("got all broadcasts");
}

const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const exportBroadcasts = () => {
  let expFileName =
    `${stationInfo.stationFrequency}-export-${Date.now()}.json`;
  // TODO: check for errors
  download(expFileName, JSON.stringify(allBroadcasts, null, 2));
};







const getSignature = async (text) => {
  let inHex = web3.utils.utf8ToHex(text);
  let hashed = web3.utils.keccak256(inHex);
  return await web3.eth.personal.sign(hashed, window.ethereum.selectedAddress);
}

const makeSimpleBroadcast = async () => {
  let toBroadcast = document.getElementById("compositionArea").value;
  let sig = await getSignature(toBroadcast);
  _DEBUG("attempting to broadcast: " + toBroadcast +
         " with signature: " + sig);
  myContract.methods.make_broadcast_simple(toBroadcast, sig, "0x0000",
                                           "0x0000", "").send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){
        alert("!UNHANDLED ERROR:\n" + error);
        return;
      }
      console.log(result);
    });
};

const makeForgedBroadcast = async () => {
  console.log("making forgery!");
  let toBroadcast = document.getElementById("compositionArea").value;
  let forgedTime = document.getElementById("forgedTimeArea").value;
  let sig = await getSignature(toBroadcast);
  _DEBUG("attempting to broadcast: '" + toBroadcast + "' for timestamp: " +
    forgedTime + " with signature: " + sig);
  myContract.methods._make_broadcast_forge_timestamp(toBroadcast,
                                                     forgedTime,
                                                     sig, "0x0000",
                                                     "0x0000", "").send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){ alert("UNHANDLED ERROR:\n" + error); return; }
      console.log(result);
    });
};


const toggleElementVisibility = (aselector, type="block") => {
  const tmp = document.querySelector(aselector);
  console.log(tmp.style.display);
  if (tmp.style.display === "none") {
    tmp.style.display = type;
  } else {
    tmp.style.display = "none";
  }
};


/**********************************************/
/* DOM is finished loading.... LEZZZ GOOOO!!! */
/**********************************************/
window.addEventListener('DOMContentLoaded', startDapp);


