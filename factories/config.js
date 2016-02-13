/**
 * Created by Vadim on 12/14/15.
 */
'use strict';
var objects = {};
var promises = [];

module.exports = {
    name: 'Configuration',
    entity: {
        addPromise: function (promise) {
            promises.push(promise);
        },
        getPromises: function () {
            return promises;
        },
        addObject: function (name, obj) {
            if (objects[name]) {
                throw new Error('Object already registered:' + name);
            }

            objects[name] = {
                name: name,
                obj: obj
            };
        },
        deleteObject: function (name) {
            delete objects[name];
        },
        getObjects: function () {
            return objects;
        }
    }
};