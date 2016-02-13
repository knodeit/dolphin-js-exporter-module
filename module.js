/**
 * Created by Vadim on 12/24/15.
 */
'use strict';
var Module = require('dolphin-core-modules').Module;
var JsExporter = new Module('JsExporter', __dirname);
var Q = require('q');
var fs = require('fs');
var controller = require('./controller');
var deferred = Q.defer();

JsExporter.variablesJsUrl = '/js/dolphin-variables.js';

JsExporter.serializeObject = function (obj) {
    return JSON.stringify(obj, function (key, value) {
        if (typeof value === 'function') {
            return value.toString();
        }
        return value;
    });
};

JsExporter.serializeObjectToRow = function (obj) {
    return '$dolphin.addObject(\'' + obj.name + '\', \'' + JsExporter.serializeObject(obj.obj) + '\');';
};

JsExporter.configureFactories(function (AssetManagerConfigurationFactory, WebServerConfigurationFactory) {
    WebServerConfigurationFactory.addPromise(deferred.promise);
    AssetManagerConfigurationFactory.addVendorScriptBefore(__dirname + '/dolphin.js');

    var app = WebServerConfigurationFactory.getApp();
    app.get(JsExporter.variablesJsUrl, controller.variables);
});

JsExporter.run(function (JsExporterConfigurationFactory, AssetManagerConfigurationFactory) {
    var promises = JsExporterConfigurationFactory.getPromises();
    Q.all(promises).then(function () {
        //exit
        deferred.resolve();
    });
});