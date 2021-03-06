//
//  lms-interface.js - Interface for API REST to TCP socekt's LiveMediaStreamer framework
//  Copyright (C) 2013  Fundació i2CAT, Internet i Innovació digital a Catalunya
//
//  This file is part of LMStoREST project.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//  Authors:  Gerard Castillo <gerard.castillo@i2cat.net>
// 

var lmsSocket   = require('./lms-tcp-socket.js');

// the LiveMediaStreamer middleware interface
var lmsInterface = function(host, port) {
    this._host = host;
    this._port = port;
};

module.exports = lmsInterface;

lmsInterface.prototype = {
// =============================================================================
// LMS PIPELINE MANAGEMENT METHODS
// =============================================================================
// GET STATE
// =============================================================================
    getState: function(callback) {
        callback = callback || function(){};
        var message = {"events":[{"action":"getState","params":{}}]};
        lmsSocket.sendSingleMessageAndReceive(this._port, this._host, 
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
    },
// =============================================================================
// DISCONNECT (AND STOP LMS)
// =============================================================================
    disconnect: function(callback) {
        callback = callback || function(){};
        var message = {"events":[{"action":"stop","params":{}}]};
        lmsSocket.sendSingleMessageAndReceive(this._port, this._host, 
            message, 
            function(err, message) {
                if (err) {
                    //Something went wrong
                    callback({ error: err });
                } else {
                    if(message.error != null){
                            callback({ error: +' Could not disconnect: '+ message.error});
                    } else {
                        callback({message: 'LiveMediaStreamer instance stopped and cleaned successfully'});
                    }
                }
            }
        );
    },
// =============================================================================
// CREATE FILTER
// =============================================================================
    createFilter: function(params, callback) {
        //TODO: check if input params exist
        callback = callback || function(){};
        var message = 
        { "events": [
                {
                    "action": 'createFilter',
                    "params": params
                } 
            ] 
        };
        lmsSocket.sendSingleMessageAndReceive(this._port, this._host, 
            message, 
            function(err, message) {
                if (err) {
                    //Something went wrong
                    callback({ error: err });
                } else {
                    if(message.error != null){
                            callback({ error: +' Filter was not created: '+ message.error });
                    } else {
                        callback({ message: 'New ' +params.type+ ' filter created with id ' + params.id});
                    }
                }
            }
        );
    },
// =============================================================================
// CREATE PATH
// =============================================================================
    createPath: function(params, callback) {
        //TODO: check if input params exist
        callback = callback || function(){};
        var message = 
        { "events": [
                {
                    "action": 'createPath',
                    "params": params
                } 
            ] 
        };
        lmsSocket.sendSingleMessageAndReceive(this._port, this._host, 
            message, 
            function(err, message) {
                if (err) {
                    //Something went wrong
                    callback({ error: err });
                } else {
                    if(message.error != null){
                            callback({ error:+ ' Path was not created: '+ message.error });
                    } else {
                        callback({ message: 'New path created'});
                    }
                }
            }
        );
    },

// =============================================================================
// LMS FILTERS MANAGEMENT METHODS
// =============================================================================
// CONFIGURE FILTER
// =============================================================================
    configureFilter: function(filter_id, params, callback) {
        //TODO: check if input params exist
        callback = callback || function(){};
        for(var i = 0; i < params.length; i++) {
            params[i].filterId = parseInt(filter_id);
        }
        var message = 
        { "events": params };

        lmsSocket.sendSingleMessageAndReceive(this._port, this._host, 
            message, 
            function(err, message) {
                if (err) {
                    //Something went wrong
                    callback({ error: err });
                } else {
                    if(message.error != null){
                            callback({ error: + ' Filter was not configured: '+ message.error });
                    } else {
                        callback({ message: 'Filter with '+filter_id+' configured!'});
                    }
                }
            }
        );
    },

// =============================================================================
// LMS PATH MANAGEMENT METHOD
// =============================================================================
// DELETE PATH
// =============================================================================
    deletePath: function(path_id, callback) {
        callback = callback || function(){};
        message = { "events": [
                {
                    "action": 'removePath',
                    "params": { "id" : parseInt(path_id) }
                } 
            ] 
        };

        lmsSocket.sendSingleMessageAndReceive(this._port, this._host, 
            message, 
            function(err, message) {
                if (err) {
                    //Something went wrong
                    callback({ error: err });
                } else {
                    if(message.error != null){
                            callback({ error: +' Path was not deleted: '+ message.error });
                    } else {
                        callback({ message: 'Path '+path_id+' successfully deleted'});
                    }
                }
            }
        );
    }

};
