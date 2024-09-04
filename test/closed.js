const connect = require("ssh2-connect");

describe("connect.closed", function () {
  it("with opened connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    connect.closed(conn).should.be.false();
    conn.end();
  });

  it("with closed connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    conn.on("close", () => connect.closed(conn).should.be.true());
    conn.end();
  });
});
