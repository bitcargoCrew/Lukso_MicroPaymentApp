module.exports = [
    "Quill Social Credits", // token name
    "QUILL", // token symbol
    process.env.UP_ADDR, // token owner
    0, // token type = TOKEN
    false, // isNonDivisible?
  ];


  //npx hardhat verify 0x04e88e1b017baf2f2a15468b2a567a20f81c64b8 --constructor-args ./verify/QuillSocialCredits.ts --network luksoTestnet