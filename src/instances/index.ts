import SushiApiTrackerMeta from './SushiApiTracker.json';
declare const window: any;
const ADRESS = "0xe75c3087ddf91db11a6b17bb0ebab8453e9a77a6";


const onConnectWallet = () => {
    console.log('onConnectWallet');
    if (window.ethereum) {
        window.ethereum.enable();
    }
}

const getSushiTracker = (web3) => {
    const contract = new web3.eth.Contract(SushiApiTrackerMeta.abi, ADRESS);
    return contract;
}

const getTokenSymbol = (address) => {
    return Object.keys(TOKEN_INFO).find(t => TOKEN_INFO[t].address.toLowerCase() === address.toLowerCase()) || 'ERR'
}
export {
    getSushiTracker,
    onConnectWallet,
    getTokenSymbol,
    TOKENS,
    TOKEN_INFO,
}

const TOKENS = [
    { text: 'ETH', value: "ETH" },
    { text: 'WETH', value: "WETH" },
    { text: 'SushiSwap', value: "SUSHI" },
    { text: 'Uniswap', value: "UNI" },
]
const TOKEN_INFO = {
    "ETH": {
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    },
    "WETH": {
        address: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    },
    "UNI": {
        address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
    },
    "SUSHI": {
        address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
    },
}
