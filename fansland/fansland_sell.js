
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
 * 支付代币以mint NFT
 * @returns 
 */
const transToMintNft =async()=>{
    const parentAddr= new TonWeb.utils.Address("EQCHe62xHtk5Ok1gPdbJ7FvutaEElHuOT3RYqZDuPMDDb_Bs");
    const ticketAddr= new TonWeb.utils.Address("EQDD-Ux0l5Ktjuk0AGyKYpXA7s4MkY2tKHx17kbowX92q41Z");
    const buyCount = 1;

    //jettonwallet address
    const tokenMasterAddress="EQA-ukAH7l60PyCHGHzVzXUXBBMk7tWwn4XBDgvOD32Hp8qf";
    
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



    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log({seqno});

    const forwardPayload = new TonWeb.boc.Cell();
    forwardPayload.bits.writeAddress(parentAddr);
    forwardPayload.bits.writeAddress(ticketAddr);
    forwardPayload.bits.writeUint(buyCount, 16); 

    const destinationAddress = new TonWeb.Address('EQCHe62xHtk5Ok1gPdbJ7FvutaEElHuOT3RYqZDuPMDDb_Bs');

    const jettonTransferBody = new TonWeb.boc.Cell();
    jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer
    jettonTransferBody.bits.writeUint(0, 64); // query id
    jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('100')); // jetton amount, amount * 10^9
    jettonTransferBody.bits.writeAddress(destinationAddress);
    jettonTransferBody.bits.writeAddress(address); // response destination
    jettonTransferBody.bits.writeBit(false); // no custom payload
    jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.3')); // forward amount
    jettonTransferBody.bits.writeBit(true); // we store forwardPayload as a reference
    jettonTransferBody.refs.push(forwardPayload);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: jettonWalletAddress,
            amount: TonWeb.utils.toNano('0.8'),
            seqno: seqno,
            payload: jettonTransferBody,
            sendMode: 3,
        }).send()
    );
}



transToMintNft();