import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Client, ConnectConfig as Config } from "ssh2";
import { camelize } from "mixme";

type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}` ?
    `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;
type KeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
};

interface ConnectConfig extends Config, KeysToSnakeCase<Config> {
  retry?: number | boolean;
  wait?: number;
  privateKey?: string | Buffer;
  private_key?: string | Buffer;
  privateKeyPath?: string | boolean;
  private_key_path?: string | boolean;
}
/**
 * Establishes an SSH connection using the provided configuration options.
 *
 * @param options - The configuration options for the SSH connection.
 * @param options.username - The username for authentication. Defaults to the current user if not provided.
 * @param options.retry - The number of connection retry attempts. Set to `0` or `false` to disable retries, default is `1`.
 * @param options.wait - The wait time in milliseconds between each attempts, default to `500`.
 * @param options.privateKey - The private key as a string or Buffer for authentication.
 * @param options.privateKeyPath - The path to the private key file, or true for auto-discovery in ~/.ssh.
 * @param options.password - The password for authentication.
 * @param options.[key: string] - Any other valid SSH2 connection options.
 *
 * @returns A Promise that resolves to an SSH2 Client instance when the connection is established.
 *
 * @throws Will reject the promise with an error if the connection fails after all retry attempts.
 *
 * @example
 * ```typescript
 * const client = await connect({
 *   host: 'example.com',
 *   username: 'user',
 *   privateKeyPath: '~/.ssh/id_ed25519'
 * });
 * ```
 */
const connect = function (options: ConnectConfig): Promise<Client> {
  const work = async function (
    resolve: (value: Client) => void,
    reject: (reason?: any) => void,
  ) {
    if (options instanceof Client) {
      return resolve(options);
    }
    options = camelize(options, 1) as ConnectConfig;
    if (options.username == null) {
      options.username =
        process.env["USER"] ||
        require("child_process")
          .execSync("whoami", {
            encoding: "utf8",
            timeout: 1000,
          })
          .trim();
    }
    if (options.username == null) {
      options.username = "root"; // We've seed 'USER' not inside env inside the docker centos6 container.
    }
    if (options.retry == null) {
      options.retry = 1;
    }
    if (options.retry === false) {
      options.retry = 0;
    }
    if (options.wait == null) {
      options.wait = 500;
    }
    if (!options.password && !options.privateKey) {
      if (options.privateKeyPath == null) {
        options.privateKeyPath = true; // Auto discovery
      }
    } else {
      options.privateKeyPath = undefined;
    }
    try {
      // Extract private key from file
      if (typeof options.privateKeyPath === "string") {
        let match;
        if ((match = /~(\/.*)/.exec(options.privateKeyPath))) {
          options.privateKeyPath = path.join(process.env.HOME!, match[1]);
        }
        options.privateKey = await fs.readFile(options.privateKeyPath, "ascii");
      } else if (options.privateKeyPath === true) {
        for (const algo of ["id_ed25519", "id_rsa"]) {
          const source = path.resolve(process.env.HOME!, ".ssh", algo);
          try {
            options.privateKey = await fs.readFile(source, "ascii");
            break;
          } catch {
            /* empty */
          }
        }
        if (options.privateKey == null) {
          throw Error("Failed to discover an ssh private key inside `~/.ssh`.");
        }
      }
    } catch (error) {
      reject(error);
    }
    // Connection attempts
    let retry = options.retry;
    const connect = function () {
      if (retry !== true && retry > 0) {
        retry--;
      }
      let succeed = false;
      const connection = new Client();
      connection.on("error", function (error) {
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
      connection.on("ready", function () {
        succeed = true;
        resolve(connection);
      });
      return connection.connect(options);
    };
    return connect();
  };
  return new Promise(work);
};


/**
 * Checks if the provided argument `conn` is an instance of the `Client` connection class from the ssh2 package.
 *
 * @param conn - The object to check, probably an SSH client connection.
 *
 * @returns A boolean value indicating whether the given object is an SSH client connection or not.
 */
const is = function (conn: unknown): boolean {
  return conn instanceof Client;
};

/**
 * Checks if the provided SSH client connection is closed.
 *
 * @param conn - The SSH client connection to check.
 *
 * @returns A boolean value indicating whether the connection is closed (true) or open (false).
 */
const closed = function (conn: Client): boolean {
  return !opened(conn);
};

/**
 * Checks if the provided SSH client connection is open and writable.
 *
 * @param conn - The SSH client connection to check.
 *
 * @returns A boolean value indicating whether the connection is open and writable (true) or closed (false).
 */
const opened = function (conn: Client): boolean {
  class _Client extends Client {
    _state?: string;
    _sshstream?: {
      writable: boolean;
    };
    _sock?: {
      writable: boolean;
      _writableState: {
        ended: boolean;
      };
    };
  }
  // ssh@0.3.x use "_state"
  // ssh@0.4.x use "_sshstream" and "_sock"
  // ssh@1.7.0 use "ssh._writableState?.ended"
  const _conn = conn as _Client;
  return (
    (_conn._state != null && _conn._state !== "closed") ||
    (_conn._sshstream?.writable && _conn._sock?.writable) ||
    _conn._sock?._writableState?.ended === false
  );
};

export default connect;
export { connect, is, closed, opened, ConnectConfig };
