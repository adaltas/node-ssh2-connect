import "should";
import { connect, close, closed } from "../src/index.js";

describe("connect.close", function () {
  it("opened connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    await close(conn).should.finally.eql(true);
    closed(conn).should.be.true();
  });
  it("closed connection", async function () {
    const conn = await connect({
      host: "127.0.0.1",
      privateKeyPath: "~/.ssh/id_ed25519",
    });
    await close(conn);
    await close(conn).should.finally.eql(false);
    closed(conn).should.be.true();
  });
});
