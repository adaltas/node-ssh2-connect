
fs = require('fs').promises
connect = require '../src'

describe 'connect.is', ->
  
  it 'valid', ->
    conn = await connect
      host: '127.0.0.1'
      privateKeyPath: '~/.ssh/id_ed25519'
    connect.is(conn).should.be.true()
    conn.end()
  
  it 'invalid null', ->
    conn = await connect
      host: '127.0.0.1'
      privateKeyPath: '~/.ssh/id_ed25519'
    connect.is(null).should.be.false()
    conn.end()
