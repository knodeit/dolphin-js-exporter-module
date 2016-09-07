/**
 * Created by Vadim on 2/12/16.
 */
'use strict';
var Dolphin = require('dolphin-core');

exports.variables = function (req, res) {
    Dolphin.resolveObjects(function (JsExporter, JsExporterConfigurationFactory) {
        var objects = JsExporterConfigurationFactory.getObjects();
        var output = [];
        for (var i in objects) {
            var row = JsExporter.serializeObjectToRow(objects[i]);
            output.push(row);
        }
        res.send(output.join(''));
    });
};