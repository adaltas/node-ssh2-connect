
connect = require '../src'

describe 'connect.closed', ->
  
  it 'with opened connection', ->
    conn = await connect
      host: '127.0.0.1'
      privateKeyPath: '~/.ssh/id_ed25519'
    connect.closed(conn).should.be.false()
    conn.end()
      
  it 'with closed connection', ->
    conn = await connect
      host: '127.0.0.1'
      privateKeyPath: '~/.ssh/id_ed25519'
    conn.on 'close', ->
      connect.closed(conn).should.be.true()
    conn.end()
  
