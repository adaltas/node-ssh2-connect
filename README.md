# Node.js ssh2-connect

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-ssh2-connect/test.yml?branch=master)](https://github.com/adaltas/node-ssh2-connect/actions)
[![NPM](https://img.shields.io/npm/dm/ssh2-connect)](https://www.npmjs.com/package/ssh2-connect)
[![NPM](https://img.shields.io/npm/v/ssh2-connect)](https://www.npmjs.com/package/ssh2-connect)

The Node.js ssh2-connect package extends the [`ssh2`](https://www.npmjs.com/package/ssh2) module to provide a simplified callback-back approach to initiate a new SSH connection.

## Installation

The project is OSS and licensed under the [MIT license](https://github.com/adaltas/node-ssh2-connect/blob/master/LICENSE.md).

```bash
npm install ssh2-connect
```

## Usage

The `ssh2-connect` module exposes 4 functions.

```js
// With ESM
import { connect, is, closed, opened } from "ssh2-connect";
// Or with CommonJS
const { connect, is, closed, opened } = require("ssh2-connect");
```

Use `connect` to establishes the SSH connection

```js
// Establishes the SSH connection
const client = await connect({
  host: "example.com",
  username: "user",
  privateKeyPath: "~/.ssh/id_ed25519",
});
```

### `await connect(options: ConnectConfig): PromiseLike<Client>`

The `connect` function return a promise.

Options are inherited from the [ssh2 `connect` method](https://www.npmjs.com/package/ssh2#client-methods) with a few additions.

- `options` - The configuration options for the SSH connection.
- `options.username` - The username for authentication. Defaults to the current user if not provided.
- `options.retry` - The number of connection retry attempts. Set to `0` or `false` to disable retries, default is `1`.
- `options.wait` - The wait time in milliseconds between each attempts, default to `500`.
- `options.privateKey` - The private key as a string or Buffer for authentication.
- `options.privateKeyPath` - The path to the private key file, or true for auto-discovery in ~/.ssh.
- `options.password` - The password for authentication.
- `options.[key: string]` - Any other valid SSH2 connection options.

Note, the "privateKeyPath" option is provided as a conveniency to read the private key and fill the "privateKey" property.

Additionally, all options may be provided in camalize (the default in [ssh2](https://www.npmjs.com/package/ssh2)) and snake cases. For example, both "privateKey" and "private_key" would be interprated the same.

### `is(conn: unknown): boolean`

Checks if the provided argument `conn` is an instance of the `Client` connection class from the ssh2 package.

- `conn` - The object to check, probably an SSH client connection.

### `closed(conn: Client): boolean`

Checks if the provided SSH client connection is closed.

- `conn` - The SSH client connection to check.

### `opened(conn: Client): boolean`

Checks if the provided SSH client connection is open and writable.

- `conn` - The SSH client connection to check.

## Purpose

This package simplifies the creation and the usage of an SSH connection. For example, the original [ssh2](https://www.npmjs.com/package/ssh2) code...

```js
import ssh2 from "ssh2";
const connection = new ssh2();
connection.on("error", function (err) {
  // Handle the connection error
  connection.end();
});
connection.on("ready", function () {
  // Work with the connection
  connection.end();
});
connection.connect({
  host: "localhost",
  user: "milou",
  password: "wafwaf",
});
```

Is simplified to:

```js
import { connect } from "ssh2-connect";
try {
  const ssh = await connect({
    host: "localhost",
    username: "milou",
    private_key_path: "~/.ssh/id_ed25519",
  });
  // Work with the connection, then close it
} catch (err) {
  // Handle the connection error
} finally {
  // Close the connection
  ssh.end();
}
```

## Examples

The example is using both the "ssh2-connect" and "ssh2-fs" modules.

```js
const connect = require("ssh2-connect");
const fs = require("ssh2-fs");
// Open the connection
connect({host: "localhost"}, function(err, ssh){
  // Create a directory
  fs.mkdir(ssh, "/tmp/a_dir", (err, stdout, stderr){
    console.log(stdout);
  });
});
```

Compare this to the more verbose alternative using the original ssh2 module.

```js
ssh2 = require("ssh2");
fs = require("ssh2-fs");
connection = new ssh2();
connection.on("error", function(err){
  connection.end()
});
connection.on("ready", function(){
  fs.mkdir(connection, "/tmp/a_dir", (err, stdout, stderr){
    console.log(stdout);
  });
});
connection.connect({host: "localhost"});
```

## Development

Tests are executed with mocha. To install it, run `npm install`, it will install mocha and its dependencies in your project "node_modules" directory.

```bash
npm install
npm test
```

Source code is written in Typescription. The build command generates the JavaScript files.

```bash
npm run build
```

The test suite is run online with [GitHub actions](https://github.com/adaltas/node-ssh2-connect/actions) against several Node.js version.

## Release

Versions are incremented using semantic versioning. To create a new version and publish it to NPM, run:

```bash
npm run release
# Or (`git push` is only supported for the release script)
npm run release:<major|minor|patch>
git push --follow-tags origin master
```

The NPM publication is handled with the GitHub action.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com) based in Paris, France. Adaltas offers support and consulting on distributed system, big data and open source.

- David Worms: <https://github.com/wdavidw>
