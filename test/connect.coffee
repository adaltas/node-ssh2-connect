
should = require 'should'
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
    
