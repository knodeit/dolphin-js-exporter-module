/**
 * Created by Vadim on 12/24/15.
 */
'use strict';
/* jshint ignore:start */
var $dolphin = new function () {
    this._register = {};

    function unserializeObject(obj) {
        return JSON.parse(obj, function (key, value) {
            if (typeof value == 'string' && value.indexOf('function') > -1) {
                value = eval('(' + value + ')');
            }
            return value;
        });
    }

    this.addObject = function (name, object) {
        this._register[name] = unserializeObject(object);
    };

    this.getObject = function (name) {
        return this._register[name];
    };

    this.getObjects = function () {
        return this._register;
    };
};
/* jshint ignore:end */