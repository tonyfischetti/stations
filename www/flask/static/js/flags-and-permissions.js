
/**
 * These are functions that help with the interpretation
 * of `stations` and `broadcast` flags
 */

'use strict';

// TODO: FILL OUT!!

const makeFlagTestClosure = (flagPosition) => {
  let tmpFun = (flagField) => {
    let mask = 1 << flagPosition;
    let check = flagField & mask;
    return check!==0x0000;
  };
  return tmpFun;
};

const makeFlagSetClosure = (flagPosition) => {
  let tmpFun = (flagField) => {
    let mask = 1 << flagPosition;
    return flagField | mask;
  };
  return tmpFun;
};

/*****************************************************/
/***********    Broadcast related flags    ***********/

const spec_bcastCheckSystem = makeFlagTestClosure(15);
const spec_bcastSetSystem = makeFlagSetClosure(15);

const spec_bcastCheckDeleted = makeFlagTestClosure(14);
const spec_bcastSetDeleted = makeFlagSetClosure(14);


const spec_bcastCheckThatsMyJam = makeFlagTestClosure(2);
