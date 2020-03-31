
fs = require('fs').promises
connect = require '../src'

describe 'connect', ->

  it 'initiate a new connection', ->
    conn = await connect {}
    conn.end()

  it 'initiate a failed connection', ->
    connect
      host: 'doesntexists'
      username: 'iam'
      password: 'invalid'
    .catch (err) ->
      err.code.should.eql 'ENOTFOUND'

  it 'option `privateKey` as a buffer', ->
    pk = await fs.readFile "#{process.env.HOME}/.ssh/id_rsa"
    conn = await connect
      host: '127.0.0.1'
      privateKey: pk
    conn.end()

  it 'option `privateKeyPath`', ->
    opts = host: '127.0.0.1', privateKeyPath: '~/.ssh/id_rsa'
    conn = await connect opts
    conn.end()

  it 'options are camelized', ->
    opts = host: '127.0.0.1', private_key_path: '~/.ssh/id_rsa'
    conn = await connect opts
    conn.end()
