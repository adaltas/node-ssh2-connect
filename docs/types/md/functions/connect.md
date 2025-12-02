[**ssh2-connect**](../README.md)

---

[ssh2-connect](../README.md) / connect

# Function: connect()

> **connect**(`options`): `Promise`\<`Client`\>

Defined in: [src/index.ts:47](https://github.com/adaltas/node-ssh2-connect/blob/70973f3d16959ea8097af368b4f04fb324a346ba/src/index.ts#L47)

Establishes an SSH connection using the provided configuration options.

## Parameters

### options

[`ConnectConfig`](../interfaces/ConnectConfig.md)

The configuration options for the SSH connection.

## Returns

`Promise`\<`Client`\>

A Promise that resolves to an SSH2 Client instance when the connection is established.

## Throws

Will reject the promise with an error if the connection fails after all retry attempts.

## Example

```typescript
const client = await connect({
  host: "example.com",
  username: "user",
  privateKeyPath: "~/.ssh/id_ed25519",
});
```
