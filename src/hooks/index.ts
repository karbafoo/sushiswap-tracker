import { useMemo, useState } from 'react';
import web3 from '../_web3';
import { onConnectWallet, getSushiTracker, TOKEN_INFO } from '../instances';
declare const window: any;
export const useGetWalletHook = (): [boolean, any] => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    useMemo(async () => {
        setLoading(true);
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts) {
                    setWallet(accounts[0]);
                }
            })
        }

        const accounts = await web3.eth.getAccounts();
        if (accounts) {
            setWallet(accounts[0]);
        }
        setLoading(false);
    }, []);
    return [loading, wallet]
}


export const useGetSwapHistory = (wallet, inputToken, outputToken, refresh): [boolean, any] => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    useMemo(async () => {
        if (wallet) {
            setLoading(true);
            const SushiApiTrackerContract = getSushiTracker(web3);

            let recs = [];
            if (inputToken) {
                recs = await SushiApiTrackerContract.methods.getSwapRecordsByInputToken(wallet, inputToken).call({
                    from: wallet
                });
            }
            else if (outputToken) {
                recs = await SushiApiTrackerContract.methods.getSwapRecordsByOutputToken(wallet, outputToken).call({
                    from: wallet
                });
            }
            else {
                recs = await SushiApiTrackerContract.methods.getSwapRecords(wallet).call({
                    from: wallet
                });
            }
            setRecords(recs);
            setLoading(false);
        }
        else {
            setRecords([]);
            setLoading(false);
        }
    }, [wallet, inputToken, outputToken, refresh]);
    return [loading, records,]
}

export const useGetTotalSwap = (wallet, token, refresh): [boolean, any] => {
    const [total, setRecords] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    useMemo(async () => {
        if (wallet && token) {
            setLoading(true);
            const SushiApiTrackerContract = getSushiTracker(web3);

            const total = await SushiApiTrackerContract.methods.getTotalSwapAmount(wallet, token).call({
                from: wallet
            });

            setRecords(total);
            setLoading(false);
        }
        else {
            setRecords(0);
            setLoading(false);
        }
    }, [wallet, token, refresh]);
    return [loading, total,]
}


export const Swap = async (wallet, token0, token1, amount0, amount1) => {
    const SushiApiTrackerContract = getSushiTracker(web3);
    const swaprecord = await SushiApiTrackerContract.methods
        .swap(
            wallet, //using adress as api key
            token0,
            token1,
            amount0,
            amount1,
            wallet
        )
        .send({
            from: wallet
        });

    return swaprecord;
}
