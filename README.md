[![Build Status](https://secure.travis-ci.org/adaltas/node-ssh2-connect.png)][travis]

# Node.js ssh2-connect

The Node.js ssh2-connect package extends the [`ssh2`][ssh2] module to provide a simplified callback-back approach to initiate a new SSH connection.

## Usage

The `connect` function return a promise. Its signature is `await connect(options)`

It also accept an optional callback function. In such case, its signature is `connect(options, callback)`.

This package simplifies the creation of an SSH connection. For example, the original ssh2 code...

```js
const ssh2 = require('ssh2')
const connection = new ssh2()
connection.on('error', function(err){
  // Handle the connection error
  connection.end()
})
connection.on('ready', function(){
  // Work with the connection
  connection.end()
})
connection.connect({
  host: 'localhost',
  user: 'milou',
  password: 'wafwaf'
})
```

...is simplified to:

```js
const connect = require('ssh2-connect')
(async () => {
  try{
    const ssh = await connect({
      host: 'localhost',
      username: 'david',
      private_key_path: '~/.ssh/id_rsa'
    })
    // Work with the connection
    ssh.end()
  }catch (err){
    // Handle the connection error
  }
})()
```

## Options

Options are inherited from the [ssh2 `Connection.prototype.connect`][ssh2-connect] function with a few additions:

-   `username`   
    The username used to initiate the connection, default to the current
    environment user.
-   `privateKeyPath`   
    Path of the file containing the private key, `true` to enable auto-discovery or `false` to disable auto-discovery, default to `true`.   
-   `retry`
    Attempt to reconnect multiple times, default to `1`.   
-   `wait`
    Time to wait in milliseconds between each retry, default to `2000`.  

Note, the "privateKeyPath" option is provided as a conveniency to read the private key and fill the "privateKey" property.

Additionally, all options may be provided in camalize (the default in [ssh2]) or underscore form. For example, both "privateKey" and "private_key" would be interprated the same.

## Installation

This is OSS and licensed under the [new BSD license][license].

```bash
npm install ssh2-connect
```

## Examples

The example is using both the "ssh2-connect" and "ssh2-fs" modules.

```js
const connect = require('ssh2-connect');
const fs = require('ssh2-fs');
// Open the connection
connect({host: 'localhost'}, function(err, ssh){
  // Create a directory
  fs.mkdir(ssh, '/tmp/a_dir', (err, stdout, stderr){
    console.log(stdout);
  });
});
```

Compare this to the more verbose alternative using the original ssh2 module.

```js
ssh2 = require('ssh2');
fs = require('ssh2-fs');
connection = new ssh2();
connection.on('error', function(err){
  connection.end()
});
connection.on('ready', function(){
  fs.mkdir(connection, '/tmp/a_dir', (err, stdout, stderr){
    console.log(stdout);
  });
});
connection.connect({host: 'localhost'});
```

## Development

Tests are executed with mocha. To install it, simple run `npm install`, it will install mocha and its dependencies in your project "node_modules" directory.

To run the tests:

```bash
npm test
```

To generate the JavaScript files:

```bash
npm run build
```

The test suite is run online with GitHub action against several Node.js version.

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

*   David Worms: <https://github.com/wdavidw>

This package is developed by [Adaltas](https://www.adaltas.com).

[travis]: http://travis-ci.org/adaltas/node-ssh2-connect
[ssh2]: https://github.com/mscdex/ssh2
[ssh2-connect]: https://github.com/adaltas/node-ssh2-connect
[license]: https://github.com/adaltas/node-ssh2-connect/blob/master/LICENSE.md
