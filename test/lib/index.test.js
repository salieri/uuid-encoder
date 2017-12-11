const UuidEncoder = require('../../lib/index');
const TestData = require('./data');
const _ = require('lodash');

require('chai').should();

describe(
  'UUID Encoder',
  () => {
    it(
      'should encode and decode UUIDs',
      () => {
        _.each(
          TestData.encodings,
          (encoding) => {
            const encoder = new UuidEncoder(encoding);

            _.each(
              TestData.uuids,
              (uuid) => {
                const encoded = encoder.encode(uuid);

                encoded.length.should.be.at.least(1);
                encoded.should.not.equal(uuid);

                const decoded = encoder.decode(encoded);

                decoded.should.equal(uuid);

                (() => (encoder.decode(encoded.toLowerCase()))).should.not.Throw();
                (() => (encoder.decode(encoded.toUpperCase()))).should.not.Throw();
              },
            );
          },
        );
      },
    );


    it(
      'should support custom encoding sets',
      () => {
        const encoding  = 'ABCDEFG';
        const encoder   = new UuidEncoder(encoding);

        _.each(
          TestData.uuids,
          (uuid) => {
            const encoded = encoder.encode(uuid);

            encoded.should.not.equal(uuid);

            encoded.length.should.be.at.least(1);
            encoded.should.match(/[ABCDEFG]/);
            encoded.should.not.match(/[^ABCDEFG]/);

            const decoded = encoder.decode(encoded);

            decoded.should.equal(uuid);

            (() => (encoder.decode(encoded.toLowerCase()))).should.Throw();
          },
        );
      },
    );
  },
);
