import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import { Container, Modal, Button, Input, Grid, Dropdown, Loader, Form, Label, Header, Divider, Segment } from 'semantic-ui-react';
import { Chart } from 'react-charts';
import web3 from './_web3';
import { useGetWalletHook, useGetSwapHistory, useGetTotalSwap, Swap } from './hooks';
// import { deploy } from './instances/deploy';
import { onConnectWallet, getSushiTracker, getTokenSymbol, TOKEN_INFO, TOKENS } from './instances';



function App() {
    const [walletLoading, wallet] = useGetWalletHook();
    const [token0, setToken0] = useState<any>('');
    const [token1, setToken1] = useState<any>('');
    const [amount0, setAmount0] = useState('');
    const [amount1, setAmount1] = useState('');
    const [err, setErr] = useState<null | string>(null);
    const [swapLoading, setSwapLoading] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [inputTokenFilter, setInputTokenFilter] = useState<any>('');
    const [outputTokenFilter, setOutputTokenFilter] = useState<any>('');


    const onSwap = async () => {
        if (token0 && token1 && amount0 && amount1) {
            console.log(token0, token1, amount0, amount1);
            setSwapLoading(true);
            await Swap(
                wallet,
                TOKEN_INFO[token0].address,
                TOKEN_INFO[token1].address,
                web3.utils.toWei(amount0, "ether"),
                web3.utils.toWei(amount1, "ether"),
            );
            setSwapLoading(false);
            setRefreshToggle(!refreshToggle);
        }
        else {
            setErr('Incorrect Input param');
        }
    }
    return (
        <Container className="App">
            <Modal
                open={err !== null}
                header='Error'
                content={err}
                onClose={() => setErr(null)}
            />
            <Grid divided stackable>
                <Grid.Row>
                    <Grid.Column width={10} floated='left' className="centered pt-3">
                        <Header>
                            {'Sushi Tracker'}
                            <Label color='pink'> ROPSTEN</Label>
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={6} floated='right' className={'pt-3'}>
                        <Loader active={walletLoading} />
                        {wallet ? (
                            <Label color='yellow'>
                                <Label.Detail> Wallet Connected</Label.Detail>
                                <Label.Detail>{wallet}</Label.Detail>
                            </Label>
                        )
                            :
                            <Button color={'red'} onClick={onConnectWallet}>Conenct Wallet</Button>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider />
            <Grid divided stackable>
                <Grid.Row>
                    <Grid.Column width={6} >
                        <Grid.Row>
                            <Header>
                                {'SWAP TOKENS'}
                            </Header>
                            <Form>
                                <Form.Field>
                                    <Input
                                        label={<Dropdown
                                            placeholder="Select token"
                                            value={token0}
                                            options={TOKENS}
                                            onChange={(e, v) => setToken0(v.value)}
                                        />}
                                        onChange={v => setAmount0(v.target.value)}
                                        labelPosition='right'
                                        placeholder='Input amount'
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Input
                                        label={<Dropdown
                                            placeholder="Select token"
                                            value={token1}
                                            options={TOKENS}
                                            onChange={(e, v) => setToken1(v.value)}
                                        />}
                                        onChange={v => setAmount1(v.target.value)}
                                        labelPosition='right'
                                        placeholder='Output amount'
                                    />
                                </Form.Field>
                                <Grid.Column >
                                    <Button type='submit' color="blue" onClick={onSwap} loading={swapLoading}>SWAP</Button>
                                </Grid.Column >
                            </Form>
                        </Grid.Row>
                        <Divider />
                        <Grid.Row>
                            <TokenTotalSwap wallet={wallet} name={'input'} token={token0} refresh={refreshToggle} />
                            <TokenTotalSwap wallet={wallet} name={'output'} token={token1} refresh={refreshToggle} />
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Grid.Row>
                            <Form>
                                <Form.Group inline>
                                    <Form.Field>
                                        <Segment>
                                            <Label color="green">IN</Label>
                                            <Dropdown
                                                simple
                                                labeled={true}
                                                clearable={true}
                                                placeholder="Select token"
                                                value={inputTokenFilter}
                                                options={TOKENS}
                                                onChange={(e, v) => setInputTokenFilter(v.value)}
                                                label="Filter input token"
                                            />

                                        </Segment>
                                    </Form.Field>
                                    <Form.Field>
                                        <Segment>
                                            <Label color="red">OUT</Label>
                                            <Dropdown
                                                labeled={true}
                                                clearable={true}
                                                placeholder="Select token"
                                                value={outputTokenFilter}
                                                options={TOKENS}
                                                onChange={(e, v) => setOutputTokenFilter(v.value)}
                                                label="Filter output token"
                                            />
                                        </Segment>
                                    </Form.Field>
                                    <Grid.Column >
                                        <Button color="yellow" onClick={() => setRefreshToggle(!refreshToggle)}>REFRESH</Button>
                                    </Grid.Column >
                                </Form.Group>
                            </Form>
                        </Grid.Row>
                        <SwapHistoryChart
                            wallet={wallet}
                            inputToken={inputTokenFilter}
                            outputToken={outputTokenFilter}
                            refresh={refreshToggle}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default App;


const SwapHistoryChart = ({ wallet, inputToken, outputToken, refresh }) => {
    const [recLoading, records] = useGetSwapHistory(wallet, TOKEN_INFO[inputToken] ?.address, TOKEN_INFO[outputToken] ?.address, refresh);

    const data = React.useMemo(
        () => {
            const iTokens = [...new Set(records.map(r => r[1]))];
            const iData = records.reduce((obj, rec) => {
                obj[rec[1]].push([
                    parseInt(rec[5]),
                    parseInt(rec[3])
                ])
                return obj;
            }, Object.assign({}, ...iTokens.map((t: any) => ({ [t]: [] }))));
            const oTokens = [...new Set(records.map(r => r[2]))];
            const oData = records.reduce((obj, rec) => {
                obj[rec[2]].push([
                    parseInt(rec[5]),
                    parseInt(rec[4])
                ])
                return obj;
            }, Object.assign({}, ...oTokens.map((t: any) => ({ [t]: [] }))));
            const inputData = Object.keys(iData).map(tokenAddr => (
                {
                    label: getTokenSymbol(web3.utils.numberToHex(tokenAddr)) + ' INPUT',
                    data: iData[tokenAddr]
                }
            ))
            const outputData = Object.keys(oData).map(tokenAddr => (
                {
                    label: getTokenSymbol(web3.utils.numberToHex(tokenAddr)) + ' OUTPUT',
                    data: oData[tokenAddr],
                }
            ))
            return [...inputData, ...outputData]
        },
        [records]
    );
    console.log(data);

    const series = React.useMemo(
        () => ({
            type: 'bar',
            showPoints: true,
        }),
        []
    )
    const axes = React.useMemo(
        () => [
            { primary: true, type: 'ordinal', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    )
    if (recLoading) {
        return (
            <div className={'chart-container centered'}>
                <Loader active={recLoading} />
            </div>
        )
    }
    if (!records || !records.length) {
        return (
            <div className={'chart-container centered'}>
                <p> NO DATA </p>
            </div>
        )
    }


    return (
        <div className={'chart-container centered'}>
            <Chart data={data} axes={axes} series={series} tooltip />
        </div>
    )
}


const TokenTotalSwap = ({ wallet, token, name, refresh }) => {
    const [loading, total] = useGetTotalSwap(wallet, TOKEN_INFO[token] ?.address, refresh);
    return (
        <Segment>
            <Header>
                <Header> {name} token total swapped  <Label >{token}</Label>      </Header>
                <Loader active={loading} />
                {token ?
                    loading ? null : (<Segment>
                        <Header >
                            <Header.Subheader> {total[0]} <Label >WEI</Label><Label color="green">IN</Label></Header.Subheader>
                            <Divider />
                            <Header.Subheader> {total[1]} <Label >WEI</Label><Label color="red">OUT</Label></Header.Subheader>
                        </Header>
                    </Segment>) : <Header >Select {name} token</Header>}
            </Header>
        </Segment>
    )
}
