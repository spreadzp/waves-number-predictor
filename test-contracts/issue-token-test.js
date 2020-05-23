const wvs = 10 ** 8;
require("dotenv").config();
const setNewIdToken = require('./replace.idToken');
describe("GAME test suite", async function () {
  this.timeout(600000);
  let dappTx;
  let freezeScript; 
  let companyScript;
  let companyTx;
  let seedInv1 = "waves private node seed with waves tokens";
  const owner2 = "hjkghgjhkgjhkgjhkkda";
  const issuerToken = "hjkghgjhkgjhkgjhkkdaerwewe";
  const owner3 = "hjkghgjhkgjhkgjhkkdaerwe";
  let seed2 =
    "tooth great gown say drill repair fluid unveil mosquito column design pyramid dust wreck safe";
  let seedGamer1 =
    "yard antique adult age neglect distance patch reopen pulp scrub clean muffin helmet robot trap";
  let seedGamer2 =
    "weather conduct sentence below fix love crucial rabbit setup hair seed ridge mammal crush nest";
  let seedGamer3 =
    "perfect decline slice surface culture apology head merit bench shed meat melt";
  let assetId;
  let paymentAmount = 1 * wvs;
  // let preSellScript;
  const countTokens = 10000000 * wvs;
  const idGameToken = "7pNXT4T2mN14EQbqreQce6tybgwPhApyvViC9QNy6eYE";

  const accounts = {};
  before(async function () {});
  it("0 send waves from root", async function () {
    const gamer1 = address(seedGamer1);
    console.log("recipient :", gamer1);
    const sendTokensG1 = await transfer(
      { recipient: gamer1, amount: 919 * wvs, fee: 0.05 * wvs },
      seedInv1
    );
    await broadcast(sendTokensG1);
    await waitForTx(sendTokensG1.id);
    const gamer2 = address(seedGamer2);
    console.log("recipient :", gamer2);
    const sendTokensG2 = await transfer(
      { recipient: gamer2, amount: 919 * wvs, fee: 0.05 * wvs },
      seedInv1
    );
    await broadcast(sendTokensG2);
    await waitForTx(sendTokensG2.id);
    const tokenOwner = address(issuerToken);
    console.log("tokenOwner :", tokenOwner);
    const sendTokensTokenOwner = await transfer(
      { recipient: tokenOwner, amount: 919 * wvs, fee: 0.05 * wvs },
      seedInv1
    );
    await broadcast(sendTokensTokenOwner);
    await waitForTx(sendTokensTokenOwner.id);
    const contractOwner = address(owner3);
    console.log("contractOwner :", contractOwner);
    const sendTokensContractOwner = await transfer(
      { recipient: contractOwner, amount: 919 * wvs, fee: 0.05 * wvs },
      seedInv1
    );
    await broadcast(sendTokensContractOwner);
    await waitForTx(sendTokensContractOwner.id);
  });
  it("1 can success issue tokens", async function () {
    const issueParam = {
      name: "GMTK", // process.env.NAME_TOKEN, // + Math.random().toString(36).substring(2, 8).toUpperCase(), // process.env.NAME_TOKEN,
      description: `Game token free exchange on DEX and free transfer it someone`,
      quantity: countTokens,
      decimals: 0,
      reissuable: true,
      fee: 1.005 * wvs,
    };
    const txIssue = issue(issueParam, issuerToken);
    await broadcast(txIssue);
    assetId = txIssue.id;
    console.log("assetId :>> ", assetId);
    await waitForTx(txIssue.id);

  });

  it("2 truly balance of the tokens", async function () {
    await assetBalance(assetId, address(issuerToken)).then((assetBal) => {
      expect(assetBal).to.equal(Number(countTokens));
    });
    const recipient = address(seedGamer1);
    const sendTokensG1 = await transfer(
      {
        recipient: recipient,
        amount: 10000 * wvs,
        assetId: assetId,
        fee: 0.05 * wvs,
      },
      issuerToken
    );
    await broadcast(sendTokensG1);
    await waitForTx(sendTokensG1.id);
    const recipient2 = address(seedGamer2);
    const sendTokensG2 = await transfer(
      {
        recipient: recipient2,
        amount: 10000 * wvs,
        assetId: assetId,
        fee: 0.05 * wvs,
      },
      issuerToken
    );
    await broadcast(sendTokensG2);
    await waitForTx(sendTokensG2.id);
  });
  it("3 replace id token", async function () {
    const optionsContract = {
      files: 'contracts/guessnumber.ride',
      from: /let idGameToken =  base58('.*)/g,
      to: `let idGameToken =  base58'${assetId}'`,
    };
    const res = await setNewIdToken(optionsContract);
    expect(res).to.equal(true);
    const optionsTestContract = {
      files: 'test-contracts/guess-number-test.js',
      from: /const idGameToken = (".*)/g,
      to: `const idGameToken = "${assetId}";`,
    };
    const resTest = await setNewIdToken(optionsTestContract);
    expect(resTest).to.equal(true);
  });
  it("4 deploy contract", async function () {
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
});
