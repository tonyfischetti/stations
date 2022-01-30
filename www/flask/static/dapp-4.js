
// TODO: react to network changes

const CLIENT_STATIONS_VERSION = "v1";

const DEBUG             = true;
const CHAIN             = document.documentElement.getAttribute("chain");
const CONTRACT_ADDRESS  = document.documentElement.getAttribute("contract");
const STATIONS_VERSION  = document.documentElement.getAttribute("version");
const RPC_URL_IN_USE    = RPC_URL_MAP[CHAIN];
const ABI_IN_USE        = STATION_ABIS[STATIONS_VERSION];

let web3;
let myContract;
let stationInfo;
let allBroadcasts;

/* debug function print messages to a text area element */
const _DEBUG = (msg) => {
  if (DEBUG){
    let area = document.getElementById("debugArea");
    if (msg === undefined){
      area.value = "";
    } else {
      let tmp = area.value;
      area.value = tmp + "\n" + msg;
    }
  }
};

/* runs when DOM is finished loading */
const startDapp = () => {

  _DEBUG();
  _DEBUG("document ready");
  _DEBUG("chain:            " + CHAIN);
  _DEBUG("contract address: " + CONTRACT_ADDRESS);
  _DEBUG("stations version: " + STATIONS_VERSION);
  _DEBUG("");

  const connectButton = document.getElementById("connectButton");

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

  MetaMaskClientCheck();

  _DEBUG("\nafter metamask client check");
  web3 = new Web3(RPC_URL_IN_USE);
  _DEBUG("made new web3 object. attempting to connect to contract");
  myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);
  _DEBUG("made contract object");
  myContract.methods.station_info().call({}, getStationInfo);
  _DEBUG("got station info");

  /* get and display all broadcasts */
  myContract.methods.get_all_broadcasts().call({},
    function(error, result){
      if (error){
        alert("UNHANDLED ERROR:\n" + error);
        return;
      }
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


  // TODO!!!
  // Get the modal
  var modal = document.getElementById("myModal");
  // Get the button that opens the modal
  var btn = document.getElementById("composeButton");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  let broadcastButton = document.getElementById("broadcastButton");
  broadcastButton.onclick = function(){
    let toBroadcast = document.getElementById("compositionArea").value;
    console.log(toBroadcast);
  };

};


const insertBroadcast = (bcast) => {
  // TODO: dispatch based on type
  insertBroadcast_HTML(bcast);
};

// TODO: what the hell is 'piece'??
// TODO: does the templating make this unsafe?
const insertBroadcast_HTML = (bcast) => {
  let containerElement = document.getElementById("broadcastsHolder");
  const htmlString = `
        <div class="broadcast piece">
          <div class="broadcastHeader">
            <div class="username">${bcast.username}</div>
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


function fillStationInfoOnDOM(){
  document.title = "[stations.network] " + stationInfo.stationName;
  let elStationName           = document.getElementById("stationName");
  let elStationDescription    = document.getElementById("stationDescription");

  elStationName.textContent = stationInfo.stationName;
  elStationDescription.textContent = stationInfo.stationDescription;
}

function getStationInfo(error, objFromChain){
  if (error){
    alert("UNHANDLED ERROR:\n" + error);
    return;
  }
  stationInfo = {
    stationName:          objFromChain["0"],
    stationFrequency:     objFromChain["1"],
    stationDescription:   objFromChain["2"],
    stationVersion:       objFromChain["3"],
    creator:              objFromChain["4"],
    createdOn:            objFromChain["5"],
    stationType:          objFromChain["6"],
    stationFlags:         objFromChain["7"],
  };
  fillStationInfoOnDOM();
}


// TODO: rename . when we log in. things change
const setUpLoggedInElements = () => {
  let connectButton = document.getElementById("connectButton");
  connectButton.innerText = "logged in as " +
    window.ethereum.selectedAddress.substring(0, 7) + "...";
  // now it should change into a button that shows info
  connectButton.onclick = connectButtonClicked_Info;

  // have to use metamask provider now
  web3 = new Web3(window.ethereum);

  // /* connect to the contract */
  // TODO: fix this ugliness
  if(CHAIN=="avalanche"){
    myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);
  } else if(CHAIN=="polygon"){
    myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS,
      { gasPrice: '500000000000'}); // 500 gwei
  }

  let broadcastButton = document.getElementById("broadcastButton");
  broadcastButton.onclick = makeSimpleBroadcast;
};

const makeSimpleBroadcast = () => {
  let toBroadcast = document.getElementById("compositionArea").value;
  _DEBUG("attempting to broadcast: " + toBroadcast);
  myContract.methods.make_broadcast_simple(toBroadcast).send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){
        alert("UNHANDLED ERROR:\n" + error);
        return;
      }
      console.log(result);
    });
};


const connectButtonClicked_Connect = async () => {
  try {
    _DEBUG("\nattempting to connect to metamask client");
    let connectButton = document.getElementById("connectButton");
    // await ethereum.request({ method: 'eth_requestAccounts' });
web3.eth.requestAccounts()
    _DEBUG("network version: " + ethereum.networkVersion);
    _DEBUG("selected address: " + window.ethereum.selectedAddress);
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

// taken from stack overflow
// TODO: not everyone is in NY
const formatTimestamp = (atimestamp) => {
  return new Intl.DateTimeFormat('default',
    { timeZone: 'America/New_York',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      year: 'numeric', month: 'numeric', day: 'numeric',
    }).format(atimestamp * 1e3);
}

// TODO: this doesn't toggle
const toggleElementVisibility = (aselector) => {
  let tmp = document.querySelector(aselector);
  tmp.style.display = "block";
};

// start the dapp when the DOM is finished loading
window.addEventListener('DOMContentLoaded', startDapp);

