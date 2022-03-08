
{constants, promises: fs} = require('fs')
path = require('path')
{Client} = require 'ssh2'

module.exports = (options, callback) ->
  work = (resolve, reject) ->
    return resolve options if options instanceof Client
    options = camelize options
    options.username ?= process.env['USER'] or require('child_process').execSync("whoami", encoding: 'utf8', timeout: 1000).trim()
    options.username ?= 'root' # We've seed 'USER' not inside env inside the docker centos6 container.
    options.retry ?= 1
    options.wait ?= 500
    if not options.password and not options.privateKey
      options.privateKeyPath ?= true # Auto discovery
    else
      options.privateKeyPath = null
    # Extract private key from file
    try
      if typeof options.privateKeyPath is 'string'
        if match = /~(\/.*)/.exec options.privateKeyPath
          options.privateKeyPath = path.join process.env.HOME, match[1]
        options.privateKey = await fs.readFile options.privateKeyPath, 'ascii'
      else if options.privateKeyPath is true
        for algo in ['id_ed25519', 'id_rsa']
          source = path.resolve process.env.HOME, '.ssh', algo
          try
            options.privateKey = await fs.readFile source, 'ascii'
            break
          catch err then {}
        unless options.privateKey?
          throw Error 'Failed to discover an ssh private key inside `~/.ssh`.'
    catch e then return reject e
    # Connection attempts
    retry = options.retry
    connect = ->
      retry-- if retry isnt true and retry > 0
      succeed = false
      connection = new Client()
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
  unless callback
    new Promise work
  else
    work (conn) ->
      callback null, conn
    , (err) ->
      callback err

camelize = (obj) ->
  for k, v of obj
    newk = k.replace /[_.-](\w|$)/g, (_,x) -> x.toUpperCase()
    obj[newk] = v unless k is newk
  obj
