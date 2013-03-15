/**
 * Copyright(c) 2012 Matt McClellan
 * Licensed under GPL license
 */

/**
 * @version v0.2.0
 * Api is likely to change
 * @author MATT MCCLELLAN
 * @beta
 * 
 * This is a simple wrapper around console.log that allows you to control level
 * The functions available to this are 
 * 
 * SimplyLog.createLogger(name, level)
 *   --example var log = SimplyLog.createLogger('SimplyLog', SimplyLog.TRACE)
 *
 * the SimplyLog level properties should always be used to prevent clashing with refactors.	
 * The hierarchy of the loggers are listed below with
 * SimplyLog.OFF -- turns off all logging
 * SimplyLog.ERROR -- Error level logging, highest level, always outputs unless off
 * SimplyLog.INFO -- Info level logging, highest level
 * SimplyLog.WARN -- Warnings
 * SimplyLog.DEBUG -- Debug level
 * SimplyLog.TRACE -- Ultra verbose trace logging
 *
 * Once you have a logger the following functions can be called
 * log.info(msg)
 * log.debug(msg)
 * log.error(msg)
 * log.trace(msg)
 * @return SimplyLog object
 * 
 */
(function ( global ) {
    "use strict";
	var loggers = {};
	var publicFns = {};
	var defaultAppenders = [];

	// OFF is just a really low setting
	publicFns.OFF = Number.MIN_VALUE;

	var types = {
		'error' : 1,
		'info' : 2,
		'warn' : 3,
		'debug' : 4,
		'trace' : 5
	};

	/**
	 * Logger object contains methods to be used for logging such as 
	 * info, error, etc.  As well as a method to change logging, setLogLevel
	 * @param  String name  name of logger to create
	 * @param  Integer level level of logging
	 * @return functions to interact with the log
	 */
	var Logger = (function() {
		function Logger(name, level) {
			this.name = name;
			this.level = level;
			this.appenders = [];

            for (var appender in defaultAppenders) {
                if (defaultAppenders.hasOwnProperty(appender)) {
                    this.appenders.push(defaultAppenders[appender]);
                }
            }
		}

		Logger.prototype.logMsg = function(args, levelName) {
			var arrayArgs = Array.prototype.slice.call(args);

            for (var appender in this.appenders) {
                if (this.appenders.hasOwnProperty(appender)) {
                    this.appenders[appender].call(this, this.name, levelName, arrayArgs);
                }
            }
		};

        Logger.prototype.isLogged = function(level) {
            return (level > 0 && level <= this.logLevel);
        };

		Logger.prototype.setLevel = function(level) {
			this.logLevel = level;
		};

		Logger.prototype.addAppender = function(appenderFn) {
            for (var key in this.appenders) {
                if (this.appenders.hasOwnProperty(key)) {
                    if (this.appenders[key] === appenderFn) { return; }
                }
            }
			this.appenders.push(appenderFn);
        };


		for(var name in types) {
            if (types.hasOwnProperty(name)) {
                //noinspection JSHint
                Logger.prototype[name] = (function(typeName, funcLevel) {
                  return function() {
					if(this.level <= funcLevel) {
						this.logMsg(arguments, typeName);
					}
                  };
                })(name, types[name]);
            }
		}

		return Logger;
	})();

	/** 
	 * Creates a logger that has no appenders, appenders can be attached
	 * using the addAppender method on the returned object
	 * @param {String} name name of the logger
	 * @param {Integer} level the level of logging active on this logger
	 * @since v0.1
	 * 
	 */
	publicFns.getLogger = function(name) {
		if(loggers[name] !== undefined) {
			return loggers[name];
		}

		loggers[name] = new Logger(name, defaultLevel);
		return loggers[name];
	};

	/**
	 * Creates a console logger, this may have more appenders than just console but it is
	 * guaranteed to have at least a default console logger
	 * @param  String name  name of the logger to create
	 * @param  Integer level initial logging level
	 * @return Logger       log object @see logger
	 * @since v0.1
	 */
	publicFns.consoleLogger = function(name) {
		if(loggers[name] !== undefined && loggers[name] !== null) {
			loggers[name].addAppender(publicFns.defaultConsoleAppender);
			return loggers[name];
		}

		var newLog = new Logger(name, defaultLevel);
		newLog.addAppender(publicFns.defaultConsoleAppender);
		loggers[name] = newLog;
		return newLog;
	};

	/**
	 * The default console appender, this formats a message as
	 * {{log.name}}:{{log.level}} -> {{arguments}}
	 * @param  {String} name  the name of log sending the message
	 * @param  {String} level the name of the level
	 * @param  {Array} args  the arguments passed by the user
	 */
	publicFns.defaultConsoleAppender = function(name, level, args) {
		if(console) {
			args.unshift(name + ':' + level + ' ->');
			Function.prototype.apply.call(console.log, console, args);
		}
	};

	/**
	 * Adds another default appender that will be added to all new loggers
	 * @param {Function} The appender to add
	 * @since 0.2.4
	 */
	publicFns.addDefaultAppender = function(appender) {
		defaultAppenders.push(appender);
		return publicFns;
	};

	/**
	 * Sets the default level for all logs built from this, these can be overridden manually
	 * @param {Integer} level Level to set logging at
	 */
	publicFns.setDefaultLevel = function(level) {
		defaultLevel = level;
		return publicFns;
	};

	for(var propName in types) {
        if (types.hasOwnProperty(propName)) {
            publicFns[propName.toUpperCase()] = types[propName];
        }
    }
    var defaultLevel = types.info;

    global.SimplyLog = publicFns;

}( typeof exports === 'undefined' ? window : exports ));
