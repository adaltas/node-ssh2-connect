import * as os from "os";
import * as fs from "node:fs/promises";
import { ClientErrorExtensions } from "ssh2";
import "should";
import { connect } from "../src/index.js";

describe("connect", function () {
  it("initiate a new connection", async function () {
    let whoami: string;
    const conn = await connect({});
    conn.exec("whoami", (err, stream) => {
      stream
        .on("close", (code: number) => {
          code.should.eql(0);
          whoami.should.eql(os.userInfo().username);
          conn.end();
        })
        .on("data", (data: number) => {
          whoami = data.toString().trim();
        });
    });
  });

  it("initiate a failed connection", async function () {
    try {
      await connect({
        host: "doesntexists",
        username: "iam",
        password: "invalid",
      });
      throw Error("Unexpected error");
    } catch (err) {
      // MacOS ssh2@1.7.0
      // Object.keys(err).should.eql ['level']
      // But on GH actions with Ubuntu
      // Object.keys(err).should.eql ['errno', 'code', 'syscall', 'hostname', 'level']
      (err as ClientErrorExtensions).level?.should.equalOneOf(
        "client-authentication",
        "client-socket",
      );
    }
  });

  it("option `privateKey` as a buffer", async function () {
    const pk = await fs.readFile(`${process.env.HOME}/.ssh/id_ed25519`);
    const conn = await connect({
      host: "127.0.0.1",
      privateKey: pk,
    });
    conn.end();
  });

  it("option `privateKeyPath`", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    conn.end();
  });

  it("option `privateKeyPath` with missing file", async function () {
    connect({
      host: "127.0.0.1",
      privateKeyPath: "./doesntexists",
    }).should.be.rejectedWith(
      "ENOENT: no such file or directory, open './doesntexists'",
    );
  });

  it("options are camelized", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      private_key_path: "~/.ssh/id_ed25519",
    });
    conn.end();
  });
});
