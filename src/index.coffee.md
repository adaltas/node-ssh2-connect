
# Connect

This module provide a promise based api to open an ssh2 connection.

For example, the original ssh2 code...   

```js
const ssh2 = require('ssh2')
const connection = new ssh2()
connection.on('error', (err) => {
  // not ready at all
  connection.end()
})
connection.on('ready', () => {
  // ready to go
})
connection.connect(options)
```

...is now simplified to:   

```js
const connect = require('ssh2-exec')
const ssh = await connect(options, (err, ssh) ->
  // this is more comprehensive
)
```

    fs = require('fs').promises
    ssh2 = require 'ssh2'

Options are inherited from the [ssh2 `Connection.prototype.connect`][ssh2-connect]
function with a few additions:

-   `username`   
    The username used to initiate the connection, default to the current
    environment user.
-   `privateKeyPath`   
    Path to the file containing the private key.   
-   `retry`
    Attempt to reconnect multiple times, default to "1".   
-   `wait`
    Time to wait in milliseconds between each retry, default to "500".     

Note, the "privateKeyPath" option is provided as a conveniency to  prepare the 
"privateKey" property.

Additionally, all options may be provided in camalize (the default in [ssh2]) or
underscore form. For example, both "privateKey" and "private_key" would be
interprated the same.

    module.exports = (options) ->
      new Promise (resolve, reject) ->
        return resolve options if options instanceof ssh2
        options = camelize options
        options.username ?= process.env['USER'] or require('child_process').execSync("whoami", encoding: 'utf8', timeout: 1000).trim()
        options.username ?= 'root' # We've seed 'USER' not inside env inside the docker centos6 container.
        options.retry ?= 1
        options.wait ?= 500
        if not options.password and not options.privateKey
          options.privateKeyPath ?= '~/.ssh/id_rsa'
          if options.privateKeyPath and match = /~(\/.*)/.exec options.privateKeyPath
            options.privateKeyPath = process.env.HOME + match[1]
        else
          options.privateKeyPath = null
        # Extract private key from file
        try if options.privateKeyPath
          options.privateKey = await fs.readFile options.privateKeyPath, 'ascii'
        catch e then return reject e
        # Connection attempts
        retry = options.retry
        connect = ->
          retry-- if retry isnt true and retry > 0
          succeed = false
          connection = new ssh2()
          connection.on 'error', (err) ->
            connection.end()
            # Event "error" is thrown after a "ready" if the connection is lost
            return if succeed
            if retry is true or retry > 0
            then setTimeout connect, options.wait
            else reject err
          connection.on 'ready', ->
            succeed = true
            resolve connection
          connection.connect options
        connect()

    camelize = (obj) ->
      for k, v of obj
        newk = k.replace /[_.-](\w|$)/g, (_,x) -> x.toUpperCase()
        obj[newk] = v unless k is newk
      obj

[ssh2]: https://github.com/mscdex/ssh2
[ssh2-connect]: https://github.com/wdavidw/node-ssh2-connect
