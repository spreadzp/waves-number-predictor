const wvs = 10 ** 8;
require('dotenv').config();

describe('Transfer tokens', async function () {

    this.timeout(6000000);
    let dappTx;
    let freezeScript;
    let companyScript;
    let companyTx;
    let seedInv1 = "waves private node seed with waves tokens";
    let seedDev2 = "tooth great gown say drill repair fluid unveil mosquito column design pyramid dust wreck safe";
    let seedGamer1 = "yard antique adult age neglect distance patch reopen pulp scrub clean muffin helmet robot trap";
    let seedGamer2 = "weather conduct sentence below fix love crucial rabbit setup hair seed ridge mammal crush nest";
    let seedGamer3 = "perfect decline slice surface culture apology head merit bench shed meat melt";
    let assetId;
    let paymentAmount = 1 * wvs;
    // let preSellScript;
    const countTokens = "100000000000";
 
    
    const accounts = {};
    before(async function () {
     /*    await setupAccounts(
            {
                company: 5 * wvs,
                investor1: 5.5 * wvs,
                investor2: 5.05 * wvs,
                investor3: 5.05 * wvs
            }
            );
        seedDev2 = await accounts.company;
        seedGamer1 = await accounts.investor1;
        seedGamer2 = await accounts.investor2;
        seedGamer3 = await accounts.investor3;


        console.log('seedDev2 :', seedDev2);
        console.log('seedGamer3 :', seedGamer3);
        console.log('seedGamer2 :', seedGamer2);
        console.log('seedGamer1 :', seedGamer1); */
        
    });

    it('1 can success transfer', async function () {
        /* const sendTokensG1 =  await transfer({recipient: "3ML9ixR6ipV89Kw5VSpdvBhyGD3LhseETx3",
                amount: 1000 * wvs, fee: 0.05 * wvs}, seedDev2);
        await broadcast(sendTokensG1);
        await waitForTx(sendTokensG1.id); */
        const sendTokensG2 =  await transfer({recipient: "3MFWiYgNSS5Amj4HSbg5Lv1sUNm6AusRqxu                                  ",
                amount: 1000 * wvs, fee: 0.05 * wvs}, seedDev2);
        await broadcast(sendTokensG2);
        await waitForTx(sendTokensG2.id);
    })
})      