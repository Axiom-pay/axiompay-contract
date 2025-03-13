pragma circom 2.1.2;

include "../lib/babyjub.circom";

template VerifyPrivateTransfer() {
    signal input balance;
    signal input amount;
    signal input privateKey;
    signal input pa[2];
    signal input caAmountK;
    signal input c1ayAmount;
    signal input c2ayAmount;
    signal input c1balance[2];
    signal input c2balance[2];

    // check C1_ay_amount and C2_ay_amount
    component check1 = CheckEncryptResult();
    check1.p <== pa;
    check1.vk <== caAmountK;
    check1.m <== amount;
    check1.c1y <== c1ayAmount;
    check1.c2y <== c2ayAmount;

    // check balance must greater or equal than amount
    component check2 = GreaterEqThan(40);
    check2.in[0] <== balance;
    check2.in[1] <== amount;

    component check3 = CheckBalanceMatch();
    check3.balance <== balance;
    check3.privateKey <== privateKey;
    check3.c1Balance <== c1balance;
    check3.c2Balance <== c2balance;
}

template CheckEncryptResult() {
    signal input p[2];
    signal input vk;
    signal input m;
    signal input c1y;
    signal input c2y;

    component enc = BabyjubEncrypt();
    enc.p <== p;
    enc.vk <== vk;
    enc.m <== m;

    component tmp1 = parallel ForceEqualIfEnabled();
    tmp1.enabled <== 1;
    tmp1.in[0] <== enc.c1[1];
    tmp1.in[1] <== c1y;

    component tmp2 = parallel ForceEqualIfEnabled();
    tmp2.enabled <== 1;
    tmp2.in[0] <== enc.c2[1];
    tmp2.in[1] <== c2y;
}

template CheckBalance() {
    signal input balance;
    signal input amount;

    component gte = GreaterEqThan(32);

    gte.in[0] <== balance;
    gte.in[1] <== amount;

    component tmp1 = ForceEqualIfEnabled();
    tmp1.enabled <== 1;
    tmp1.in[0] <== gte.out;
    tmp1.in[1] <== 1;
}

template CheckBalanceMatch() {
    signal input balance;
    signal input privateKey;
    signal input c1Balance[2];
    signal input c2Balance[2];

    // compute balance * G
    component mult1 = BabyPbk();
    mult1.in <== balance;

    // compute privateKey * c1
    component mult2 = BabyScalar();
    mult2.scalar <== privateKey;
    mult2.point[0] <== c1Balance[0];
    mult2.point[1] <== c1Balance[1];

    component adder = BabyAdd();
    adder.x1 <== mult1.Ax;
    adder.y1 <== mult1.Ay;
    adder.x2 <== mult2.Ax;
    adder.y2 <== mult2.Ay;

    component tmp1 = ForceEqualIfEnabled();
    tmp1.enabled <== 1;
    tmp1.in[0] <== adder.xout;
    tmp1.in[1] <== c2Balance[0];
    
    component tmp2 = ForceEqualIfEnabled();
    tmp2.enabled <== 1;
    tmp2.in[0] <== adder.yout;
    tmp2.in[1] <== c2Balance[1];
}

template BabyjubEncrypt() {
    signal input p[2];
    signal input vk;
    signal input m;

    signal output c1[2];
    signal output c2[2];

    // c_1 = kG
    component mult1 = BabyPbk();
    mult1.in <== vk;
    c1[0] <== mult1.Ax;
    c1[1] <== mult1.Ay;

    // M = mG
    component mult2 = BabyPbk();
    mult2.in <== m;

    // kP
    component mult3 = BabyScalar();
    mult3.scalar <== vk;
    mult3.point[0] <== p[0];
    mult3.point[1] <== p[1];

    // c_2 = M + kP
    component adder = BabyAdd();
    adder.x1 <== mult2.Ax;
    adder.y1 <== mult2.Ay;
    adder.x2 <== mult3.Ax;
    adder.y2 <== mult3.Ay;

    c2[0] <== adder.xout;
    c2[1] <== adder.yout;
}

component main { public [c1ayAmount,c2ayAmount, c1balance, c2balance] } = VerifyPrivateTransfer();
