const companyScript = file("game.ride");
const compiledCompany = compile(companyScript);
const companyTx = setScript({ script: compiledCompany, fee: 10000000 }, owner3);
const tx = await broadcast(companyTx);
const confirmTx = await waitForTx(companyTx.id);
