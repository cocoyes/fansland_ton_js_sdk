
import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";
const {JettonMinter, JettonWallet} = TonWeb.token.jetton;

const BN = TonWeb.utils.BN;

const IS_TESTNET = true;
const TONCENTER_API_KEY = IS_TESTNET ? 'dd50f997e0af1d9aa2b092b1f2ed318715504913b82e5e4a9d3cf4823b0c88fb' : 'dd50f997e0af1d9aa2b092b1f2ed318715504913b82e5e4a9d3cf4823b0c88fb'; // obtain on https://toncenter.com
// You can use your own instance of TON-HTTP-API or public toncenter.com
const NODE_API_URL = IS_TESTNET ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC';
const INDEX_API_URL = IS_TESTNET ? 'https://testnet.toncenter.com/api/index/' : 'https://toncenter.com/api/index/';

const tonweb = new TonWeb(new TonWeb.HttpProvider(NODE_API_URL, {apiKey: TONCENTER_API_KEY}));

const mnemonicStr="";  // mnemonic such as : slot measure salute also...

/**
 * 查询ton代币持有人钱包合约地址
 * @returns 
 */
const getTonTokenOwnAddr =async()=>{
    //jettonwallet address
    const tokenMasterAddress="EQA-ukAH7l60PyCHGHzVzXUXBBMk7tWwn4XBDgvOD32Hp8qf";
    const address= new TonWeb.utils.Address("EQAgK9tgjjeBGVyDEfqsE20w2XqYOpp3CY0cdMsfSEUZbQcb");
    const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
        address: tokenMasterAddress
    });
    const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(address);

    console.log("jettonWalletAddress=",jettonWalletAddress.toString(true, true, true));
    return jettonWalletAddress;
}


/**
 * 查询ton代币余额
 * @returns 
 */
const getTonTokenBalance =async()=>{
    //jettonwallet address
    const tokenWalletAddress="EQCOcUWmQW5yVgnkaHSySDnhvXaCdvF5YwH-NC93oRM6uUV6";
    const jettonWallet = new JettonWallet(tonweb.provider, {
        address: tokenWalletAddress
    });
    const data = await jettonWallet.getData();
    data.balance = data.balance.toString();
    data.ownerAddress = data.ownerAddress.toString(true, true, true);
    data.jettonMinterAddress = data.jettonMinterAddress.toString(true, true, true);
    console.log(data);
}

/**
 * 转移代币
 * @returns 
 */
const transferTonToken =async()=>{
    //jettonwallet address
    const tokenMasterAddress="EQAncGTVeGi1C374AU2tNTS_ONmJZ92cydN63dxWzuoEbUCw";
    
    const address= new TonWeb.utils.Address("EQBY0aOE0fI3lm9561O2CKvJjDyMkjwxUImsvNYRWXHemgvQ");
    const seed = await tonMnemonic.mnemonicToSeed(mnemonicStr.split(" "));

    /** @type {nacl.SignKeyPair} */
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
    
    const WalletClass = tonweb.wallet.all.v3R2;
    
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });
    

    const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
        address: tokenMasterAddress
    });
    const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(address);

    const jettonWallet = new JettonWallet(tonweb.provider, {
        address: jettonWalletAddress
    });
    const jettonBalance = (await jettonWallet.getData()).balance;
    console.log("jetton balance=",jettonBalance.toString());
    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log({seqno});
    const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('gift')]);
    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: jettonWalletAddress,
            amount: TonWeb.utils.toNano('0.2'),
            seqno: seqno,
            payload: await jettonWallet.createTransferBody({
                jettonAmount: TonWeb.utils.toNano('15'),
                toAddress: new TonWeb.utils.Address("0QBHIXS2X5PjvuM6Xr9tE3tbvhPt-gfKQFi2eWuIe2zKmdKz"),
                forwardAmount: TonWeb.utils.toNano('0.03'),
                forwardPayload: comment,
                responseAddress: address
            }),
            sendMode: 3,
        }).send()
    );
}

//getTonTokenBalance();
getTonTokenOwnAddr();

//transferTonToken();