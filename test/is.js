const connect = require("ssh2-connect");

describe("connect.is", function () {
  it("valid", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    connect.is(conn).should.be.true();
    conn.end();
  });

  it("invalid null", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    connect.is(null).should.be.false();
    conn.end();
  });
});
