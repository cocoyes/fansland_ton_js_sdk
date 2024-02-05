
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
 * 构建钱包
 * @returns 
 */
const buildAccount = async () => {
    const seed = await tonMnemonic.mnemonicToSeed(mnemonicStr.split(" "));

    /** @type {nacl.SignKeyPair} */
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
    
    const WalletClass = tonweb.wallet.all.v3R2;
    
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });
    
    
    // Wallet address depends on key pair and smart contract code.
    // So for different versions of the smart contract you will get a different address, although the key pair is the same.
    // Let's get the wallet address (offline operation):
    
    /** @type {Address} */
    const address = await wallet.getAddress();
    
    // The address can be displayed in different formats
    // More on https://ton.org/docs/#/howto/step-by-step?id=_1-smart-contract-addresses
    
    console.log(address.toString(true, true, true));
    return address;
}




/**
 * 查询ton余额
 * @returns 
 */
const getTonBalance =async()=>{
    const address="EQBY0aOE0fI3lm9561O2CKvJjDyMkjwxUImsvNYRWXHemgvQ";
    const balance = await tonweb.getBalance(address);
    console.log("address=",address.toString(true, true, true),",balance=",balance);
    //const history = await tonweb.getTransactions(address);
    //console.log("history=",history);
}





//buildAccount();
//getTonBalance();
