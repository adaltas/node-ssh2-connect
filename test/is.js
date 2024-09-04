import { connect, is } from "../lib/index.js";

describe("connect.is", function () {
  it("valid", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    is(conn).should.be.true();
    conn.end();
  });

  it("invalid null", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    is(null).should.be.false();
    conn.end();
  });
});
