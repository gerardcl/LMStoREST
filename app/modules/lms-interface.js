var lmsSocket   = require('./lms-tcp-socket.js');

var lmsInterface = function(host, port) {
    this._host = host;
    this._port = port;
};
module.exports = lmsInterface;

// GET STATE
// =============================================================================
lmsInterface.getState = function(host, port, callback) {
    callback = callback || function(){};
    var message = {"events":[{"action":"getState","params":{}}]};
    lmsSocket.sendSingleMessageAndReceive(port, host, 
        message, 
        function(err, message) {
            if (err) {
                //Something went wrong
                callback({ error: err });
            } else {
                if(message.error != null){
                        callback({ error: +' Could not get state: '+ message.error});
                } else {
                    callback({message: message});
                }
            }
        }
    );
};

// CREATE FILTER or PATH
// =============================================================================
lmsInterface.createFilter = function(host, port, params, filter, callback) {
    callback = callback || function(){};
    //TODO: check if input params exist
    var message = 
    { "events": [
            {
                "action": 'createFilter',
                "params": {
                    "id": parseInt(params.id),
                    "type": params.type,
                    "role": params.role,
                    "sharedFrames": true
                }
            } 
        ] 
    };
    lmsSocket.sendSingleMessageAndReceive(port, host, 
        message, 
        function(err, message) {
            if (err) {
                //Something went wrong
                callback({ error: err });
            } else {
                if(message.error != null){
                        callback({ error: message.error + ' Filter was not created'});
                } else {
                    filter.id = params.id;
                    filter.type = params.type;
                    filter.role = params.role;
                    filter.sharedFrames = true;
                    filter.save(function(err) {
                        if (err){
                            //TODO: maybe better destroy filter at LMS side?
                            callback({ error: 'DB error!!! but ' +filter.type+ ' filter created with id ' + filter.id+'! Expect troubles...' });
                        }
                    });
                    callback({ message: 'New ' +filter.type+ ' filter created with id ' + filter.id});
                }
            }
        }
    );
};

lmsInterface.createPath = function(port, host, message, callback) {
    callback = callback || function(){};

};


lmsInterface.createPipe = function(port, host, message, callback) {
    callback = callback || function(){};

};

// CONFIGURE FILTERS ()
// =============================================================================
