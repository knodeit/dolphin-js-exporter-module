/**
 * Created by Vadim on 12/24/15.
 */
'use strict';
var Module = require('dolphin-core-modules').Module;
var JsExporter = new Module('JsExporter', __dirname);
var Q = require('q');
var fs = require('fs');
var deferred = Q.defer();

JsExporter.configureFactories(function (AssetManagerConfigurationFactory) {
    AssetManagerConfigurationFactory.addPromise(deferred.promise);
    AssetManagerConfigurationFactory.addVendorScriptBefore(__dirname + '/dolphin.js');
});

JsExporter.run(function (JsExporterConfigurationFactory, AssetManagerConfigurationFactory) {
    function serializeObject(obj) {
        return JSON.stringify(obj, function (key, value) {
            if (typeof value === 'function') {
                return value.toString();
            }
            return value;
        });
    }

    var promises = JsExporterConfigurationFactory.getPromises();
    Q.all(promises).then(function () {
        var objects = JsExporterConfigurationFactory.getObjects();
        var output = [];
        for (var i in objects) {
            var row = '$dolphin.addObject(\'' + objects[i].name + '\', \'' + serializeObject(objects[i].obj) + '\');';
            output.push(row);
        }

        if (output.length > 0) {
            var file = __dirname + '/dolphin-output.js';
            fs.writeFileSync(file, output.join(''), 'utf-8');
            AssetManagerConfigurationFactory.addVendorScript(file);
        }

        //exit
        deferred.resolve();
    });
});