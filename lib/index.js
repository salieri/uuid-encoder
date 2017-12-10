const bigInt = require('big-integer');

const knownBases = {
  base36: '0123456789abcdefghijklmnopqrstuvwxyz',
  base32: '0123456789abcdefghjkmnpqrstvwxyz', // Crockford's base32
  base16: '0123456789abcdef',
  base10: '0123456789',
  base2: '01',
};


class UuidEncoder {
  /**
   * @public
   * @param [baseEncodingStr] A string containing all usable letters for encoding
   * @constructor
   */
  UuidCompressor(baseEncodingStr = 'base36') {
    this.setBaseEncodingStr(baseEncodingStr);
  }

  /**
   * Set compression base
   * @param {string} baseEncodingStr A string containing all usable letters for encoding
   * @public
   */
  setBaseEncodingStr(baseEncodingStr) {
    this.encStr = baseEncodingStr;
    this.base = this.encStr.length;
  }


  /**
   * @private
   * @param {string} baseEncodingStr
   */
  static resolveEncodingStr(baseEncodingStr) {
    if (knownBases[baseEncodingStr]) {
      return knownBases[baseEncodingStr];
    }

    return baseEncodingStr;
  }


  /**
   * Compress a UUID
   * @param {string} uuid Properly formatted UUID
   * @returns {string} Compressed UUID
   * @public
   */
  compress(uuid) {
    const cleanUuid = uuid.replace(/-/g, '');
    const { base, encStr } = this;

    let iUuid = bigInt(cleanUuid, 16);
    let str = '';

    while (iUuid.greater(0)) {
      str = encStr.substr(iUuid.mod(base).valueOf(), 1) + str;
      iUuid = iUuid.divide(base);
    }

    return str;
  }

  /**
   * Decompress a compressed UUID
   * @public
   * @param {string} str Previously compressed string
   * @returns {string} Properly formatted UUID
   */
  decompress(str) {
    let iUuid = bigInt(0);

    const { base, encStr } = this;
    const len = str.length;
    const finalStr = str.toLowerCase();

    for (let pos = 0; pos < len; pos += 1) {
      const ch = finalStr.substr(pos, 1);

      iUuid = iUuid.add(encStr.indexOf(ch));

      if (pos < len - 1) {
        iUuid = iUuid.multiply(base);
      }
    }

    const uuid = iUuid.toString(16).padStart(28, '0');

    return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;
  }
}


module.exports = UuidEncoder;
