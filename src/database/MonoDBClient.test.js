import Web3 from "web3";
import * as SidetreeWallet from "@sidetree/wallet";
import * as didKey from "@transmute/did-key.js";
import publicKeyToAddress from "ethereum-public-key-to-address";

describe("eth account", () => {
  it("address/keyPair", async () => {
    const web3 = new Web3();
    const account = web3.eth.accounts.create();
    // address: '0x5D1...F34' 40 hex
    // encrypt: (password, options)
    // privateKey: '0x908...e5b' 64 hex
    // sign: (data)
    // signTransaction: (tx, callback)
    const privKeyWithoutHeader = account.privateKey.substring(2); // removes 0x
    let did = { address: account.address, privateKey: privKeyWithoutHeader };
    const crv = "secp256k1";
    const path = "m/44'/60'/0'/0/0";
    const mnemonic = await SidetreeWallet.toMnemonic();
    const keyPair = await SidetreeWallet.toKeyPair(mnemonic.value, crv, path);
    const kp = await didKey.secp256k1.Secp256k1KeyPair.from(keyPair);
    // const fingerprint = await kp.fingerprint();
    // const did3 = `did:key:${fingerprint}`;
    // const { didDocument } = await didKey.resolve(keyPair.controller, {
    //   accept: "application/did+ld+json",
    // });
    // const publicKey = bs58.decode(didDocument.verificationMethod[0].publicKeyBase58)
    // const one = Buffer.from(publicKey);
    const privateKey = Buffer.from(kp.privateKey).toString('hex');
    const publicKey = Buffer.from(kp.publicKey).toString('hex');
    const address = publicKeyToAddress(publicKey);
    let did2 = {
      address,
      privateKey,
      publicKey, // 66 hex
    };
    // didkey -> web3
    let account2 = web3.eth.accounts.privateKeyToAccount(privateKey);
    const privKeyWithoutHeader2 = account2.privateKey.substring(2); // removes 0x
    let did3 = { address: account2.address, privateKey: privKeyWithoutHeader2 };
    expect(did.address.length).toBe(did2.address.length);
    expect(did.privateKey.length).toBe(did2.privateKey.length);
    expect(did.address.length).toBe(did3.address.length);
    expect(did.privateKey.length).toBe(did3.privateKey.length);
    expect(did2.address).toBe(did3.address);
    expect(did2.privateKey).toBe(did3.privateKey);
  });
});
