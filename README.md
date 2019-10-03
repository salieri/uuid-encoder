# UUID Encoder

Convert UUIDs into Base32, Base36, or any other encoding of your choice.

[![Build Status](https://travis-ci.org/salieri/uuid-encoder.svg?branch=master)](https://travis-ci.org/salieri/uuid-encoder) [![Coverage Status](https://coveralls.io/repos/github/salieri/uuid-encoder/badge.svg?branch=master)](https://coveralls.io/github/salieri/uuid-encoder?branch=master) [![Dependency Status](https://david-dm.org/salieri/uuid-encoder/status.svg)](https://david-dm.org/salieri/uuid-encoder#info=dependencies&view=table) [![Dev Dependency Status](https://david-dm.org/salieri/uuid-encoder/dev-status.svg)](https://david-dm.org/salieri/uuid-encoder#info=devDependencies&view=table)


## Usage

```js
const UuidEncoder = require('uuid-encoder');

// Create Base 36 encoder
const encoder = new UuidEncoder('base36');

// Encode an UUID
const encodedUuid = encoder.encode('38b9823d-fa1a-48e7-91fc-ee16ad091cf2');

// Decode an encoded UUID
const decodedUuid = encoder.decode(encodedUuid);
```


## API

### UuidEncoder([baseEncodingStr = 'base36'])

Instantiate a new encoder using the specified base encoder.

### string encode(string uuid)

Returns a string containing the encoded version of the `uuid`.

### string decode(string str)

Returns a string containing the decoded UUID from `str`.


## Encoding

### Built-In Encodings

| Type       | Charset  | Description |
| :--------- | :------- | :----------------------- |
| `'base2'`  | 0-1      | Binary encoding |
| `'base10'` | 0-9      | Decimal encoding |
| `'base16'` | 0-9, a-f | Hexadecimal encoding |
| `'base32'` | _Custom_ | Crockford's Base 32 |
| `'base36'` | 0-9, a-z | Base 36 (default) |
| `'base58'` | _Custom_ | Bitcoin Base 58 |
| `'base62'` | 0-9, A-Z, a-z | Base 62 |
| `'base64'` | 0-9, A-Z, a-z, +, / | Base 64 |
| `'base64url'` | 0-9, A-Z, a-z, -, _ | Base 64 URL encoding (RFC 4648) |



## Custom Encoding

To use a different set or count of encoding characters, simply pass a string
containing every desired letter to the constructor.

All custom encoding sets are **case sensitive**.

```js
const encoder = new UuidEncoder('02468ACEGI'); // weird base10
```
