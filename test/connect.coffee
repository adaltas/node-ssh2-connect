
should = require 'should'
connect = require '../src'

describe 'connect', ->

  it 'initiate a new connection', (next) ->
    connect localhost: true, (err, ssh) ->
      return next err if err
      ssh.end()
      ssh.on 'end', ->
        next()
    
