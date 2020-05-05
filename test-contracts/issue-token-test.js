const wvs = 10 ** 8;
require('dotenv').config();

describe('GAME test suite', async function () {

    this.timeout(600000);
    let dappTx;
    let freezeScript;
    let companyScript;
    let companyTx;
    let seedInv1 = "waves private node seed with waves tokens";
    const owner2 = "hjkghgjhkgjhkgjhkkda";
    const owner3 = "hjkghgjhkgjhkgjhkkdaerwe";
    let seed2 = "tooth great gown say drill repair fluid unveil mosquito column design pyramid dust wreck safe";
    let seedGamer1 = "yard antique adult age neglect distance patch reopen pulp scrub clean muffin helmet robot trap";
    let seedGamer2 = "weather conduct sentence below fix love crucial rabbit setup hair seed ridge mammal crush nest";
    let seedGamer3 = "perfect decline slice surface culture apology head merit bench shed meat melt";
    let assetId;
    let paymentAmount = 1 * wvs;
    // let preSellScript;
    const countTokens = 1000 * wvs;
    const idGameToken = '7pNXT4T2mN14EQbqreQce6tybgwPhApyvViC9QNy6eYE';


    const accounts = {};
    before(async function () {
       companyScript = file('game.ride');
        //console.log('companyScript :', companyScript);
       const compiledCompany = compile(companyScript);
       // console.log('compiledCompany :', compiledCompany);
        const ownerAddress = address(owner3);
        console.log('ownerAddress :', ownerAddress);
      companyTx = setScript({ script: compiledCompany, fee: 10000000 }, owner3);
        //console.log('companyTx.id :', companyTx.id);
          const t1 = await broadcast(companyTx);
        // console.log('t1 :', t1);
        const t2 = await waitForTx(companyTx.id);
        // console.log('t2 :', t2);
        console.log('Script has been set')
    });

    it('1 can success issue tokens', async function () {
        const issueParam = {
          assetId: "7pNXT4T2mN14EQbqreQce6tybgwPhApyvViC9QNy6eYE",
          quantity: countTokens,
          reissuable: true,
        };
        const txIssue = reissue(issueParam, owner3);
        await broadcast(txIssue);
        assetId = txIssue.id;
        console.log('assetId :>> ', assetId);
        await waitForTx(txIssue.id);
    })

    it('2 truly balance of the tokens', async function () {
        
        await assetBalance(assetId, address(owner3)).then((assetBal) => {
          expect(assetBal).to.equal(Number(countTokens));
        });
        const recipient = address(seedGamer1);
        const sendTokensG1 = await transfer(
          {
            recipient: recipient,
            amount: 100 * wvs,
            assetId: assetId,
            fee: 0.05 * wvs,
          },
          owner3
        );
        await broadcast(sendTokensG1);
        await waitForTx(sendTokensG1.id);
        const recipient2 = address(seedGamer2);
        const sendTokensG2 = await transfer(
          {
            recipient: recipient2,
            amount: 100 * wvs,
            assetId: assetId,
            fee: 0.05 * wvs,
          },
          owner3
        );
        await broadcast(sendTokensG2);
        await waitForTx(sendTokensG2.id);
    });
  });