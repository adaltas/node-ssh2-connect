[**ssh2-connect**](../README.md)

---

[ssh2-connect](../README.md) / ConnectConfig

# Interface: ConnectConfig

Defined in: [src/index.ts:14](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L14)

## Extends

- `ConnectConfig`.`KeysToSnakeCase`\<`Config`\>

## Properties

### agent?

> `optional` **agent**: `string` \| `BaseAgent`\<`string` \| `Buffer`\<`ArrayBufferLike`\> \| `ParsedKey`\>

Defined in: node_modules/@types/ssh2/index.d.ts:727

Path to ssh-agent's UNIX socket for ssh-agent-based user authentication (or 'pageant' when using Pagent on Windows).

#### Inherited from

`Config.agent`

---

### agent_forward?

> `optional` **agent_forward**: `boolean`

#### Inherited from

`ConnectConfig`.[`agentForward`](#agentforward)

---

### agentForward?

> `optional` **agentForward**: `boolean`

Defined in: node_modules/@types/ssh2/index.d.ts:749

Set to `true` to use OpenSSH agent forwarding (`auth-agent@openssh.com`) for the life of the connection.

#### Inherited from

`Config.agentForward`

---

### algorithms?

> `optional` **algorithms**: `Algorithms`

Defined in: node_modules/@types/ssh2/index.d.ts:751

Explicit overrides for the default transport layer algorithms used for the connection.

#### Inherited from

`Config.algorithms`

---

### auth_handler?

> `optional` **auth_handler**: `AuthenticationType`[] \| `AuthHandlerMiddleware` \| `AuthMethod`[]

#### Inherited from

`ConnectConfig`.[`authHandler`](#authhandler)

---

### authHandler?

> `optional` **authHandler**: `AuthenticationType`[] \| `AuthHandlerMiddleware` \| `AuthMethod`[]

Defined in: node_modules/@types/ssh2/index.d.ts:755

Function with parameters (methodsLeft, partialSuccess, callback) where methodsLeft and partialSuccess are null on the first authentication attempt, otherwise are an array and boolean respectively. Return or call callback() with the name of the authentication method to try next (pass false to signal no more methods to try). Valid method names are: 'none', 'password', 'publickey', 'agent', 'keyboard-interactive', 'hostbased'. Default: function that follows a set method order: None -> Password -> Private Key -> Agent (-> keyboard-interactive if tryKeyboard is true) -> Hostbased.

#### Inherited from

`Config.authHandler`

---

### debug?

> `optional` **debug**: `DebugFunction`

Defined in: node_modules/@types/ssh2/index.d.ts:753

A function that receives a single string argument to get detailed (local) debug information.

#### Inherited from

`Config.debug`

---

### force_i_pv_4?

> `optional` **force_i_pv_4**: `boolean`

#### Inherited from

`ConnectConfig`.[`forceIPv4`](#forceipv4)

---

### force_i_pv_6?

> `optional` **force_i_pv_6**: `boolean`

#### Inherited from

`ConnectConfig`.[`forceIPv6`](#forceipv6)

---

### forceIPv4?

> `optional` **forceIPv4**: `boolean`

Defined in: node_modules/@types/ssh2/index.d.ts:715

Only connect via resolved IPv4 address for `host`.

#### Inherited from

`Config.forceIPv4`

---

### forceIPv6?

> `optional` **forceIPv6**: `boolean`

Defined in: node_modules/@types/ssh2/index.d.ts:717

Only connect via resolved IPv6 address for `host`.

#### Inherited from

`Config.forceIPv6`

---

### host?

> `optional` **host**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:711

Hostname or IP address of the server.

#### Inherited from

`Config.host`

---

### host_hash?

> `optional` **host_hash**: `string`

#### Inherited from

`ConnectConfig`.[`hostHash`](#hosthash)

---

### host_verifier?

> `optional` **host_verifier**: `HostVerifier` \| `SyncHostVerifier` \| `HostFingerprintVerifier` \| `SyncHostFingerprintVerifier`

#### Inherited from

`ConnectConfig`.[`hostVerifier`](#hostverifier)

---

### hostHash?

> `optional` **hostHash**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:719

The host's key is hashed using this method and passed to `hostVerifier`.

#### Inherited from

`Config.hostHash`

---

### hostVerifier?

> `optional` **hostVerifier**: `HostVerifier` \| `SyncHostVerifier` \| `HostFingerprintVerifier` \| `SyncHostFingerprintVerifier`

Defined in: node_modules/@types/ssh2/index.d.ts:721

Verifies a hexadecimal hash of the host's key.

#### Inherited from

`Config.hostVerifier`

---

### ident?

> `optional` **ident**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: node_modules/@types/ssh2/index.d.ts:763

A custom server software name/version identifier. Default: 'ssh2js' + moduleVersion + 'srv'

#### Inherited from

`Config.ident`

---

### keepalive_count_max?

> `optional` **keepalive_count_max**: `number`

#### Inherited from

`ConnectConfig`.[`keepaliveCountMax`](#keepalivecountmax)

---

### keepalive_interval?

> `optional` **keepalive_interval**: `number`

#### Inherited from

`ConnectConfig`.[`keepaliveInterval`](#keepaliveinterval)

---

### keepaliveCountMax?

> `optional` **keepaliveCountMax**: `number`

Defined in: node_modules/@types/ssh2/index.d.ts:741

How many consecutive, unanswered SSH-level keepalive packets that can be sent to the server before disconnection.

#### Inherited from

`Config.keepaliveCountMax`

---

### keepaliveInterval?

> `optional` **keepaliveInterval**: `number`

Defined in: node_modules/@types/ssh2/index.d.ts:739

How often (in milliseconds) to send SSH-level keepalive packets to the server. Set to 0 to disable.

#### Inherited from

`Config.keepaliveInterval`

---

### local_address?

> `optional` **local_address**: `string`

#### Inherited from

`ConnectConfig`.[`localAddress`](#localaddress)

---

### local_hostname?

> `optional` **local_hostname**: `string`

#### Inherited from

`ConnectConfig`.[`localHostname`](#localhostname)

---

### local_port?

> `optional` **local_port**: `number`

#### Inherited from

`ConnectConfig`.[`localPort`](#localport)

---

### local_username?

> `optional` **local_username**: `string`

#### Inherited from

`ConnectConfig`.[`localUsername`](#localusername)

---

### localAddress?

> `optional` **localAddress**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:757

IP address of the network interface to use to connect to the server. Default: (none -- determined by OS)

#### Inherited from

`Config.localAddress`

---

### localHostname?

> `optional` **localHostname**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:733

Along with `localUsername` and `privateKey`, set this to a non-empty string for hostbased user authentication.

#### Inherited from

`Config.localHostname`

---

### localPort?

> `optional` **localPort**: `number`

Defined in: node_modules/@types/ssh2/index.d.ts:759

The local port number to connect from. Default: (none -- determined by OS)

#### Inherited from

`Config.localPort`

---

### localUsername?

> `optional` **localUsername**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:735

Along with `localHostname` and `privateKey`, set this to a non-empty string for hostbased user authentication.

#### Inherited from

`Config.localUsername`

---

### passphrase?

> `optional` **passphrase**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: node_modules/@types/ssh2/index.d.ts:731

For an encrypted private key, this is the passphrase used to decrypt it.

#### Inherited from

`Config.passphrase`

---

### password?

> `optional` **password**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:725

Password for password-based user authentication.

#### Inherited from

`Config.password`

---

### port?

> `optional` **port**: `number`

Defined in: node_modules/@types/ssh2/index.d.ts:713

Port number of the server.

#### Inherited from

`Config.port`

---

### private_key?

> `optional` **private_key**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [src/index.ts:18](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L18)

#### Overrides

`KeysToSnakeCase.private_key`

---

### private_key_path?

> `optional` **private_key_path**: `string` \| `boolean`

Defined in: [src/index.ts:20](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L20)

---

### privateKey?

> `optional` **privateKey**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [src/index.ts:17](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L17)

Buffer or string that contains a private key for either key-based or hostbased user authentication (OpenSSH format).

#### Overrides

`Config.privateKey`

---

### privateKeyPath?

> `optional` **privateKeyPath**: `string` \| `boolean`

Defined in: [src/index.ts:19](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L19)

---

### ready_timeout?

> `optional` **ready_timeout**: `number`

#### Inherited from

`ConnectConfig`.[`readyTimeout`](#readytimeout)

---

### readyTimeout?

> `optional` **readyTimeout**: `number`

Defined in: node_modules/@types/ssh2/index.d.ts:743

- How long (in milliseconds) to wait for the SSH handshake to complete.

#### Inherited from

`Config.readyTimeout`

---

### retry?

> `optional` **retry**: `number` \| `boolean`

Defined in: [src/index.ts:15](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L15)

---

### sock?

> `optional` **sock**: `Readable`

Defined in: node_modules/@types/ssh2/index.d.ts:747

A `ReadableStream` to use for communicating with the server instead of creating and using a new TCP connection (useful for connection hopping).

#### Inherited from

`Config.sock`

---

### strict_vendor?

> `optional` **strict_vendor**: `boolean`

#### Inherited from

`ConnectConfig`.[`strictVendor`](#strictvendor)

---

### strictVendor?

> `optional` **strictVendor**: `boolean`

Defined in: node_modules/@types/ssh2/index.d.ts:745

Performs a strict server vendor check before sending vendor-specific requests.

#### Inherited from

`Config.strictVendor`

---

### timeout?

> `optional` **timeout**: `number`

Defined in: node_modules/@types/ssh2/index.d.ts:761

The underlying socket timeout in ms. Default: none)

#### Inherited from

`Config.timeout`

---

### try_keyboard?

> `optional` **try_keyboard**: `boolean`

#### Inherited from

`ConnectConfig`.[`tryKeyboard`](#trykeyboard)

---

### tryKeyboard?

> `optional` **tryKeyboard**: `boolean`

Defined in: node_modules/@types/ssh2/index.d.ts:737

Try keyboard-interactive user authentication if primary user authentication method fails.

#### Inherited from

`Config.tryKeyboard`

---

### username?

> `optional` **username**: `string`

Defined in: node_modules/@types/ssh2/index.d.ts:723

Username for authentication.

#### Inherited from

`Config.username`

---

### wait?

> `optional` **wait**: `number`

Defined in: [src/index.ts:16](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L16)
