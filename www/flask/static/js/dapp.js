'use strict';

import { PROVIDER_PARAMS, RPC_URL_MAP, CHAIN_ID_MAPPING,
         STATION_ABIS } from './support-dapp/chain-info.js';

import * as utils from './support-dapp/utils.js';
import * as contract from './support-dapp/contract-things.js';
import * as dom from './support-dapp/dom-things.js';
import * as bc from './support-dapp/broadcast-things.js';
import * as wallets from './support-dapp/wallet-things.js';
import * as crypto from './support-dapp/cryptography-things.js';

import * as ethers from './dependencies/ethers-5.2.esm.min.js';


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').
      then((registration) => {
        console.log('SW registered! Scope is:', registration.scope);
      });
  });
}


let stationState                      = {};
stationState["stationInfo"]           = {};
stationState.contract                 = {};
stationState.contract.chain           = utils.getDocAttr(document, "chain");
stationState.contract.address         = utils.getDocAttr(document, "contract");
stationState["allUsers"]              = {};
stationState["allBroadcasts"]         = [];
stationState["clientInfo"]            = {};
stationState.clientInfo.clientVersion = 0.9;
stationState.clientInfo.currentRPC    = RPC_URL_MAP[stationState.contract.chain];
stationState.clientInfo.debug_p       = utils.getDocAttr(document, "debug");

const SCROLL_TO                       = utils.getDocAttr(document, "scrollto");
const BASE_ABI_VERSION                = "v9";
var   _DEBUG;                           // global debug function





/* ---------------------------------------------------------------- */

/*************************************/
/* runs when DOM is finished loading */
/*************************************/
const startDapp = async () => {

  let   myContract;
  let   myAddress;
  let   provider;
  let   signer;

  _DEBUG = utils.makeDebugFunction(stationState.clientInfo.debug_p);
  window._DEBUG = _DEBUG;

  _DEBUG("document ready");
  _DEBUG("chain:            " + stationState.contract.chain);
  _DEBUG("contract address: " + stationState.contract.address);
  _DEBUG("client version:   " + stationState.clientInfo.clientVersion);
  _DEBUG("");

  provider = new ethers.providers.JsonRpcProvider(stationState.clientInfo.currentRPC);
  _DEBUG("made new ethers provider object. attempting to connect to contract");

  myContract = contract.getContract(stationState.contract.address,
    BASE_ABI_VERSION, provider);
  _DEBUG("made contract object with base ABI before knowing station version");


  /* ---------------------------------------------------------------- */
  /*                                                                  */
  /* getting station info and list of users                           */
  /*                                                                  */
  /* ---------------------------------------------------------------- */

  /* let's start, in earnest, by getting the station info */
  contract.getStationInfo(myContract).
    then((stationInfo) => {
      _DEBUG("retrieved station info from chain");
      stationState.stationInfo = stationInfo;
      dom.fillStationInfo(stationState);
    }).
    catch((error) => alert("Failed to get station info:\n" + error)).

    /* now that we know the stations version, we can use the correct ABI */
    then(() => {
     myContract = contract.getContract(stationState.contract.address,
       `v${stationState.stationInfo.stationVersion}`,
       provider);
      _DEBUG("contract var reconstructed with correct ABI version");
    }).

    /* now let's get all the users */
    then(() => contract.getUserInfo(myContract)).
    then((allUsers) => {
      _DEBUG("retrieved user info from chain");
      stationState.allUsers = allUsers;
    }).
    catch((error) => alert("Failed to get users information:\n" + error)).
  /* ---------------------------------------------------------------- */



    /* now let's get all the broadcasts */
    then(() => contract.getAllBroadcasts(myContract)).
    then((allBroadcasts) => {
      stationState.allBroadcasts = allBroadcasts.map(bc.makeBroadcastPrettier);
      _DEBUG("retrieved all broadcasts");
    }).
    catch((error) => alert("Failed to get broadcasts:\n" + error)).



    /* time to insert the broadcasts! */
    then(() => {
      stationState.allBroadcasts.map((bcast) => {
        bc.insertBroadcast(stationState, bcast);
      });
    }).


    /* broadcast are all loaded, now let's do everything else */
    then(() => {

      dom.toggleBlock("station-button-container")

      /* _now_ we can enable the export button */
      let exportButton = document.getElementById("export-button");
      exportButton.disabled = false;
      utils.attachEventCallback("export-button", () => { utils.exportBroadcasts(stationState) });



      /* ---------------------------------------------------------------- */
      /*                                                                  */
      /* set up contract listener                                         */
      /*                                                                  */
      /* ---------------------------------------------------------------- */
      /* set up event listener */ //TODO: move this somewhere else?
      // TODO: we have to listen to all events to make
      // sure the state is completely synced
      // and I think we have to add deleted broadcast (and perhaps others)
      // to the contract
      myContract.on("NewBroadcast", (bcast) => {
        _DEBUG("GOT SOMETHING!!!!!");
        bcast = bc.makeBroadcastPrettier(bcast);

        stationState.allBroadcasts.push(bcast);
        bc.insertBroadcast(stationState, bcast);
        // TODO: do we have to wait until the element is rendered?
        dom.addSingleActions(`bid${bcast.broadcastID}`);
      });
      /* ---------------------------------------------------------------- */



      utils.attachEventCallback("station-button", () => {
        dom.toggleBlock("station-button-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });
      utils.attachEventCallback("connect-button", () => { dom.switchStationButtonPopupPane("connect_station-button-popup-container") });
      utils.attachEventCallback("disconnect-button", () => { window.location.reload(); });

      utils.attachEventCallback("back-from-connect-pane-button", () => { dom.switchStationButtonPopupPane("main_station-button-popup-container") });
      utils.attachEventCallback("back-from-compose-pane-button", () => { dom.switchStationButtonPopupPane("main_station-button-popup-container") });
      utils.attachEventCallback("back-from-change-user-metadata-pane-button", () => { dom.switchStationButtonPopupPane("main_station-button-popup-container") });
      utils.attachEventCallback("back-from-change-pfp-pane-button", () => { dom.switchStationButtonPopupPane("change_user_metadata_station-button-popup-container") });

      utils.attachEventCallback("compose-button", () => { dom.switchStationButtonPopupPane("compose_station-button-popup-container") });
      utils.attachEventCallback("raw-html-compose-button", () => {
        console.log("triggered");
        dom.switchOperationPopupPane("raw-html-composition-container", true);
        dom.toggleBlock("station-button-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });
      utils.attachEventCallback("raw-html-cancel-button", () => {
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
        // !!!!!!!!!!!!!!!!!!!!!1
        dom.revertToNonEditOrReply("raw-html-composition-container");
      });
      utils.attachEventCallback("jam-compose-button", () => {
        console.log("triggered");
        dom.switchOperationPopupPane("jam-composition-container", true);
        dom.toggleBlock("station-button-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });
      utils.attachEventCallback("jam-cancel-button", () => {
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });

      utils.attachEventCallback("change-user-metadata-button", () => { dom.switchStationButtonPopupPane("change_user_metadata_station-button-popup-container") });
      utils.attachEventCallback("change-username-button", () => {
        console.log("triggered");
        dom.switchOperationPopupPane("change-username-container", true);
        dom.toggleBlock("station-button-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });
      utils.attachEventCallback("new-username-cancel-button", () => {
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });

      utils.attachEventCallback("change-pfp-button", () => { dom.switchStationButtonPopupPane("change-pfp-button-popup-container") });
      utils.attachEventCallback("change-pfp-via-link-button", () => {
        console.log("triggered");
        dom.switchOperationPopupPane("change-pfp-link-container", true);
        dom.toggleBlock("station-button-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });
      utils.attachEventCallback("new-pfp-link-cancel-button", () => {
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });

      utils.attachEventCallback("change-raw-metadata-button", () => {
        console.log("triggered");
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
        dom.switchOperationPopupPane("change-raw-metadata-container", true);
        dom.toggleBlock("station-button-popup");
      });
      utils.attachEventCallback("change-raw-metadata-button", () => {
        console.log("triggered");
        let tmp = document.getElementById("raw-metadata-area");
        tmp.value = JSON.stringify(stationState.allUsers[myAddress].user_metadata, null, 2);
        dom.switchOperationPopupPane("change-raw-metadata-container", true);
        dom.toggleBlock("station-button-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });
      utils.attachEventCallback("new-raw-metadata-cancel-button", () => {
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
      });



      // TODO: RESET THE FIELDS ON CANCEL!



      /* ---------------------------------------------------------------- */
      /*                                                                  */
      /* connect with metamask                                            */
      /*                                                                  */
      /* ---------------------------------------------------------------- */
      utils.attachEventCallback("metamask-connect-button", async () => {
        wallets.connectToMetaMask(stationState).
          then(({_provider, _signer, _myAddress}) => {
            provider = _provider;
            signer = _signer;
            myAddress = _myAddress;
            myContract = contract.getContract(stationState.contract.address,
              BASE_ABI_VERSION, provider);
            myContract = myContract.connect(signer);
            // listen to network changes and force-reload
            provider.on("network", (newNetwork, oldNetwork) => {
            if(oldNetwork)
              _DEBUG("The network swtiched! Bailing out!");
              window.location.reload();
            })
          }).
          catch((error) => alert("Failed to connect to Metamask:\n" + error)).
          then(() => { loginSuccessful(myContract, provider, signer); }).
          finally(() => { dom.hide("station-button-popup"); });

      });
      /* ---------------------------------------------------------------- */



      /* ---------------------------------------------------------------- */
      /*                                                                  */
      /* connect with private key things                                  */
      /*                                                                  */
      /* ---------------------------------------------------------------- */
      utils.attachEventCallback("priv-key-connect-button", async () => {
        _DEBUG("opening priv-key-connect-operation-container pane");
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
        dom.switchOperationPopupPane("priv-key-connect-operation-container", true);
        dom.hide("station-button-popup");
      });

      utils.attachEventCallback("priv-key-connect-operation-cancel-button", () => {
        dom.toggleFlex("operation-popup");
        dom.switchStationButtonPopupPane("main_station-button-popup-container");
        dom.clearPane("priv-key-connect-operation-container");
      });

      utils.attachEventCallback("priv-key-connect-operation-button", async () => {
        const secrets = document.getElementById("priv-key-connect-operation-input").value;
        wallets.connectWithPrivateKey(provider, secrets).
          then(({_signer, _myAddress}) => {
            signer = _signer;
            myAddress = _myAddress;
            myContract = myContract.connect(signer);
          }).
          catch((error) => alert("Failed to connect with private key:\n" + error)).
          then(() => {
            loginSuccessful(myContract, provider, signer);
          }).
          finally(() => {
            dom.clearPane("priv-key-connect-operation-container");
            dom.toggleFlex("operation-popup");
          });
      });
      /* ---------------------------------------------------------------- */





    });







  /* finally, scroll to the broadcast id provided (if given) */
  _DEBUG("scroll to       : " + SCROLL_TO);
  if (SCROLL_TO !== "None"){
    utils.waitForElement(`bid${SCROLL_TO}`, () => {
      utils.scrollToBroadcastID(`bid${SCROLL_TO}`);
      utils.callAttentionToElement(`bid${SCROLL_TO}`);
    }, 1000, 30000);
  }




};

/**********************************************/
/* DOM is finished loading.... LEZZZ GOOOO!!! */
/**********************************************/
window.addEventListener('DOMContentLoaded', startDapp);





const loginSuccessful = (myContract, provider, signer) => {
  dom.switchStationButtonPopupPane("main_station-button-popup-container");
  dom.setUpLoggedIn(provider);

  utils.attachEventCallback("raw-html-broadcast-button", () => {
    contract.makeRawHTMLBroadcast(myContract, signer).
      then((resp) => {
        console.log("worked");
        console.log(resp);
        dom.clearPane("raw-html-composition-container");
        dom.toggleFlex("operation-popup");
      });
      // finally(() => {
      //   dom.revertToNonEditOrReply("raw-html-composition-container");
      // });
    // TODO: handle errors
  });

  utils.attachEventCallback("jam-broadcast-button", () => {
    contract.makeJamBroadcast(myContract, signer);
  });

  utils.attachEventCallback("new-username-submit-button", () => {
    contract.changeUsername(myContract, stationState.allUsers).
      then(() => console.log("good")).
      catch((error) => alert("Failed to change username:\n" + error));
  });

  utils.attachEventCallback("new-pfp-link-submit-button", () => {
    contract.changePFPLink(myContract, stationState.allUsers[myAddress].user_metadata).
      then(() => console.log("good")).
      catch((error) => alert("Failed to change profile photo:\n" + error));
  });

  utils.attachEventCallback("new-raw-metadata-submit-button", () => {
    console.log("hi");
    contract.changeRawMetadata(myContract, stationState.allUsers[myAddress].user_metadata).
      then(() => console.log("good")).
      catch((error) => alert("Failed to change profile photo:\n" + error));
  });

  const bcastHolder = document.getElementById('broadcasts-holder');
  utils.attachEventCallback("broadcasts-holder", () => {
    if(event.target.nodeName !== 'BUTTON'){
      return;
    }
    // if(event.target.classList.contains("bcast-action-edit")){
    //   beginEdit(+(event.target.attributes.bid.value.replace(/^bid/, "")));
    // }
    if(event.target.classList.contains("bcast-action-reply")){
      console.log("triggered");
      let correctID = +(event.target.attributes.bid.value.replace(/^bid/, ""));
      dom.convertToReply("raw-html-composition-container", correctID);
      dom.switchOperationPopupPane("raw-html-composition-container", true);
      dom.toggleBlock("station-button-popup");
      dom.switchStationButtonPopupPane("main_station-button-popup-container");
    }
    if(event.target.classList.contains("bcast-action-delete")){
      let correctID = +(event.target.attributes.bid.value.replace(/^bid/, ""));
      contract.deleteBroadcast(myContract, correctID);
    }
  });
};









/* ---------------------------------------------------------------- */


// const beginEdit = async (anid) => {
//   const editModal = document.getElementById("edit-modal");
//   editModal.style.display = "block";
//   document.getElementById("edit-area").value = stationState.allBroadcasts[anid].content
//   const editButton = document.getElementById("edit-button");
//   editButton.onclick = async () => {
//     let toBroadcast = document.getElementById("edit-area").value;
//     let sig = await getSignature(toBroadcast);
//     _DEBUG("attempting to edit broadcast: " + anid +
//            " with new signature: " + sig);
//     myContract.methods.edit_broadcast(anid, toBroadcast, sig).send(
//       { from: window.ethereum.selectedAddress },
//       function(error, result){
//         if (error){
//           alert("!UNHANDLED ERROR:\n" + error);
//           return;
//         }
//         console.log(result);
//       });
//   };
// };
//
// const beginReply = async (anid) => {
//   const replyModal = document.getElementById("reply-modal");
//   replyModal.style.display = "block";
//
//   // hist is what?
//   document.getElementById("reply-area").placeholder =
//     `response to: "${stationState.allBroadcasts[anid].content}"`;
//   const replyButton = document.getElementById("reply-button");
//
//   replyButton.onclick = async () => {
//     let toBroadcast = document.getElementById("reply-area").value;
//     let sig = await getSignature(toBroadcast);
//     _DEBUG("attempting to reply to broadcast: " + anid +
//            " with signature: " + sig);
//     let rawXact = myContract.methods.do_broadcast(toBroadcast, sig, anid,
//                                                   "0x0000", "0x0000", "", 0);
//     // console.log(rawXact);
//     // rawXact.estimateGas( { from: window.ethereum.selectedAddress } );
//     rawXact.send(
//       { from: window.ethereum.selectedAddress },
//       function(error, result){
//         if (error){
//           alert("!UNHANDLED ERROR:\n" + error);
//           return;
//         }
//         console.log(result);
//       });
//   };
// };





// // --------------------------------------------------------------- //
//
// // TODO: separate more of the xactions from the spend
//
// // TODO: restructure so that it's its own page
// //
// const firstTryImport = () => {
//   let rawJson = document.getElementById("import-area").value;
//   let parsedJson = JSON.parse(rawJson);
//
//   parsedJson.allBroadcasts.map((bcast) => {
//     if(spec_bcastCheckDeleted(+bcast.broadcastFlags)){
//       _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - skipped (deleted)`);
//       return;
//     }
//     else if(spec_bcastCheckSystem(+bcast.broadcastFlags)){
//       _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - skipped (system)`);
//       return;
//     }
//     // TODO: should I use try, or halt?
//
//     let singleImportXaction =
//       myContract.methods.import_broadcast(bcast.unixTimestamp,
//                                         bcast.author,
//                                         bcast.content,
//                                         bcast.signature,
//                                         bcast.broadcastType,
//                                         bcast.broadcastFlags,
//                                         bcast.broadcastMetadata);
//     console.log(singleImportXaction);
//     singleImportXaction.send(
//       { from: window.ethereum.selectedAddress },
//       function(error, result){
//         if (error){
//           alert("!UNHANDLED ERROR:\n" + error);
//           _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - UNHANDLED ERROR: + ${error}`);
//           return;
//         }
//         console.log(result);
//     });
//     _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} successful!`);
//   });
//
// };




      // /////// ADDED TO PLAY AROUND WITH
      // utils.attachEventCallback("enc-wallet-connect-button", async () => {
      //   console.log("triggered");
      //   dom.toggleFlex("operation-popup");
      //   dom.switchStationButtonPopupPane("main_station-button-popup-container");
      //   dom.switchOperationPopupPane("enc-wallet-connect-operation-container", true);
      //   dom.hide("station-button-popup");
      // });
      //
      // utils.attachEventCallback("enc-wallet-connect-operation-cancel-button", () => {
      //   dom.toggleFlex("operation-popup");
      //   dom.switchStationButtonPopupPane("main_station-button-popup-container");
      // });
      //
      //
      // utils.attachEventCallback("enc-wallet-connect-operation-button", () => {
      //   let rawjson = document.getElementById("enc-wallet-connect-operation-area").value;
      //   let passwd = document.getElementById("enc-wallet-connect-operation-password-input").value;
      //   wallets.connectWithEncJSONWallet(provider, rawjson, passwd).
      //     then(({_signer, _myAddress}) => {
      //       signer = _signer;
      //       myAddress = _myAddress;
      //       myContract = myContract.connect(signer);
      //       dom.toggleFlex("operation-popup");
      //       loginSuccessful(myContract, provider, signer);
      //     }).
      //     catch((error) => alert("Failed to connect to encrypted wallet:\n" + error));
      // });
