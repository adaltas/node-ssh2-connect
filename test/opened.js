import { connect, opened } from "../lib/index.js";

describe("connect.opened", function () {
  it("with opened connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    opened(conn).should.be.true();
    conn.end();
  });

  it("with closed connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    conn.on("close", () => opened(conn).should.be.false());
    conn.end();
  });
});
