import Web3 from 'web3';
declare const window: any;
let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    let provider = new Web3.providers.WebsocketProvider(
        'wss://ropsten.infura.io/ws/v3/5102ae03fc524516a91aa70c7da65427'
    );
    web3 = new Web3(provider);
}
window.ethereum.enable();
export default web3;
