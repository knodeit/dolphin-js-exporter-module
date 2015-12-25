### Installation
```npm install dolphin-js-exporter-module --save```

### JsExporterConfigurationFactory

methods:
* addPromise - the module will wait for your resolve then will execute own logic
* addObject(name, object) - adding object to page

After "addObject" you can get object viw `$dolphin.getObject('name')`