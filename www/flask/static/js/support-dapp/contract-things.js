'use strict';

import * as ethers from '../dependencies/ethers-5.2.esm.min.js';


export const getContract = (address, version, provider) => {
  return new ethers.Contract(address, STATION_ABIS[version], provider);
};


export const getStationInfo = async (myContract) => {
  window._DEBUG("attempting getStationInfo");
  return new Promise((resolve, reject) => {
    myContract.station_info().
      then((objFromChain) => {
        let stationInfo = {
          stationName:          objFromChain["0"],
          stationFrequency:     objFromChain["1"],
          stationDescription:   objFromChain["2"],
          stationVersion:       objFromChain["3"].toNumber(),
          stationMinorVersion:  objFromChain["4"].toNumber(),
          creator:              objFromChain["5"],
          createdOn:            objFromChain["6"].toNumber(),
          stationType:          objFromChain["7"],
          stationFlags:         objFromChain["8"],
          stationMetadata:      objFromChain["9"],
          stationNumUsers:      objFromChain["10"].toNumber(),
          stationNumBroadcasts: objFromChain["11"].toNumber(),
        };

        resolve(stationInfo);
      }).
      catch((error) => reject(new Error(error)));
  });
};


export const getUserInfo = async (myContract) => {
  window._DEBUG("attempting getUserInfo");
  return new Promise((resolve, reject) => {
    myContract.get_all_users().
      then((objFromChain) => {
        let allUsers = {};
        objFromChain.map(it => {
          if(it[1]!=="uncaused-cause"){
            let [tmpaddress, username, time_joined, user_metadata] = it;
            try { user_metadata = JSON.parse(user_metadata); }
            catch { user_metadata = {} }
            allUsers[tmpaddress] = {
              username: username,
              time_joined: time_joined.toNumber(),
              user_metadata: user_metadata
            }
          }
        });
        resolve(allUsers);
      }).
      catch((error) => reject(new Error(error)));
  });
};


/* get and display all broadcasts */
export const getAllBroadcasts = async (myContract) => {
  window._DEBUG("attempting getAllBroadcasts");
  return new Promise((resolve, reject) => {
    myContract.get_all_broadcasts().
      then((objFromChain) => {
        resolve(objFromChain)
      }).
      catch((error) => reject(new Error(error)));
  });
};

// TODO::: make this return a xaction, instead (for DRY)?

// TODO::: clear text areas!!!

// TODO: document how the broadcast functions
//       double as the reply function
//       (maybe edit)

export const makeRawHTMLBroadcast = async (myContract, signer) => {
  window._DEBUG("attempting makeRawHTMLBroadcast");
  return new Promise((resolve, reject) => {
    let sig;
    let toBroadcast = document.getElementById("raw-html-composition-area").value;
    let parent = document.getElementById("raw-html-hidden-info").getAttribute("parent");
    let tmp = ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(toBroadcast)));
    signer.signMessage(tmp).
      then((signature) => {
        sig = signature;
        window._DEBUG("attempting to broadcast: " + toBroadcast +
               " with signature: " + sig);
      }).
      catch((error) => reject(new Error(error))).
      then(() => {
        window._DEBUG("calling do_broadcast");
        return myContract.do_broadcast(toBroadcast, sig, parent, "0x0000", "0x0000", "", 0);
      }).
      catch((error) => reject(new Error(error))).
      then((xactresp) => {
        window._DEBUG("response: " + xactresp);
        resolve(xactresp);
      });
  });
};


export const makeJamBroadcast = async (myContract, signer) => {
  window._DEBUG("attempting makeJamBroadcast");
  return new Promise((resolve, reject) => {
    let sig;
    let artist = document.getElementById("jam-artist").value;
    let title = document.getElementById("jam-songtitle").value;
    let youtubelink = document.getElementById("jam-youtubelink").value;
    let lyrics = document.getElementById("jam-lyrics").value;
    // TODO: needs to be escaped!
    // TODO: needs to be escaped!
    let toBroadcast =
      JSON.stringify({artist: artist, title: title,
      youtubelink: youtubelink, lyrics: lyrics}, null, 2);
    let tmp = ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(toBroadcast)));
    signer.signMessage(tmp).
      then((signature) => {
        sig = signature;
        window._DEBUG("attempting to broadcast: " + toBroadcast +
               " with signature: " + sig);
      }).
      catch((error) => reject(new Error(error))).
      then(() => {
        return myContract.do_broadcast(toBroadcast, sig, 0, "0x0010", "0x0000", "", 0);
      }).
      catch((error) => reject(new Error(error))).
      then((xactresp) => {
        window._DEBUG("response: " + xactresp);
        resolve(xactresp);
      });
  });
};


export const changeUsername = async (myContract, allUsers) => {
  window._DEBUG("attempting changeUsername");
  return new Promise((resolve, reject) => {

    let newUsername = document.getElementById("new-username-field").value;
    if(Object.values(allUsers).map(({username}) => { return username; }).includes(newUsername))
      reject(new Error("username is already taken"));

    myContract.change_username(newUsername).
      then((xactresp) => resolve(xactresp)).
      catch((error) => reject(new Error(error)));
  });
};


export const changePFPLink = async (myContract, myMetadata) => {
  window._DEBUG("attempting changePFPLink");
  return new Promise((resolve, reject) => {

    let tmp = document.getElementById("new-pfp-link-field").value;
    myMetadata.profilePic = tmp;

    let payload = JSON.stringify(myMetadata, null, 2);

    myContract.replace_user_metadata(payload).
      then((xactresp) => resolve(xactresp)).
      catch((error) => reject(new Error(error)));

  });
};


// TODO: needs to be DRY-er
export const changeRawMetadata = async (myContract, myMetadata) => {
  window._DEBUG("attempting changeRawMetadata");
  return new Promise((resolve, reject) => {

    let payload = document.getElementById("raw-metadata-area").value;

    myContract.replace_user_metadata(payload).
      then((xactresp) => resolve(xactresp)).
      catch((error) => reject(new Error(error)));

  });
};


export const deleteBroadcast = async (myContract, anid) => {
  window._DEBUG("attempting deleteBroadcast");
  return new Promise((resolve, reject) => {
    myContract.delete_broadcast(anid).
      then((xactresp) => resolve(xactresp)).
      catch((error) => reject(new Error(error)));
  });
};



///// TEMPLATE
// export const getAllBroadcasts = async (myContract) => {
//   return new Promise((resolve, reject) => {
//     myContract.get_all_broadcasts().
//       then((objFromChain) => {
//         resolve(objFromChain)
//       }).
//       catch((error) => reject(new Error(error)));
//   });
// };

