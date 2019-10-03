const bigInt = require('big-integer');

const knownBases = {
  base64url: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_',
  base64: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/',
  base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', // Bitcoin base58
  base36: '0123456789abcdefghijklmnopqrstuvwxyz',
  base32: '0123456789abcdefghjkmnpqrstvwxyz', // Crockford's base32
  base16: '0123456789abcdef',
  base10: '0123456789',
  base2: '01',
};


const caseSensitiveBases = {
  base64url: true,
  base64: true,
  base62: true,
  base58: true,
  base36: false,
  base32: false,
  base16: false,
  base10: true,
  base2: true,
};


class UuidEncoder {
  /**
   * @public
   * @param [baseEncodingStr] A string containing all usable letters for encoding
   * @constructor
   */
  constructor(baseEncodingStr = 'base36') {
    this.setBaseEncodingStr(baseEncodingStr);
  }

  /**
   * Set encoding base
   * @param {string} baseEncodingStr A string containing all usable letters for encoding
   * @public
   */
  setBaseEncodingStr(baseEncodingStr) {
    this.encStr = UuidEncoder.resolveEncodingStr(baseEncodingStr);
    this.isCaseSensitive = UuidEncoder.isCaseSensitiveBase(baseEncodingStr);
    this.base = this.encStr.length;
  }


  /**
   * @private
   * @param {string} baseEncodingStr
   * @returns {string}
   */
  static resolveEncodingStr(baseEncodingStr) {
    return Object.prototype.hasOwnProperty.call(knownBases, baseEncodingStr)
      ? knownBases[baseEncodingStr] : baseEncodingStr;
  }

  /**
   * @public
   * @param baseEncodingStr
   * @returns {boolean}
   */
  static isCaseSensitiveBase(baseEncodingStr) {
    return Object.prototype.hasOwnProperty.call(caseSensitiveBases, baseEncodingStr)
      ? caseSensitiveBases[baseEncodingStr] : true;
  }

  /**
   * Encode a UUID
   * @param {string} uuid Properly formatted UUID
   * @returns {string} Encoded UUID
   * @public
   */
  encode(uuid) {
    const cleanUuid = uuid.replace(/-/g, '');
    const { base, encStr } = this;

    let iUuid = bigInt(cleanUuid, 16);
    let str = '';

    do {
      str = encStr.substr(iUuid.mod(base).valueOf(), 1) + str;
      iUuid = iUuid.divide(base);
    } while (iUuid.greater(0));

    return str;
  }

  /**
   * Decode an encoded UUID
   * @public
   * @param {string} str Previously encoded string
   * @returns {string} Properly formatted UUID
   * @throws Throws an {Error} when encountering invalid data
   */
  decode(str) {
    let iUuid = bigInt(0);

    const { base, encStr } = this;
    const len = str.length;
    const finalStr = (this.isCaseSensitive) ? str : str.toLowerCase();


    for (let pos = 0; pos < len; pos += 1) {
      const ch = finalStr.substr(pos, 1);
      const encPos = encStr.indexOf(ch);

      if (encPos < 0) {
        throw new Error('Invalid encoded data');
      }

      iUuid = iUuid.add(encPos);

      if (pos < len - 1) {
        iUuid = iUuid.multiply(base);
      }
    }

    const uuid = iUuid.toString(16).padStart(32, '0');

    return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;
  }
}


module.exports = UuidEncoder;
