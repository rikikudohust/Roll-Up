const Scalar = require("ffjavascript").Scalar;
const { leBuff2int } = require("ffjavascript").utils;
const {buildPoseidon} = require('circomlibjs');

/**
 * Waits until promise is resolved
 * @param {Number} ms - second to wait expressed in miliseconds
 * @returns {Promise} - Promise to resolve in ms specified
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Encode number into a buffer for agiven size. Padding with '0'.
 * @param {Number} num - number
 * @param {Number} size - number size
 * @returns {Buffer} - byte number representation
 */
function num2Buff(num, size) {
    let bytes = [];
    for (let i=0; i<size; i++) {
        bytes.push((num >> (i*8))&0xFF);
    }
    return Buffer.from(bytes);
}

/**
 * Fill string with '0'
 * @param {String} str - input string
 * @param {Number} length - string final length
 * @returns {String} - string filled with '0'
 */
function padZeroes(str, length) {
    if (length > str.length)
        str = "0".repeat(length - str.length) + str;
    return str;
}

/**
 * Convert Array of hexadecimals strings to array of BigInts
 * @param {Array} arrayHex - array of strings encoded as hex
 * @returns {Array} - array of BigInts 
 */
function arrayHexToBigInt(arrayHex) {
    const arrayBigInt = [];
    arrayHex.forEach((element) => {
        arrayBigInt.push(Scalar.fromString(element, 16));
    });
    return arrayBigInt;
}

/**
 * Convert Array of BigInts into array of Strings
 * @param {Array} arrayBigInt - array of BigInts
 * @returns {Array} - array of strings
 */
function arrayBigIntToArrayStr(arrayBigInt) {
    const arrayStr = [];
    for (let i = 0; i < arrayBigInt.length; i++) {
        arrayStr.push(arrayBigInt[i].toString());
    }
    return arrayStr;
}

/**
 * Concatenate array of strings with fixed 32bytes fixen length
 * @param {Array} arrayStr - array of strings
 * @returns {String} - result array 
 */
function buildElement(arrayStr) {
    let finalStr = "";
    arrayStr.forEach((element) => {
        finalStr = finalStr.concat(element);
    });
    return `0x${padZeroes(finalStr, 64)}`;
}

/**
 * Poseidon hash of a generic buffer
 * @param {Buffer} msgBuff 
 * @returns {BigInt} - final hash
 */
async function hashBuffer(msgBuff) {
    const poseidon = await buildPoseidon();
    const n = 31;
    const msgArray = [];
    const fullParts = Math.floor(msgBuff.length / n);
    for (let i = 0; i < fullParts; i++) {
        const v = leBuff2int(msgBuff.slice(n * i, n * (i + 1)));
        msgArray.push(v);
    }
    if (msgBuff.length % n !== 0) {
        const v = leBuff2int(msgBuff.slice(fullParts * n));
        msgArray.push(v);
    }
    return poseidon(msgArray);
}

module.exports = {
    arrayHexToBigInt,
    padZeroes,
    buildElement,
    arrayBigIntToArrayStr,
    hashBuffer,
    num2Buff,
    timeout,
};

