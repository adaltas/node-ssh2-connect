import os from "os";
import fs from "node:fs/promises";
import connect from "../lib/index.js";

describe("connect", function () {
  it("initiate a new connection", async function () {
    let whoami = null;
    const conn = await connect({});
    conn.exec("whoami", (err, stream) => {
      stream
        .on("close", (code) => {
          code.should.eql(0);
          whoami.should.eql(os.userInfo().username);
          conn.end();
        })
        .on("data", (data) => {
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
      err.level.should.equalOneOf("client-authentication", "client-socket");
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

  describe("callback", function () {
    it("initiate a new connection", async function () {
      new Promise((resolve, reject) => {
        connect({}, (err, conn) => {
          if (err) return reject(err);
          conn.end();
          resolve();
        });
      });
    });

    it("initiate a failed connection", async function () {
      return new Promise((resolve, reject) => {
        connect(
          {
            host: "doesntexists",
            username: "iam",
            password: "invalid",
          },
          (err) => {
            if (!err) return reject(Error("Error not throw"));
            // MacOS ssh2@1.7.0
            // Object.keys(err).should.eql ['level']
            // But on GH actions with Ubuntu
            // Object.keys(err).should.eql ['errno', 'code', 'syscall', 'hostname', 'level']
            err.level.should.equalOneOf(
              "client-authentication",
              "client-socket",
            );
            resolve();
          },
        );
      });
    });
  });
});
