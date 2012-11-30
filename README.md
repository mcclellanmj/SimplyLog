SimplyLog
=====
- - -
SimplyLog is a project meant to bring flexible and controllable logging into javascript.
The primary goals are extensibility, simplicity, and compatibility.  Something that allows developers to quickly turn logging on and off as they are debugging a site, and even control
the amount of logging that gets output.  In addition to allowing a developer or a team 
to attach more information to the debugging.  And for teams allowing a standard logging style to be setup for their projects.

And lastly the syntax and API is intended to be as clear and easy to use as possible.

Usage
-----
Creating a new logger

	// Create a new console logger named example logger
	//   A console logger is a logger with the console appender already
	//   attached to it
	var log = SimplyLog.consoleLogger('exampleLogger');

	// Change the logging level from its default to TRACE level
	log.setLevel(SimplyLog.TRACE);

	// Send a message to the appender (which currently is a console appender)
	log.trace('hello there', '!');
	// The above line will result in the output exampleLogger:trace -> hello there!

	// Changes this log to only output error messages
	log.setLevel(SimplyLog.ERROR);

	// This line won't actually output anything because the log level is set above it
	log.debug('hello user');

Usage in Node
-------------
	// Add the logger
	var logger = require('simply-log');

	var myLog = logger.consoleLogger('myLog');
	myLog.setLevel(logger.TRACE);

Other Notes
-----------
SimplyLog keeps track of all loggers you create within it, this means you can reuse loggers in different parts of your app as long as SimplyLog is at the root.  For instance
	var logger = require('simply-log')

	logger.getLogger('stuffLogger').setLevel(logger.TRACE);

	var doStuff = function() {
		// Do some stuff
		var myLog = logger.consoleLogger('stuffLogger');
		myLog.info("Info World");
		myLog.trace("Trace World");
	}

	var adjustLogging = function(level) {
		// Adjust the logger used in the 'doStuff' function
		logger.getLogger('stuffLogger').setLevel(level);
	}

	doStuff();

	// Turn down logging to level of INFO, this will turn off the TRACE
	adjustLogging(logger.INFO)
	doStuff();

Output from the above code chunk is, trace is turned off for our second call
	stuffLogger:info -> Info World
	stuffLogger:trace -> Trace World
	stuffLogger:info -> Info World


API Crash Course
----------------
#### Logging a message
Messages are sent to the log appenders by calling the appropriate log level method.
The method to call is always the level you want to send in all lower case.
As of now the current levels are error, info, warn, debug, trace.
Any number of arguments can be passed to these methods
For instance the following is legal

	SimplyLog.error('Lorem', 'ipsom', $(window));

#### Logging levels
SimplyLog currently supports the following logging levels in order of highest level to lowest level, setting the level a level down will also send all log levels above it to the appender.

+ `SimplyLog.OFF` Highest level, will disable all output
+ `SimplyLog.ERROR` Intended for error level logging
+ `SimplyLog.INFO` General information level
+ `SimplyLog.WARN` Display api level warnings
+ `SimplyLog.DEBUG` Display debug level messages
+ `SimplyLog.TRACE` Trace level, most verbose level of logging

#### Default level
You can setup SimplyLog to automatically set the logging level for all logs built by it by calling
`SimplyLog.setDefaultLevel(SimplyLog.{level});`

Appenders
---------
Appenders are a way of allowing the log system to be extended, anything you can code can be called as an appender.  Any number of appenders can be added to a logger to allow  Tutorial and more complex appenders to come, to get started now take a look at the defaultConsoleAppender in `simply-log.js`.