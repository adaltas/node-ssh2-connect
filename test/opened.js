const connect = require("ssh2-connect");

describe("connect.opened", function () {
  it("with opened connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    connect.opened(conn).should.be.true();
    conn.end();
  });

  it("with closed connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    conn.on("close", () => connect.opened(conn).should.be.false());
    conn.end();
  });
});
