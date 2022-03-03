
// TODO: react to network changes

'use strict';

// REPLACE

let stationState                      = {};
stationState["stationInfo"]           = {};
stationState.contract                 = {};
stationState.contract.chain           = getDocAttr(document, "chain");
stationState.contract.address         = getDocAttr(document, "contract");
stationState["allUsers"]              = {};
stationState["allBroadcasts"]         = [];
stationState["clientInfo"]            = {};
stationState.clientInfo.clientVersion = 0.7;
stationState.clientInfo.currentRPC    = RPC_URL_MAP[stationState.contract.chain];
stationState.clientInfo.debug_p       = getDocAttr(document, "debug");

const SCROLL_TO                       = getDocAttr(document, "scrollto");
const BASE_ABI_VERSION                = "v9";
let   _DEBUG;                           // global debug function
let   web3;
let   myContract;



const reconstructMyContractVar = (version, address, gasPrice=null) => {
  if(gasPrice){
    myContract = new web3.eth.Contract(STATION_ABIS[version], address,
      { gasPrice: gasPrice });
  } else{
    myContract = new web3.eth.Contract(STATION_ABIS[version], address);
  }
};



/* ---------------------------------------------------------------- */

/*************************************/
/* runs when DOM is finished loading */
/*************************************/
const startDapp = async () => {

  makeDebugFunction();

  _DEBUG("document ready");
  _DEBUG("chain:            " + stationState.contract.chain);
  _DEBUG("contract address: " + stationState.contract.address);
  _DEBUG("");

  const connectButton = document.getElementById("connectButton");

  MetaMaskClientCheck();

  web3 = new Web3(stationState.clientInfo.currentRPC);
  _DEBUG("made new web3 object. attempting to connect to contract");
  reconstructMyContractVar(BASE_ABI_VERSION, stationState.contract.address);
  _DEBUG("made contract object with base ABI before knowing station version");

  await myContract.methods.station_info().call({}, getStationInfo);
  /* now that we know the stations version, we can use the correct ABI */
  reconstructMyContractVar(`v${stationState.stationInfo.stationVersion}`,
                           stationState.contract.address);
  _DEBUG("recontructed myContract var with correct station version");
  await myContract.methods.get_all_users().call({}, getUserInfo);
  await getAllBroadcasts();

  /* _now_ we can enable the export button */
  let exportButton = document.getElementById("exportButton");
  exportButton.disabled = false;
  exportButton.onclick = exportBroadcasts;

  /* we can't handle big network changes, right now...    *
   * just reload                                          */
  window.ethereum.on('networkChanged', handleBigMetamaskChange);
  window.ethereum.on('accountsChanged', handleBigMetamaskChange);
  window.ethereum.on('chainChanged', handleBigMetamaskChange);

  const bcastHolder = document.getElementById('broadcastsHolder');
  bcastHolder.addEventListener('click', (event) => {
    if(event.target.nodeName !== 'BUTTON'){
      return;
    }

    if(event.target.classList.contains("bcast-action-edit")){
      beginEdit(+event.target.attributes.bid.value);
    }
    console.dir(+event.target.attributes.bid.value);
  });


  /****************/
  /* Modal things */
  /****************/

  /* composition modal things */
  const compositionModal = document.getElementById("composition-modal");
  const composeButton = document.getElementById("composeButton");
  const compositionModalClose = document.getElementById("composition-modal-close");
  composeButton.onclick = () => {
    compositionModal.style.display = "block";
  };
  compositionModalClose.onclick = () => { compositionModal.style.display = "none"; };

  /* edit modal things */
  const editModal = document.getElementById("edit-modal");
  const editModalClose = document.getElementById("edit-modal-close");
  editModalClose.onclick = () => { editModal.style.display = "none"; };

  /* reply modal things */
  const replyModal = document.getElementById("reply-modal");
  const replyModalClose = document.getElementById("reply-modal-close");
  replyModalClose.onclick = () => { replyModal.style.display = "none"; };

  /* debug modal things */
  const debugConsoleModal = document.getElementById("debug-console-modal");
  const debugConsoleButton = document.getElementById("debugConsoleButton");
  const debugConsoleModalClose = document.getElementById("debug-console-modal-close");
  debugConsoleButton.onclick = () => { debugConsoleModal.style.display = "block"; };
  debugConsoleModalClose.onclick = () => { debugConsoleModal.style.display = "none"; };

  /* import modal things */
  const importModal = document.getElementById("import-modal");
  const importButton = document.getElementById("importButton");
  const importModalClose = document.getElementById("import-modal-close");
  importButton.onclick = () => { importModal.style.display = "block"; };
  importModalClose.onclick = () => { importModal.style.display = "none"; };

  window.onclick = (event) => {
    _DEBUG(`[window click event] target: ${event.target}`);
    if (event.target == debugConsoleModal ||
        event.target == compositionModal ||
        event.target == editModal ||
        event.target == replyModal ||
        event.target == importModal) {
      debugConsoleModal.style.display = "none";
      compositionModal.style.display = "none";
      editModal.style.display = "none";
      replyModal.style.display = "none";
      importModal.style.display = "none";
    }
  };



  if (SCROLL_TO !== "None"){
    waitForElement(SCROLL_TO, () => {
      scrollToBroadcastID(SCROLL_TO);
      callAttentionToElement(SCROLL_TO);
    }, 1000, 30000);
  }

};

/* ---------------------------------------------------------------- */


const beginEdit = async (anid) => {
  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "block";
  document.getElementById("editArea").value = stationState.allBroadcasts[anid].content
  const editButton = document.getElementById("editButton");
  editButton.onclick = async () => {
    let toBroadcast = document.getElementById("editArea").value;
    let sig = await getSignature(toBroadcast);
    _DEBUG("attempting to edit broadcast: " + anid +
           " with new signature: " + sig);
    myContract.methods.edit_broadcast(anid, toBroadcast, sig).send(
      { from: window.ethereum.selectedAddress },
      function(error, result){
        if (error){
          alert("!UNHANDLED ERROR:\n" + error);
          return;
        }
        console.log(result);
      });
  };
};

const beginReply = async (anid) => {
  const replyModal = document.getElementById("reply-modal");
  replyModal.style.display = "block";

  // hist is what?
  document.getElementById("replyArea").value =
    `response to: "${stationState.allBroadcasts[anid].content}"`;
  const replyButton = document.getElementById("replyButton");

  replyButton.onclick = async () => {
    let toBroadcast = document.getElementById("replyArea").value;
    let sig = await getSignature(toBroadcast);
    _DEBUG("attempting to reply to broadcast: " + anid +
           " with signature: " + sig);
    let rawXact = myContract.methods.do_broadcast(toBroadcast, sig, anid,
                                                  "0x0000", "0x0000", "", 0);
    rawXact.send(
      { from: window.ethereum.selectedAddress },
      function(error, result){
        if (error){
          alert("!UNHANDLED ERROR:\n" + error);
          return;
        }
        console.log(result);
      });
  };
};




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

  // TODO do i need? (tmp todo)
  let doImportButton = document.getElementById("doImportButton");
  doImportButton.onclick = firstTryImport;

  /* have to use metamask provider now--so we'll change the web3 var */
  replaceWeb3andMyContractAfterLogin();

  console.log("supposed to make compose visible now");
  toggleElementVisibility("#composeButton", "inline");
  toggleElementVisibility("#importButton", "inline");

  let specifiedButton = document.getElementById("rawHTML_broadcastButton");
  specifiedButton.onclick = makeRawHTMLBroadcast;

  specifiedButton = document.getElementById("rawHTMLForgedTimestamp_broadcastButton");
  specifiedButton.onclick = makeRawHTMLForgedDateBroadcast;

  specifiedButton = document.getElementById("image_broadcastButton");
  specifiedButton.onclick = makeImageBroadcast;

  // TODO: maybe add broadcast actions here?
  //
  // Array.from(document.getElementsByClassName("broadcast")).map((it) => {
  //   console.log(it.id);
  //   let tmp = it.getElementsByClassName("broadcastActionsContainer")[0];
  //   tmp.insertAdjacentHTML("afterbegin", "HII");
  // });
};

const replaceWeb3andMyContractAfterLogin = () => {
  web3 = new Web3(window.ethereum);
  // TODO: fix this ugliness
  if(stationState.contract.chain=="polygon"){
    reconstructMyContractVar(`v${stationState.stationInfo.stationVersion}`,
                             stationState.contract.address,
                             "60000000000"); // 60 gwei
  } else {
    reconstructMyContractVar(`v${stationState.stationInfo.stationVersion}`,
                             stationState.contract.address);
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
    if(PROVIDER_PARAMS[stationState.contract.chain].chainName===detectedChain){
      _DEBUG("we appear to be on the right blockchain");
      ret = true;
      setUpLoggedInElements();
    } else {
      let ermes = makeWrongChainMessage(currentChainId, detectedChain,
        PROVIDER_PARAMS[stationState.contract.chain].chainName);
      if(confirm(ermes)){
        _DEBUG("switching to the correct network");
        await addOrSwitchNetwork(stationState.contract.chain);
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
  let tmp = document.getElementById("debugContainer");
  tmp.style.display = "block";
  let area = document.getElementById("debugArea");
  if(stationState.clientInfo.debug_p==="true"){
    console.log("debug is true");
    area.value = "";
    _DEBUG = (msg) => {
      let tmp = area.value;
      area.value = tmp + "\n" + msg;
    };
  } else{
    area.value = "(debug mode is off)";
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
  if (error){ alert("!UNHANDLED ERROR:\n" + error); return; }

  stationState.stationInfo = {
    stationName:          objFromChain["0"],
    stationFrequency:     objFromChain["1"],
    stationDescription:   objFromChain["2"],
    stationVersion:       objFromChain["3"],
    stationMinorVersion:  objFromChain["4"],
    creator:              objFromChain["5"],
    createdOn:            objFromChain["6"],
    stationType:          objFromChain["7"],
    stationFlags:         objFromChain["8"],
    stationMetadata:      objFromChain["9"],
    stationNumUsers:      objFromChain["10"],
    stationNumBroadcasts: objFromChain["11"],
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
  const [broadcastID, unixTimestamp, author, content, signature, parent,
    reference_count, broadcastType, broadcastFlags, broadcastMetadata] = bcast;
  return {broadcastID, unixTimestamp, author, content, signature, parent,
    reference_count, broadcastType, broadcastFlags, broadcastMetadata};
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

// TODO: replace `make_broadcast_simple`, etc... to non-deprecated one

const makeRawHTMLBroadcast = async () => {
  let toBroadcast = document.getElementById("rawHTML_compositionArea").value;
  let sig = await getSignature(toBroadcast);
  _DEBUG("attempting to broadcast: " + toBroadcast +
         " with signature: " + sig);
  let rawXact =
    myContract.methods.do_broadcast(toBroadcast, sig, 0, "0x0000",
                                             "0x0000", "", 0);
  // console.log(rawXact.estimateGas({ from: window.ethereum.selectedAddress }));
  rawXact.send(
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
  insertBroadcast_Delegator(bcast);
};

const insertBroadcast_Delegator = (bcast) => {
  // TODO: dispatch based on type
  insertBroadcast_HTML(bcast);
}


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
          <div class="broadcastActionsContainer">
            <button bid="${bcast.broadcastID}" class="bcast-action bcast-action-edit">edit</button>
          </div>
          <div class="broadcastFooter"></div>
        </div>`;
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

// --------------------------------------------------------------- //

// TODO: separate more of the xactions from the spend

// TODO: restructure so that it's its own page
//
const firstTryImport = () => {
  let rawJson = document.getElementById("importArea").value;
  let parsedJson = JSON.parse(rawJson);

  parsedJson.allBroadcasts.map((bcast) => {
    if(spec_bcastCheckDeleted(+bcast.broadcastFlags)){
      _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - skipped (deleted)`);
      return;
    }
    else if(spec_bcastCheckSystem(+bcast.broadcastFlags)){
      _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - skipped (system)`);
      return;
    }
    // TODO: should I use try, or halt?

    let singleImportXaction =
      myContract.methods.import_broadcast(bcast.unixTimestamp,
                                        bcast.author,
                                        bcast.content,
                                        bcast.signature,
                                        bcast.broadcastType,
                                        bcast.broadcastFlags,
                                        bcast.broadcastMetadata);
    console.log(singleImportXaction);
    singleImportXaction.send(
      { from: window.ethereum.selectedAddress },
      function(error, result){
        if (error){
          alert("!UNHANDLED ERROR:\n" + error);
          _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - UNHANDLED ERROR: + ${error}`);
          return;
        }
        console.log(result);
    });
    _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} successful!`);
  });

};


