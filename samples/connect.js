#!/usr/bin/env node

import connect from "ssh2-connect";

await connect({
  host: "localhost",
  username: process.env["USER"],
  private_key_path: process.env["HOME"] + "/.ssh/id_rsa",
}).then((ssh) => {
  ssh.exec("whoami", (err, stream) => {
    stream.on("data", (data) => {
      process.stdout.write(data.toString());
    });
    stream.on("close", () => {
      ssh.end();
    });
  });
});
