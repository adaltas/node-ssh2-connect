
fs = require 'fs'
connect = require '../src'

describe 'connect', ->

  it 'initiate a new connection', (next) ->
    connect {}, (err, ssh) ->
      return next err if err
      ssh.end()
      ssh.on 'end', ->
        next()

  it 'initiate a failed connection', (next) ->
    connect {host: 'doesntexists', username: 'iam', password: 'invalid'}, (err, ssh) ->
      err.code.should.eql 'ENOTFOUND'
      next()

  it 'initiate from buffer private key', (next) ->
    fs.readFile "#{process.env.HOME}/.ssh/id_rsa", (err, pk) ->
      connect host: '127.0.0.1', privateKey: pk, (err, ssh) ->
        return next err if err
        ssh.end()
        ssh.on 'end', ->
          next()

  it 'camelize properties', (next) ->
    opts = host: '127.0.0.1', private_key_path: '~/.ssh/id_rsa'
    connect opts, (err, ssh) ->
      opts.privateKeyPath.should.exists
      return next err if err
      ssh.end()
      ssh.on 'end', ->
        next()
