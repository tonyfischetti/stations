
// TODO: react to network changes

'use strict';

const CLIENT_STATIONS_VERSION = "v1";

const DEBUG             = true;
const CHAIN             = document.documentElement.getAttribute("chain");
const CONTRACT_ADDRESS  = document.documentElement.getAttribute("contract");
const STATIONS_VERSION  = document.documentElement.getAttribute("version");
const DEBUG_P           = document.documentElement.getAttribute("debug");
const SCROLL_TO         = document.documentElement.getAttribute("scrollto");
const LANG              = document.documentElement.getAttribute("lang");
const RPC_URL_IN_USE    = RPC_URL_MAP[CHAIN];
const ABI_IN_USE        = STATION_ABIS[STATIONS_VERSION];

let web3;
let myContract;

let stationState = {};
stationState["stationInfo"] = {};
stationState.contract = {};
stationState.contract.chain = CHAIN;
stationState.contract.address = CONTRACT_ADDRESS;
stationState["allUsers"] = {};
stationState["allBroadcasts"] = [];

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
  _DEBUG("");

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

  /* _now_ we can enable the export button */
  let exportButton = document.getElementById("exportButton");
  exportButton.disabled = false;
  exportButton.onclick = exportBroadcasts;

  /* we can't handle big network changes, right now  *
   * just reload                                     */
  window.ethereum.on('networkChanged', handleBigMetamaskChange);
  window.ethereum.on('accountsChanged', handleBigMetamaskChange);
  window.ethereum.on('chainChanged', handleBigMetamaskChange);

  const modal = document.getElementById("myModal");
  const composeButton = document.getElementById("composeButton");
  const modClose = document.getElementsByClassName("close")[0];
  composeButton.onclick = function() { modal.style.display = "block"; }
  modClose.onclick = function() { modal.style.display = "none"; }

  /* When the user clicks anywhere outside of the modal, close it */
  window.onclick = function(event) {
    if (event.target == modal) { modal.style.display = "none"; }
  }

  if (SCROLL_TO !== "None"){
    waitForElement(SCROLL_TO, () => {
      scrollToBroadcastID(SCROLL_TO);
      callAttentionToElement(SCROLL_TO);
    }, 1000, 30000);
  }

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

  console.log("supposed to make compose visible now");
  toggleElementVisibility("#composeButton", "inline");

  let specifiedButton = document.getElementById("rawHTML_broadcastButton");
  specifiedButton.onclick = makeRawHTMLBroadcast;

  specifiedButton = document.getElementById("rawHTMLForgedTimestamp_broadcastButton");
  specifiedButton.onclick = makeRawHTMLForgedDateBroadcast;

  specifiedButton = document.getElementById("image_broadcastButton");
  specifiedButton.onclick = makeImageBroadcast;
};

const replaceWeb3andMyContractAfterLogin = () => {
  web3 = new Web3(window.ethereum);
  // myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);

  // TODO: fix this ugliness
  if(CHAIN=="polygon"){
    myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS,
      { gasPrice: '60000000000'}); // 60 gwei
  } else {
    myContract = new web3.eth.Contract(ABI_IN_USE, CONTRACT_ADDRESS);
  }
};

const connectButtonClicked_Connect = async () => {
  let ret = false;
  try {
    _DEBUG("\nattempting to connect to metamask client");
    let connectButton = document.getElementById("connectButton");
    await ethereum.request({ method: 'eth_requestAccounts' });
    let currentChainId = ethereum.networkVersion;
    let detectedChain = CHAIN_ID_MAPPING[currentChainId];
    _DEBUG("selected address: " + window.ethereum.selectedAddress);
    _DEBUG("network version: " + currentChainId);
    if(PROVIDER_PARAMS[CHAIN].chainName===detectedChain){
      _DEBUG("we appear to be on the right blockchain");
      ret = true;
      setUpLoggedInElements();
    } else {
      let ermes = makeWrongChainMessage(currentChainId, detectedChain,
        PROVIDER_PARAMS[CHAIN].chainName);
      if(confirm(ermes)){
        _DEBUG("switching to the correct network");
        await addOrSwitchNetwork(CHAIN);
      } else {
        _DEBUG("user declined to change networks... bailing out");
        ret = false;
      }
    }
  } catch (error) {
    alert("UNHANDLED ERROR:\n" + error);
    ret = false;
  }
  if(ret)
    setUpLoggedInElements();
  return ret;
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
  document.title = "[stations.network] " + stationState.stationInfo.stationName;
  const elStationName           = document.getElementById("stationName");
  const elStationDescription    = document.getElementById("stationDescription");
  elStationName.textContent = stationState.stationInfo.stationName;
  elStationDescription.textContent = stationState.stationInfo.stationDescription;
}

function getStationInfo(error, objFromChain){
  if (error){ alert("UNHANDLED ERROR:\n" + error); return; }

  stationState.stationInfo = {
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
      stationState.allUsers[tmpaddress] = {
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

const makeBroadcastPrettier = (bcast) => {
  const [broadcastID, unixTimestamp, author, content, signature,
    parent, broadcastType, broadcastFlags, broadcastMetadata] = bcast;
  return {broadcastID, unixTimestamp, author, content, signature,
    parent, broadcastType, broadcastFlags, broadcastMetadata};
};

/* get and display all broadcasts */
async function getAllBroadcasts(){
  myContract.methods.get_all_broadcasts().call({},
    function(error, result){
      if (error){ alert("UNHANDLED ERROR:\n" + error); return; }
      console.log(result);
      stationState.allBroadcasts = result.map(makeBroadcastPrettier);
      stationState.allBroadcasts.map(bcast => {
        try{
          insertBroadcast(bcast);
        } catch (error){
          console.log("broadcast insertion failed: " + error);
        }
      });
  });
  _DEBUG("got all broadcasts\n");
}

const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const exportBroadcasts = () => {
  let expFileName =
    `${stationState.stationInfo.stationFrequency}-export-${Date.now()}.json`;
  // TODO: check for errors
  download(expFileName, JSON.stringify(stationState, null, 2));
};




const scrollToBroadcastID = (theid) => {
  document.getElementById(theid).scrollIntoView();
};


const getSignature = async (text) => {
  let inHex = web3.utils.utf8ToHex(text);
  let hashed = web3.utils.keccak256(inHex);
  return await web3.eth.personal.sign(hashed, window.ethereum.selectedAddress);
}


const toggleElementVisibility = (aselector, type="block") => {
  const tmp = document.querySelector(aselector);
  console.log(`got tmp: ${tmp}`);
  console.log(`display is: ${tmp.style.display}`);
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





const handleBigMetamaskChange = (something) => {
  window.location.reload();
};


function waitForElement(id, callback, checkFrequencyInMs, timeoutInMs) {
  let startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.getElementById(id) != null) { callback(); return; }
    else {
      setTimeout(function() {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs){ return; }
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

function callAttentionToElement(id){
  console.log("call attention was called");
  document.getElementById(id).style.opacity = "0";
  (function stepUpOpacity() {
    let currentOpacity = document.getElementById(id).style.opacity;
    let newOpacity = String(+currentOpacity + 0.01);
    if (+currentOpacity >= 1){ return; }
    else {
      setTimeout(function() {
        document.getElementById(id).style.opacity = newOpacity;
        stepUpOpacity();
      }, 1);
    }
  })();
}

// --------------------------------------------------------------- //

/* broadcast functions for different types
 * (see TODO in html template)             */


const makeRawHTMLBroadcast = async () => {
  let toBroadcast = document.getElementById("rawHTML_compositionArea").value;
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

const makeRawHTMLForgedDateBroadcast = async () => {
  console.log("making forgery!");
  let toBroadcast = document.getElementById("rawHTMLForgedTimestamp_compositionArea").value;
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

const makeImageBroadcast = async () => {
  console.log("posting image");
  let imageURL = document.getElementById("imageURL").value;
  let altText = document.getElementById("altText").value;
  let imageCaption = document.getElementById("imageCaption").value;

  let toBroadcast = `<figure><img src="${imageURL}" alt="${altText}">
                     <figcaption>${imageCaption}</figcaption></figure>`;

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



// --------------------------------------------------------------- //

/* display rules for different broadcast Types */

const insertBroadcast = (bcast) => {
  // TODO: write this better
  if(spec_bcastCheckDeleted(+bcast.broadcastFlags)){
    _DEBUG(`[insertion] broadcastID ${bcast.broadcastID} - skipped (deleted)`);
    return;
  }
  else if(spec_bcastCheckSystem(+bcast.broadcastFlags)){
    _DEBUG(`[insertion] broadcastID ${bcast.broadcastID} - skipped (system)`);
    return;
  }
  // TODO: dispatch based on type
  insertBroadcast_HTML(bcast);
};

// TODO: does the templating make this unsafe?
const insertBroadcast_HTML = (bcast) => {
  let containerElement = document.getElementById("broadcastsHolder");
  const htmlString = `
        <div id=${bcast.broadcastID} class="broadcast">
          <div class="broadcastHeader">
            <div class="username">
              ${stationState.allUsers[bcast.author].username}
            </div>
            <div class="broadcastTimestamp">
              ${formatTimestamp(bcast.unixTimestamp)}
            </div>
          </div>
          <div class="broadcastContentContainer">
            <label class="broadcastContent">${bcast.content}</label>
          </div>
        </div>`;
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

// --------------------------------------------------------------- //
