function findNumber(minNumber, maxNumber, numberLoop, g1, g2, g3, ow) {
    let bank = 0;
    let owner = ow;
    let amountGamer1 = g1;
    let amountGamer2 = g2;
    let amountGamer3 = g3;
    let minCurrent = minNumber;
    let maxCurrentNumber = maxNumber;
    let gamer1Direction = true;
    let gamer2Direction = false;
    let gamer3Direction = false;
    for (let i = 1; i < numberLoop + 1; i++) {
        let sumMinAndMax = maxCurrentNumber + minCurrent;
        
        let averageNumber = sumMinAndMax%2 === 0 ? sumMinAndMax / 2 : (sumMinAndMax + 1) / 2
        const random_bool_direction = Math.round((Math.random() * 1) + 0) === 0;// Math.random() >= 0.5;
        if(i === 0) {
            const betGamer1 = 1;
            const betGamer2 = 1;
            const betGamer3 = 1;
            amountGamer3 -= betGamer3;
            amountGamer1 -= betGamer1;
            amountGamer2 -= betGamer2;
            bank = betGamer1  + betGamer2 + betGamer3;
            // console.log('bank :', bank);
        } else {
            const betGamer1 = random_bool_direction === gamer1Direction ? 1 : 2 * i;
            const betGamer2 = random_bool_direction === gamer2Direction ? 1 : 2 * i;
            const betGamer3 = random_bool_direction === gamer3Direction ? 1 : 2 * i;
          /*   console.log('betGamer1 :', betGamer1);
            console.log('betGamer2 :', betGamer2);
            console.log('betGamer3 :', betGamer3); */
            amountGamer1 -= betGamer1;
            amountGamer2 -= betGamer2;
            amountGamer3 -= betGamer3;
            bank = bank + betGamer1  + betGamer2 + betGamer3;
            
        }
        if (random_bool_direction) {
            minCurrent = averageNumber
        } else {
            maxCurrentNumber = averageNumber - 1;
        }
        // console.log('min :', minCurrent, " - ", maxCurrentNumber, ":", random_bool_direction, "avg: ", averageNumber);
        if(minCurrent === maxCurrentNumber) {
            console.log('bank :', bank);
            console.log('secret Number is:  :', minCurrent );
            const ownerPart = bank * 0.1;
            owner = owner + ownerPart;
            bank -= ownerPart
            if(random_bool_direction === gamer1Direction && gamer1Direction === gamer3Direction) {
                
                amountGamer1 = amountGamer1 + bank/2;
                amountGamer3 = amountGamer3 + bank/2;
            } else if (random_bool_direction === gamer2Direction && gamer2Direction === gamer3Direction) {
                amountGamer2 = amountGamer2 + bank/2;
                amountGamer3 = amountGamer3 + bank/2;
            }
            else if(random_bool_direction === gamer1Direction && gamer1Direction !== gamer3Direction) {
                
                amountGamer1 = amountGamer1 + bank; 
            } else if (random_bool_direction === gamer2Direction && gamer2Direction !== gamer3Direction) {
                amountGamer2 = amountGamer2 + bank; 
            }
            bank = 0;
            console.log('amountGamer1 :', amountGamer1);
            console.log('amountGamer2 :', amountGamer2);

            console.log('amountGamer3 :', amountGamer3);
            console.log('owner :', owner);
            console.log('@@@@@@@@@sum :', amountGamer1 + amountGamer2 + amountGamer3 + ownerPart);
            return {"g1": amountGamer1, "g2": amountGamer2, "g3": amountGamer3, "ow": owner};
        }
        gamer1Direction =  Math.random() >= 0.5;
        gamer2Direction = !gamer1Direction;
        gamer3Direction =  Math.random(Math.random) >= 0.5;
    }
    
    //return amountGamer1//
} 
const t = findNumber(0, 1023, 10, 500, 500, 500, 0); 
//console.log('!!!!!!!!!!!g1,g2,g3 :', t.g1,t.g2,t.g3, t.ow);
const t2 = findNumber(0, 1023, 10, t.g1,t.g2,t.g3, t.ow);  
const t3 = findNumber(0, 1023, 10, t2.g1,t2.g2,t2.g3, t2.ow); 
const t4 = findNumber(0, 1023, 10, t3.g1,t3.g2,t3.g3, t3.ow); 
const t5 = findNumber(0, 1023, 10, t4.g1,t4.g2,t4.g3, t4.ow);
const t6 = findNumber(0, 1023, 10, t5.g1,t5.g2,t5.g3, t5.ow);
const t7 = findNumber(0, 1023, 10, t6.g1,t6.g2,t6.g3, t6.ow);
const t8 = findNumber(0, 1023, 10, t7.g1,t7.g2,t7.g3, t7.ow);
const t9 = findNumber(0, 1023, 10, t8.g1,t8.g2,t8.g3, t8.ow);