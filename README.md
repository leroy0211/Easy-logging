# Easy-logging


Log whatever you want in your JavaScript application to the console or to an url.

When logging to an url your backend could store it in a database, a file or anything you like.
To have some management over your logs, you could write the log backend in [Fluentd](http://fluentd.org/) to collect your logs.

## Dependencies

* jQuery
* Backbone.js 
* Underscore.js

The plugin should be AMD to work with [require.js](http://requirejs.org/), but this has never been tested yet.

## Usage

To use the plugin without any options add this in your `<head></head>`
```javascript
var easylogger = new easyLogger();
```

To use the plugin with custom options add this in your `<head></head>`
```javascript
var easylogger = new easyLogger({
    upload: false, 
    console: true
});
```

## Options

* `enabled`     - `true|false`    - enable or disable the plugin
* `console`     - `true|false`    - output the log to the console
* `upload`      - `true|false`    - output the log to an url
* `prefix`      - `string`        - prefix of the log message
* `suffix`      - `string`        - suffix of the log message
* `url`         - `string`        - the url to store the log (only works if `upload` is set to true)
* `selector`    - `string`        - listen to which data element
* `groupRest`   - `string|false`  - group the remaining items in an object or add them to the base object
* `remember`    - `number`        - remember the last x logs in the DOM
* `dateformat`  - `string`        - format the date of the log
* `defaults`    - `object`        - set some default values in the log

### Default options

```javascript
{
    enabled: true,
    console: false,
    upload: true,
    prefix: "",
    suffix: "",
    url: 'api/log',
    selector: 'log',
    groupRest: 'custom',
    remember: 5,
    dateformat: "YYYY-MM-DD HH:II:SS",
    defaults: {},
}
```

## Methods

Some methods you can use in this logger plugin

### create custom log
When you want to log something else than DOM elements with the `data-log` attribute use:
```javascript
var easylogger = new easyLogger(options);
easylogger.log({message: "your message here"});
```

### get latest logs
If you want to get the latest logs in your DOM use:
```javascript
var easylogger = new easyLogger(options);
console.log(easylogger.prevLogs);
```

