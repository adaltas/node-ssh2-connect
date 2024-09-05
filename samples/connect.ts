#!/usr/bin/env node --loader ts-node/esm

// import connect from "../src/index.js";
import connect from "ssh2-connect";

await connect({
  host: "localhost",
  username: process.env["USER"],
  private_key_path: process.env["HOME"] + "/.ssh/id_rsa",
}).then((ssh) => {
  ssh.exec("whoami", (err, stream) => {
    stream.on("data", (data: Buffer) => {
      process.stdout.write(data.toString());
    });
    stream.on("close", () => {
      ssh.end();
    });
  });
});
