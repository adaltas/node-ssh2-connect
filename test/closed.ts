import "should";
import { connect, closed } from "../src/index.js";

describe("connect.closed", function () {
  it("with opened connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    closed(conn).should.be.false();
    conn.end();
  });

  it("with closed connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    conn.on("close", () => closed(conn).should.be.true());
    conn.end();
  });
});
