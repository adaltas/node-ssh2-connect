
const fs = require('node:fs/promises');
const path = require('node:path');
const { Client } = require("ssh2");
const { camelize } = require('mixme');

module.exports = function(options, callback) {
  const work = async function(resolve, reject) {
    if (options instanceof Client) {
      return resolve(options);
    }
    options = camelize(options, 1);
    if (options.username == null) {
      options.username = process.env['USER'] || require('child_process').execSync("whoami", {
        encoding: 'utf8',
        timeout: 1000
      }).trim();
    }
    if (options.username == null) {
      options.username = 'root'; // We've seed 'USER' not inside env inside the docker centos6 container.
    }
    if (options.retry == null) {
      options.retry = 1;
    }
    if (options.wait == null) {
      options.wait = 500;
    }
    if (!options.password && !options.privateKey) {
      if (options.privateKeyPath == null) {
        options.privateKeyPath = true; // Auto discovery
      }
    } else {
      options.privateKeyPath = null;
    }
    try {
      // Extract private key from file
      if (typeof options.privateKeyPath === 'string') {
        let match;
        if (match = /~(\/.*)/.exec(options.privateKeyPath)) {
          options.privateKeyPath = path.join(process.env.HOME, match[1]);
        }
        options.privateKey = (await fs.readFile(options.privateKeyPath, 'ascii'));
      } else if (options.privateKeyPath === true) {
        for (const algo of ['id_ed25519', 'id_rsa']) {
          const source = path.resolve(process.env.HOME, '.ssh', algo);
          try {
            options.privateKey = await fs.readFile(source, 'ascii');
            break;
          } catch (error) {}
        }
        if (options.privateKey == null) {
          throw Error('Failed to discover an ssh private key inside `~/.ssh`.');
        }
      }
    } catch (error) {
      reject(error);
    }
    // Connection attempts
    let retry = options.retry;
    const connect = function() {
      var connection, succeed;
      if (retry !== true && retry > 0) {
        retry--;
      }
      succeed = false;
      connection = new Client();
      connection.on('error', function(error) {
        connection.end();
        // Event "error" is thrown after a "ready" if the connection is lost
        if (succeed) {
          return;
        }
        if (retry === true || retry > 0) {
          setTimeout(connect, options.wait);
        } else {
          reject(error);
        }
      });
      connection.on('ready', function() {
        succeed = true;
        resolve(connection);
      });
      return connection.connect(options);
    };
    return connect();
  };
  if (!callback) {
    return new Promise(work);
  } else {
    work(function(conn) {
      callback(null, conn);
    }, function(error) {
      callback(error);
    });
  }
};

module.exports.opened = function(conn) {
  // ssh@0.3.x use "_state"
  // ssh@0.4.x use "_sshstream" and "_sock"
  // ssh@1.7.0 use "ssh._writableState?.ended"
  return (conn._state != null && conn._state !== 'closed') || (conn._sshstream?.writable && conn._sock?.writable) || (conn._sock?._writableState?.ended === false)
};

module.exports.closed = function(conn) {
  // ssh@0.3.x use "_state"
  // ssh@0.4.x use "_sshstream" and "_sock"
  // ssh@1.7.0 use "ssh._writableState?.ended"
  return !module.exports.opened(conn);
};

module.exports.is = function(conn) {
  return conn instanceof Client;
};
