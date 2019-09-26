const wvs = 10 ** 8;
require('dotenv').config();

describe('GAME test suite', async function () {

    this.timeout(600000);
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
        companyScript = file('game.ride');
        const compiledCompany = compile(companyScript);
        companyTx = setScript({ script: compiledCompany, fee: 1400000 }, seedDev2);
        await broadcast(companyTx);
        await waitForTx(companyTx.id);
        console.log('Script has been set')
    });

    it('1 can success issue tokens', async function () {
        const issueParam = {
            name: 'GMTK', // process.env.NAME_TOKEN, // + Math.random().toString(36).substring(2, 8).toUpperCase(), // process.env.NAME_TOKEN,
            description: `Game token free exchange on DEX and free transfer it someone`,
            quantity: countTokens,
            decimals: 0,
            reissuable: true,
            fee: 1.005 * wvs
        }
        const txIssue = issue(issueParam, seedDev2);
        await broadcast(txIssue);
        assetId = txIssue.id;
        await waitForTx(txIssue.id);
    })

    it('2 truly balance of the tokens', async function () {
        /* await setupAccounts(
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
        console.log('seedGamer1 :', seedGamer1);   */
        await assetBalance(assetId, address(seedDev2))
            .then((assetBal) => {
                expect(assetBal).to.equal(Number(countTokens));
            });
    });
    it('3 start the game', async function () {
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "startRound",
                args: []
            },
            payment: []
        }, seedDev2);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        // console.dir(iTxSet);

        const state = await stateChanges(iTxSet.id)
        // console.dir(state);
        // console.log('data[0] :', data[0]); 
    })

    it('4 Should be the game started', async function () {
        const startState = await accountDataByKey("startGame", address(seedDev2));
        expect(startState.value).to.equal(true);
    })

   it('5 make Bet More', async function () {
        const numberGame = await accountDataByKey("numberGame", address(seedDev2));
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        const t = numberGame.value.toString() +"_" + address(seedGamer2);
        const prev = numberGame.value.toString() +"_" + (numberRoundState.value - 1).toString() + "_";
        const rateGamerInGame = await accountDataByKey(t, address(seedDev2));
        console.log('prev :', prev);
        const lastWinnerPrefixState = await accountDataByKey(prev + "lastRoundWinner", address(seedDev2));
        console.log('lastWinnerPrefixState :', lastWinnerPrefixState);
        const keyStorage =  lastWinnerPrefixState ? lastWinnerPrefixState.value.toString() + address(seedGamer2) : null;
        console.log('keyStorage :', keyStorage);
        const betGAmerFromLastRound = await accountDataByKey(keyStorage, address(seedDev2));
        console.log('numberRoundState :', numberRoundState);
        const prevBet = rateGamerInGame ? rateGamerInGame.value : 0;

        console.log('prevBet :', prevBet);
        const rateRound =  numberRoundState.value === 1 ? 1 : numberRoundState.value * 2;
        console.log('rateRound :', rateRound);
        const maxPayment =  paymentAmount * rateRound - prevBet;
        console.log('maxPayment :', maxPayment);
        console.log('paymentAmount :', paymentAmount);
        const rate = betGAmerFromLastRound ? paymentAmount : maxPayment; 
        // console.log('//////////ateGamerInGame :', rateGamerInGame);
        // console.log('@@@@lastWinnerPrefixState :', lastWinnerPrefixState.value);
        console.log('betGAmerFromLastRound :', betGAmerFromLastRound);
        console.log('rate :', rate);
        
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.04 * wvs,
            call: {
                function: "makeBetMore",
                args: []
            },
            payment: [{ amount: rate}]
        }, seedGamer2);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        const key = numberGame.value.toString() +"_" + numberRoundState.value.toString() + "_more_" + address(seedGamer2);
        const state = await stateChanges(iTxSet.id);
        console.log('stateChanges[0]makeBetMore :', state.data[0].key);
        const checkState = await accountDataByKey(key, address(seedDev2));

        console.log('$$$ @@@@ !!!state :', state);
        expect(state.data[0].key).to.equal(key);
        const stateMoreBet = await accountDataByKey(key, address(seedDev2))
        expect(stateMoreBet.value).to.equal(rate);

    })  

    it('7 make Bet Less', async function () {
        const numberGame = await accountDataByKey("numberGame", address(seedDev2));
        //const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        const t = numberGame.value.toString() +"_" + address(seedGamer1);
        const rateGamerInGame = await accountDataByKey(t, address(seedDev2));
        console.log('rateGamerInGame :', rateGamerInGame);
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        const prev = numberGame.value.toString() +"_" + (numberRoundState.value - 1).toString() + "_";
        console.log('prev :', prev);
        console.log('numberRoundState :', numberRoundState);
        const lastWinnerPrefixState = await accountDataByKey(prev + "lastRoundWinner", address(seedDev2));
      
        const keyStorage =  lastWinnerPrefixState ? lastWinnerPrefixState.value.toString() + address(seedGamer1) : null;
     
        console.log('@@@@lastWinnerPrefixState :', lastWinnerPrefixState );
        console.log('keyStorage :', keyStorage);
        const betGAmerFromLastRound = await accountDataByKey(keyStorage, address(seedDev2));
               
        const prevBet = rateGamerInGame ? rateGamerInGame.value : 0;

        console.log('prevBet :', prevBet);
        const rateRound =  numberRoundState.value === 1 ? 1 : numberRoundState.value * 2;
        console.log('rateRound :', rateRound);
        const maxPayment =  paymentAmount * rateRound - prevBet;
        console.log('maxPayment :', maxPayment);
        console.log('betGAmerFromLastRound :', betGAmerFromLastRound);
        const rate = betGAmerFromLastRound ? paymentAmount : maxPayment;  
       
        console.log('rate :', rate);

        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "makeBetLess",
                args: []
            },
            payment: [{ amount: rate }]
        }, seedGamer1);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        // console.dir(iTxSet);
        const key = numberGame.value.toString() +"_" + numberRoundState.value.toString() + "_less_" + address(seedGamer1);
        
        const state = await stateChanges(iTxSet.id); 
        console.log('statemakeBetLess :', state);
        expect(state.data[0].key).to.equal(key);
        const stateLessBet = await accountDataByKey(key, address(seedDev2))
        expect(stateLessBet.value).to.equal(rate);
    })

   /*  it('8 should rejected when payment less than round bet ', async function () {
        const halphBet = paymentAmount / 2;
        console.log('paymentAmount :', paymentAmount);
        console.log('halphBet :', halphBet);
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "makeBetLess",
                args: []
            },
            payment: [{ amount: halphBet}]
        }, seedGamer1);
 
        expect(broadcast(iTxSet)).rejectedWith();
    }) */

    it('9 Should rejected restart when the game not finish', async function () {
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "startRound",
                args: []
            },
            payment: []
        }, seedDev2); 
        expect(broadcast(iTxSet)).rejectedWith('Same error');
    })
    it('10 Should rejected restart when try call from not owner', async function () {
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "startRound", 
                args: []
            }, 
            payment:[]
        }, seedGamer1); 
        expect(broadcast(iTxSet)).rejectedWith();
        //expect(await waitForTx(iTxSet.id)).rejectedWith(); 
    })

    /* it('11 Should rejected forwardRound when try to call from not owner address', async function () {
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "forwardRound", 
                args: []
            }, 
            payment:[]
        }, seedGamer1); 
        expect(broadcast(iTxSet)).rejectedWith(); 
    })  */
    it('12 Should be count gamers up more 0', async function () {
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        const countGamersState = await accountDataByKey(numberRoundState.value + "_countGamersUp", address(seedDev2));
        expect(countGamersState.value).to.be.at.least(0);
    })

    it('13 Should be count gamers down more 0', async function () {
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        const countGamersState = await accountDataByKey(numberRoundState.value + "_countGamersDown", address(seedDev2));
        expect(countGamersState.value).to.be.at.least(0);
    })
    it('14 should be reject if bet less than need for the round', async function () {
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        console.log('###########numberRoundState :', numberRoundState);

        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "makeBetLess",
                args: []
            },
            payment: [{ amount: 0.5 }]
        }, seedGamer1);

        expect(broadcast(iTxSet)).rejectedWith(); 
    })

    it('15 should be reject make Bet Less after made more bet', async function () {
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.04 * wvs,
            call: {
                function: "makeBetLess",
                args: []
            },
            payment: [{ amount: paymentAmount }]
        }, seedGamer2);
        expect(broadcast(iTxSet)).rejectedWith(); 

    })

 it('16 should be reject make Bet more after made less bet', async function () {
        const numberRoundState = await accountDataByKey("numberRound", address(seedDev2));
        console.log('###########numberRoundState :', numberRoundState);

        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "makeBetMore",
                args: []
            },
            payment: [{ amount: paymentAmount }]
        }, seedGamer1);
        expect(waitForTx(iTxSet.id)).rejectedWith(); 
    }) 
    it('17 Should success stopGame if have opposite bets', async function () {
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {                                  
                function: "stopGame",
                args: []
            },
            payment: []
        }, seedDev2); 
        await broadcast(iTxSet);
        await waitForTx(iTxSet.id); 
        const state = await stateChanges(iTxSet.id);
        console.log('state :', state);
    })
    it('18 Should start new round', async function () {
        const iTxSet = invokeScript({
            dApp: address(seedDev2),
            fee: 0.09 * wvs,
            call: {
                function: "startRound",
                args: []
            },
            payment: []
        }, seedDev2);
        await broadcast(iTxSet);
        await waitForTx(iTxSet.id); 
        const state = await stateChanges(iTxSet.id);
        console.log('state :', state);
        const stGame = state.data.find((item) => item.key === 'startGame')
        expect(stGame.key).to.equal('startGame');
        expect(stGame.value).to.equal(true);
    })
})      