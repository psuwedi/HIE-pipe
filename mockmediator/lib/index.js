#!/usr/bin/env node
'use strict'

const express = require('express')
const medUtils = require('openhim-mediator-utils')
const winston = require('winston')
const needle = require('needle')

const utils = require('./utils')

// Logging setup
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {level: 'info', timestamp: true, colorize: true})

// Config
var config = {} // this will vary depending on whats set in openhim-core
const apiConf = process.env.NODE_ENV === 'test' ? require('../config/test') : require('../config/config')
const mediatorConfig = require('../config/mediator')

var port = process.env.NODE_ENV === 'test' ? 7001 : mediatorConfig.endpoints[0].port

/**
 * setupApp - configures the http server for this mediator
 *
 * @return {express.App}  the configured http server
 */
function setupApp () {
  const app = express()
  

  app.get('/encounters/:id', (req, res) => {

    //send and HTTP request to the Health Record service
    needle.get('http://localhost:3444/encounters/'+req.params.id, function(err, resp){

      winston.info(`Processing ${req.method} request on ${req.url}`)
      var responseBody = 'Primary Route Reached'
      var headers = { 'content-type': 'application/json' }
  
      // add logic to alter the request here
  
      // capture orchestration data
      var orchestrationResponse = { statusCode: 200, headers: headers }
      let orchestrations = []
      orchestrations.push(utils.buildOrchestration('Primary Route', new Date().getTime(), req.method, req.url, req.headers, req.body, orchestrationResponse, responseBody))
  
      // set content type header so that OpenHIM knows how to handle the response
      res.set('Content-Type', 'application/json+openhim')
  
      // construct return object
      var properties = { property: 'Primary Route' }
      res.send(utils.buildReturnObject(mediatorConfig.urn, 'Successful', 200, headers, responseBody, orchestrations, properties))

      if(err){

        console.log(err)
        return;
      }
      
      var ctxObject = {};
      ctxObject['encounter'] = resp.body;


      //capture 'encounter' orchestration data

      orchestrationResults = [];
      orchestrationResults.push({
        name: 'Get Encounter',
        request: {
          path: req.path,
          headers: req.headers,
          queryString: req.originalUrl.replace(req.path, ""),
          body: req.body,
          methos: req.method,
          timestamp: new Date().getTime()
        },
        response: {
          status: resp.statusCode,
          body: JSON.stringify(resp.body, null, 4),
          timestamp: new Date().getTime()
        }
      });

/* ###################################### */
/* ##### Construct Response Object  ##### */
/* ###################################### */



    })

    var urn = mediatorConfig.urn;
    var status = 'Successful';
    var response = {
      status: resp.statusCode,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(resp.body, null, 4),
      timestamp: new Date().getTime()
    };

  // Construct property data to be returned - this can be anything we want to make available in the core.

  var properties = {};
  properties[ctxObject.encounter.observations[0].obsType] = ctxObject.encounter.observations[0].obsValue + ctxObject.encounter.observations[0].obsUnit;
  properties[ctxObject.encounter.observations[1].obsType] = ctxObject.encounter.observations[1].obsValue + ctxObject.encounter.observations[1].obsUnit;
  properties[ctxObject.encounter.observations[2].obsType] = ctxObject.encounter.observations[2].obsValue + ctxObject.encounter.observations[2].obsUnit;
  properties[ctxObject.encounter.observations[3].obsType] = ctxObject.encounter.observations[3].obsValue + ctxObject.encounter.observations[3].obsUnit;
  properties[ctxObject.encounter.observations[4].obsType] = ctxObject.encounter.observations[4].obsValue + ctxObject.encounter.observations[4].obsUnit;
  properties[ctxObject.encounter.observations[5].obsType] = ctxObject.encounter.observations[5].obsValue + ctxObject.encounter.observations[5].obsUnit;



  // construct returnObject to be returned

  var returnObject = {
    'x-mediator-urn': urn,
    'status': status,
    'orchestrations':orchestrationResults,
    'response': response,
    'properties': properties
  };

  
 
  })
  return app
}

/**
 * start - starts the mediator
 *
 * @param  {Function} callback a node style callback that is called once the
 * server is started
 */
function start (callback) {
  if (apiConf.api.trustSelfSigned) { process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' }

  if (apiConf.register) {
    medUtils.registerMediator(apiConf.api, mediatorConfig, (err) => {
      if (err) {
        winston.error('Failed to register this mediator, check your config')
        winston.error(err.stack)
        process.exit(1)
      }
      apiConf.api.urn = mediatorConfig.urn
      medUtils.fetchConfig(apiConf.api, (err, newConfig) => {
        winston.info('Received initial config:')
        winston.info(JSON.stringify(newConfig))
        config = newConfig
        if (err) {
          winston.error('Failed to fetch initial config')
          winston.error(err.stack)
          process.exit(1)
        } else {
          winston.info('Successfully registered mediator!')
          let app = setupApp()
          const server = app.listen(port, () => {
            if (apiConf.heartbeat) {
              let configEmitter = medUtils.activateHeartbeat(apiConf.api)
              configEmitter.on('config', (newConfig) => {
                winston.info('Received updated config:')
                winston.info(JSON.stringify(newConfig))
                // set new config for mediator
                config = newConfig

                // we can act on the new config received from the OpenHIM here
                winston.info(config)
              })
            }
            callback(server)
          })
        }
      })
    })
  } else {
    // default to config from mediator registration
    config = mediatorConfig.config
    let app = setupApp()
    const server = app.listen(port, () => callback(server))
  }
}
exports.start = start

if (!module.parent) {
  // if this script is run directly, start the server
  start(() => winston.info(`Listening on ${port}...`))
}
