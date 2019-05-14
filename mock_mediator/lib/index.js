#!/usr/bin/env node
'use strict'

const express = require('express')
const medUtils = require('openhim-mediator-utils')
const winston = require('winston')
const needle = require("needle")
const utils = require('./utils')
const cors = require('cors')

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

  app.use(cors());
  app.all('encounters/:id', (req, res) => {

    //send an HTTP request to the health record service
    needle.get('http://localhost:3444/encounters/'+req.params.id, function(err, resp) {

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

    //handle errors

if (err){
  console.log(err)
  return;
}

    

/* ######################################### */
/* ##### Create Initial Orchestration  ##### */
/* ######################################### */

// context object to store json objects
var ctxObject = {};
ctxObject['encounter'] = resp.body;

//Capture 'encounter' orchestration data 

orchestrationsResults = [];
orchestrationsResults.push({
  name: 'Get Encounter',
  request: {
    path : req.path,
    headers: req.headers,
    querystring: req.originalUrl.replace( req.path, "" ),
    body: req.body,
    method: req.method,
    timestamp: new Date().getTime()
  },
  response: {
    status: resp.statusCode,
    body: JSON.stringify(resp.body, null, 4),
    timestamp: new Date().getTime()
  }
});


/* ############################ */
/* ##### HTML conversion  ##### */
/* ############################ */
 
/* ##### Construct Encounter HTML  ##### */
// first loop through all observations and build HTML rows
var observationsHtml = '';
for (i = 0; i < ctxObject.encounter.observations.length; i++) { 
  observationsHtml += '    <tr>' + "\n" +
  '      <td>'+ctxObject.encounter.observations[i].obsType+'</td>' + "\n" +
  '      <td>'+ctxObject.encounter.observations[i].obsValue+'</td>' + "\n" +
  '      <td>'+ctxObject.encounter.observations[i].obsUnit+'</td>' + "\n" +
  '    </tr>' + "\n";
}
 
// setup the encounter HTML
var healthRecordHtml = '  <h3>Patient ID: #'+ctxObject.encounter.patientId+'</h3>' + "\n" +
'  <h3>Provider ID: #'+ctxObject.encounter.providerId+'</h3>' + "\n" +
'  <h3>Encounter Type: '+ctxObject.encounter.encounterType+'</h3>' + "\n" +
'  <h3>Encounter Date: '+ctxObject.encounter.encounterDate+'</h3>' + "\n" +
'  <table cellpadding="10" border="1" style="border: 1px solid #000; border-collapse: collapse">' + "\n" +
'    <tr>' + "\n" +
'      <td>Type:</td>' + "\n" +
'      <td>Value:</td>' + "\n" +
'      <td>Unit:</td>' + "\n" +
'    </tr>' + "\n" +
observationsHtml + 
'  </table>' + "\n";
 
// setup the main response body
var responseBodyHtml = '<html>' + "\n" +
'<body>' + "\n" +
'  <h1>Health Record</h1>' + "\n" +
healthRecordHtml +
'</body>' + "\n" +
'</html>';


/* ###################################### */
/* ##### Construct Response Object  ##### */
/* ###################################### */

})

var urn = mediatorConfig.urn;
var status = 'Successful';
var response = {
  status: resp.statusCode,
  headers: {
    'content-type': 'text/html'
  },
  body: responseBodyHtml,
  timestamp: new Date().getTime()
};

// construct property data to be returned - this can be anything interesting that you want to make available in core, or nothing at all
var properties = {};
properties[ctxObject.encounter.observations[0].obsType] = ctxObject.encounter.observations[0].obsValue + ctxObject.encounter.observations[0].obsUnit;
properties[ctxObject.encounter.observations[1].obsType] = ctxObject.encounter.observations[1].obsValue + ctxObject.encounter.observations[1].obsUnit;
properties[ctxObject.encounter.observations[2].obsType] = ctxObject.encounter.observations[2].obsValue + ctxObject.encounter.observations[2].obsUnit;
properties[ctxObject.encounter.observations[3].obsType] = ctxObject.encounter.observations[3].obsValue + ctxObject.encounter.observations[3].obsUnit;
properties[ctxObject.encounter.observations[4].obsType] = ctxObject.encounter.observations[4].obsValue + ctxObject.encounter.observations[4].obsUnit;
properties[ctxObject.encounter.observations[5].obsType] = ctxObject.encounter.observations[5].obsValue + ctxObject.encounter.observations[5].obsUnit;

// construct returnObject to be returned
var returnObject = {
  "x-mediator-urn": urn,
  "status": status,
  "response": response,
  "orchestrations": orchestrationsResults,
  "properties": properties
}


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





