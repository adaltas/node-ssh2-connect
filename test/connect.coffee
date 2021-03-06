
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
    conn = await connect
      host: '127.0.0.1'
      privateKeyPath: '~/.ssh/id_rsa'
    conn.end()

  it 'option `privateKeyPath` with missing file', ->
    connect
      host: '127.0.0.1'
      privateKeyPath: './doesntexists'
    .should.be.rejectedWith "ENOENT: no such file or directory, open './doesntexists'"

  it 'options are camelized', ->
    conn = await connect
      host: '127.0.0.1'
      private_key_path: '~/.ssh/id_rsa'
    conn.end()
    
  describe 'callback', ->

    it 'initiate a new connection', ->
      new Promise (resolve, reject) ->
        connect {}, (err, conn) ->
          return reject err if err
          conn.end()
          resolve()

    it 'initiate a failed connection', ->
      new Promise (resolve, reject) ->
        connect
          host: 'doesntexists'
          username: 'iam'
          password: 'invalid'
        , (err) ->
          return reject Error 'Error not throw' unless err
          err.code.should.eql 'ENOTFOUND'
          resolve()
        
