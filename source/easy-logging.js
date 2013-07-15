//  easy-logging.js 0.1.0

/*  (c) 2013 Leroy Baeyens
 *  @license: easy-logging may be distributed under the GPL license
 */

(function (factory) {
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
} else {
    // Browser globals
    factory(jQuery);
}
}(function ($) {
    var loggerModel = Backbone.Model.extend({
        defaults: {
            message	: 'content of the log',
            date	: ''
	},
	initialize: function(data){
            _.extend(this, data);
	},
	url: function(){
            return this.saveToUrl;
	},
	reformatDate: function(dateformat){
            this.set('date', this.formatDate(new Date(), dateformat, true, true));
	},
	formatDate: function(date, format, leadingDate, leadingTime){
            // Calculate date parts and replace instances in format string accordingly
            leadingDate = (typeof leadingDate == "undefined" ? false : leadingDate);
            leadingTime = (typeof leadingTime == "undefined" ? false : leadingTime);
            format = format.replace("DD", (leadingDate ? (date.getDate() < 10 ? "0" : "") : "") + date.getDate()); // Pad with '0' if needed
            format = format.replace("MM", (leadingDate ? (date.getMonth() < 9 ? "0" : "") : "") + (date.getMonth() + 1)); // Months are zero-based
            format = format.replace("YYYY", date.getFullYear());
            format = format.replace("HH", (leadingTime ? (date.getHours() < 9 ? "0" : "") : "") + date.getHours());
            format = format.replace("II", (leadingTime ? (date.getMinutes() < 9 ? "0" : "") : "") + date.getMinutes());
            format = format.replace("SS", (leadingTime ? (date.getSeconds() < 9 ? "0" : "") : "") + date.getSeconds());
            return format;
	}
    });

    window.easyLogger = Backbone.View.extend({
        // options
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
        // no more options
        el: document,
        prevLogs: [],
        model: {},
        events:{
            'click' : 'logEvent'
        },
        initialize: function(data){
            _.extend(this,data);
        },
        setMessage: function(data, clear){
            clear = (typeof clear == "undefined" ? false : clear);
            var message = '';
            if(!clear && typeof this.prefix != "undefined" && this.prefix.length > 0){
                message += this.prefix.trim() + " ";
            }
            message += data;
            if(!clear && typeof this.suffix != "undefined" && this.suffix.length > 0){
                message += " " + this.suffix.trim();
            }
            this.model.set('message', message);
            return this;
        },
        logEvent: function(e){
            e.preventDefault();
            var target = $(e.target);
            if(typeof target.data(this.selector) != "undefined"){
                this.newModel().setMessage(target.data(this.selector));
                this.model.reformatDate(this.dateformat);
                this.saveLog();
            }
        },
        // use this if you want to start the log with custom data
        log: function(data, clear){
            this.newModel().setMessage(data.message, clear);
            this.model.reformatDate(this.dateformat);
            delete data.message;
            if(!_.isEmpty(data)){
                if(typeof this.groupRest == "string"){
                    // group the remaining items in an object
                    this.model.set(this.groupRest, data);
                }else if(typeof this.groupRest == "boolean"){
                    if(this.groupRest == true){
                        // true cannot be used, if need to group anything, use a string
                        console.log("if you want to group the remaining items, please use a string");
                    }else{
                        // do not group anything but loop through remaining items and add them
                        var self = this;
                        _.each(data, function(value, key){
                            self.model.set(key, value);
                        });
                    }
                }
            }
            this.saveLog();
        },
        newModel: function(){
            this.model = new loggerModel(this.defaults),
            this.model.saveToUrl = this.url;
            return this;
        },
        addLog: function(log){
            var remember = (typeof this.remember == "number" ? this.remember : 2);
            if(this.prevLogs.length == remember){
                this.prevLogs.shift();
            }
            this.prevLogs.push(log);
        },
        saveLog: function(){
            this.addLog(this.model.toJSON());
            if(typeof this.enabled == "boolean" && this.enabled == true){
                if(typeof this.console == "boolean" && this.console == true){
                    console.log(this.model.toJSON());
                }
                if(typeof this.upload == "boolean" && this.upload == true){
                    this.model.save();
                }
            }
        }
    });
}));	