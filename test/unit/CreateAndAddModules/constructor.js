'use strict';

const Web3 = require('web3');
const sinon = require('sinon');
const { assert } = require('chai');

const Spy = require('../../../utils/Spy');
const CreateAndAddModules = require('../../../lib/ContractInteract/CreateAndAddModules');
const AssertAsync = require('../../../utils/AssertAsync');
const Contracts = require('../../../lib/Contracts');

describe('CreateAndAddModules.constructor()', () => {
  let web3;
  let address;

  beforeEach(() => {
    web3 = new Web3();
    address = '0x0000000000000000000000000000000000000002';
  });

  it('should construct with correct parameter', async () => {
    const fakeInstance = sinon.fake();
    const spyContract = sinon.replace(Contracts, 'getCreateAndAddModules', sinon.fake.returns(fakeInstance));

    const instance = new CreateAndAddModules(web3, address);

    assert.strictEqual(address, instance.address, 'Address must match');

    assert.strictEqual(web3, instance.auxiliaryWeb3, 'Web3 instance must match');
    Spy.assert(spyContract, 1, [[web3, address]]);
    sinon.restore();
  });

  it('should throw an error when CreateAndAddModules returns undefined object', async () => {
    const spyContract = sinon.replace(Contracts, 'getCreateAndAddModules', sinon.fake.returns(undefined));

    const errorMessage = `Could not load CreateAndAddModules contract for: ${address}`;
    await AssertAsync.reject(new CreateAndAddModules(web3, address), errorMessage);

    Spy.assert(spyContract, 1, [[web3, address]]);
    sinon.restore();
  });

  it('should throw an error when web3 object is undefined', async () => {
    await AssertAsync.reject(
      new CreateAndAddModules(undefined, address),
      `Mandatory Parameter 'auxiliaryWeb3' is missing or invalid.`
    );
  });

  it('should throw an error when CreateAndAddModules contract address is undefined', async () => {
    await AssertAsync.reject(
      new CreateAndAddModules(web3, undefined),
      `Mandatory Parameter 'address' is missing or invalid: undefined.`
    );
  });
});
