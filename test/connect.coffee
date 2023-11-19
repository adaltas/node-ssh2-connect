
os = require 'os'
fs = require('fs').promises
connect = require '../lib'

describe 'connect', ->

  it 'initiate a new connection', ->
    whoami = null
    conn = await connect {}
    conn.exec 'whoami', (err, stream) ->
      stream
      .on 'close', (code, signal) ->
        code.should.eql 0
        whoami.should.eql os.userInfo().username
        conn.end()
      .on 'data', (data) ->
        whoami = data.toString().trim()

  it 'initiate a failed connection', ->
    try
      await connect
        host: 'doesntexists'
        username: 'iam'
        password: 'invalid'
      throw Error 'Unexpected error'
    catch err
      # MacOS ssh2@1.7.0
      # Object.keys(err).should.eql ['level']
      # But on GH actions with Ubuntu
      # Object.keys(err).should.eql ['errno', 'code', 'syscall', 'hostname', 'level']
      err.level.should.equalOneOf 'client-authentication', 'client-socket'

  it 'option `privateKey` as a buffer', ->
    pk = await fs.readFile "#{process.env.HOME}/.ssh/id_ed25519"
    conn = await connect
      host: '127.0.0.1'
      privateKey: pk
    conn.end()

  it 'option `privateKeyPath`', ->
    conn = await connect
      host: '127.0.0.1'
      privateKeyPath: '~/.ssh/id_ed25519'
    conn.end()

  it 'option `privateKeyPath` with missing file', ->
    connect
      host: '127.0.0.1'
      privateKeyPath: './doesntexists'
    .should.be.rejectedWith "ENOENT: no such file or directory, open './doesntexists'"

  it 'options are camelized', ->
    conn = await connect
      host: '127.0.0.1'
      private_key_path: '~/.ssh/id_ed25519'
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
          # MacOS ssh2@1.7.0
          # Object.keys(err).should.eql ['level']
          # But on GH actions with Ubuntu
          # Object.keys(err).should.eql ['errno', 'code', 'syscall', 'hostname', 'level']
          err.level.should.equalOneOf 'client-authentication', 'client-socket'
          resolve()
        
