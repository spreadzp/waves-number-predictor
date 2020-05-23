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
    const issuerToken = "hjkghgjhkgjhkgjhkkdaerwewe";
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
       companyScript = file('guessnumber.ride');
        //console.log('companyScript :', companyScript);
       const compiledCompany = compile(companyScript);
       // console.log('compiledCompany :', compiledCompany);
        const ownerAddress = address(owner3);
        console.log('ownerAddress :', ownerAddress);
      companyTx = setScript({ script: compiledCompany, fee: 10000000 }, owner3);
        //console.log('companyTx.id :', companyTx.id);
          const t1 = await broadcast(companyTx);
        console.log('t1 :', t1);
        const t2 = await waitForTx(companyTx.id);
       console.log('t2 :', t2);
        console.log('Script has been set')
    });
    it('1 success deploy', async function () {

    })
  });
