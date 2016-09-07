/**
 * Created by Vadim on 12/24/15.
 */
'use strict';
var isCronMode = require('dolphin-core').isCronMode();
var Module = require('dolphin-core-modules').Module;
var JsExporter = new Module('JsExporter', __dirname);
var Q = require('q');
var fs = require('fs');
//var controller = require('./controller');
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

//don't run is cron mode
if (isCronMode) {
    return;
}

JsExporter.configureFactories(function (AssetManagerConfigurationFactory, WebServerConfigurationFactory) {
    AssetManagerConfigurationFactory.addVendorScriptBefore(__dirname + '/dolphin.js');
    AssetManagerConfigurationFactory.addPromise(deferred.promise);
});

JsExporter.run(function (JsExporterConfigurationFactory, AssetManagerConfigurationFactory) {
    var promises = JsExporterConfigurationFactory.getPromises();
    Q.all(promises).then(function () {
        //write to file
        var objects = JsExporterConfigurationFactory.getObjects();
        var output = [];
        for (var i in objects) {
            var row = JsExporter.serializeObjectToRow(objects[i]);
            output.push(row);
        }
        fs.writeFileSync(__dirname + '/dolphin-variables.js', output.join(''), 'utf-8');

        AssetManagerConfigurationFactory.addVendorScript(__dirname + '/dolphin-variables.js');
        //exit
        deferred.resolve();
    });
});