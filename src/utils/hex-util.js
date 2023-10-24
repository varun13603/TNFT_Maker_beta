/* eslint-disable no-array-constructor */
/*** Usage 
const HexAddress = require("./utils/HexAddress");
let base58 = HexAddress.toBase58(res.result.contributor);
*/

const jsSHA = require("jssha");
const BASE = 58;
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {}
for (let i = 0; i < ALPHABET.length; i++) ALPHABET_MAP[ALPHABET.charAt(i)] = i

export class HexAddress {
    
    static toBase58(hex) {
        let HA = new HexAddress();
        let bytes = HA.hexStr2byteArray(hex);
        let base58 = HA.getBase58CheckAddress(bytes);
        HA = null;
        bytes = null;
        return base58;
    }


     hexStr2byteArray(str) {
        var byteArray = Array();
        var d = 0;
        var i = 0;
        var j = 0;
        var k = 0;

        for (i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (this.isHexChar(c)) {
                d <<= 4;
                d += this.hexChar2byte(c);
                j++;
                if (0 === (j % 2)) {
                    byteArray[k++] = d;
                    d = 0;
                }
            }
        }
        return byteArray;
    }

     getBase58CheckAddress(addressBytes) {
        var hash0 = this.SHA256(addressBytes);
        var hash1 = this.SHA256(hash0);
        var checkSum = hash1.slice(0, 4);
        checkSum = addressBytes.concat(checkSum);
        var base58Check = this.encode58(checkSum);

        return base58Check;
    }


     SHA256(msgBytes) {
        var shaObj = new jsSHA("SHA-256", "HEX");
        var msgHex = this.byteArray2hexStr(msgBytes);
        shaObj.update(msgHex);
        var hashHex = shaObj.getHash("HEX");
        var hashBytes = this.hexStr2byteArray(hashHex);
        return hashBytes;
    }


     byteArray2hexStr(byteArray) {
        var str = "";
        for (var i = 0; i < (byteArray.length - 1); i++) {
            str += this.byte2hexStr(byteArray[i]);
        }
        str += this.byte2hexStr(byteArray[i]);
        return str;
    }


     byte2hexStr(byte) {
        var hexByteMap = "0123456789ABCDEF";
        var str = "";
        str += hexByteMap.charAt(byte >> 4);
        str += hexByteMap.charAt(byte & 0x0f);
        return str;
    }


     encode58(buffer) {
        if (buffer.length === 0) {
            return ''
        }

        var i, j, digits = [0]
        for (i = 0; i < buffer.length; i++) {
            for (j = 0; j < digits.length; j++) {
                digits[j] <<= 8
            }

            digits[0] += buffer[i]

            var carry = 0
            for (j = 0; j < digits.length; ++j) {
                digits[j] += carry

                carry = (digits[j] / BASE) | 0
                digits[j] %= BASE
            }

            while (carry) {
                digits.push(carry % BASE)

                carry = (carry / BASE) | 0
            }
        }

        // deal with leading zeros
        for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
            digits.push(0)
        }

        return digits.reverse().map(function (digit) {
            return ALPHABET[digit]
        }).join('')
    }

    /* Check if a char is hex char */
     isHexChar(c) {
        if ((c >= 'A' && c <= 'F') ||
            (c >= 'a' && c <= 'f') ||
            (c >= '0' && c <= '9')) {
            return 1;
        }
        return 0;
    }

    /* Convert a hex char to value */
     hexChar2byte(c) {
        var d = 0;
        if (c >= 'A' && c <= 'F') {
            d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        }
        else if (c >= 'a' && c <= 'f') {
            d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        }
        else if (c >= '0' && c <= '9') {
            d = c.charCodeAt(0) - '0'.charCodeAt(0);
        }
        return d;
    }


}