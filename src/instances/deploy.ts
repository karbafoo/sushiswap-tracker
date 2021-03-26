import SushiApiTrackerMeta from './SushiApiTracker.json';

const deploy = async (web3) => {
    console.log(SushiApiTrackerMeta);

    // const metadata = JSON.parse(SushiApiTrackerMeta as any);
    const metadata = SushiApiTrackerMeta;
    const accounts = await web3.eth.getAccounts()

    const constructorArgs = []
    let contract = new web3.eth.Contract(metadata.abi)
    contract = contract.deploy({
        data: metadata.data.bytecode.object,
        arguments: constructorArgs
    })

    const newContractInstance = await contract.send({
        from: accounts[0],
        // gas: 6500000,
        // gasPrice: '30000000000'
    });
    console.log(newContractInstance.options)
    console.log('Contract deployed at address: ', newContractInstance.options.address)
}

export {
    deploy
}
