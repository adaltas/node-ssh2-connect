
# Connect

This module provide a callback based api to open an ssh2 connection.

For example, the original ssh2 code...   

```coffee
ssh2 = require 'ssh2'
connection = new ssh2()
connection.on 'error', (err) ->
  connection.end()
  # not ready at all
connection.on 'ready', ->
  # ready to go
connection.connect options
```

...is simplified to:   

```coffee
connect = require 'ssh2-exec/lib/connect'
connect options, (err, ssh) ->
  # this is faster to write
```

    ssh2 = require 'ssh2'
    fs = require 'fs'

Options are inherited from the [ssh2 `Connection.prototype.connect`][connect]
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

    module.exports = (options, callback) ->
      return callback null, options if options instanceof ssh2
      options.username ?= process.env['USER']
      options.retry ?= 1
      if not options.password and not options.privateKey
        options.privateKeyPath ?= '~/.ssh/id_rsa'
        if options.privateKeyPath and match = /~(\/.*)/.exec options.privateKeyPath
          options.privateKeyPath = process.env.HOME + match[1]
      else
        options.privateKeyPath = null
      privateKeyPath = ->
        return connect() unless options.privateKeyPath
        fs.readFile options.privateKeyPath, 'ascii', (err, privateKey) ->
          options.privateKey = privateKey
          connect()
      retry = options.retry
      st = Date.now()
      connect = ->
        retry-- if retry isnt true and retry > 0
        connection = new ssh2()
        connection.on 'error', (err) ->
          connection.end()
          if retry is true or retry > 0
          then setTimeout connect, 2000
          else callback err
        connection.on 'ready', ->
          callback null, connection
        connection.connect options
      privateKeyPath()
