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
                        callback({message: message});
                    }
                }
            }
        );
    },
// CREATE FILTER
// =============================================================================
    createFilter: function(params, callback) {
        callback = callback || function(){};
        //TODO: check if input params exist
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
                            callback({ error: message.error + ' Filter was not created'});
                    } else {
                        callback({ message: 'New ' +params.type+ ' filter created with id ' + params.id});
                    }
                }
            }
        );
    },
// CREATE PATH
// =============================================================================
    createFilter: function(params, callback) {
        callback = callback || function(){};
        //TODO: check if input params exist
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
                            callback({ error: message.error + ' Filter was not created'});
                    } else {
                        callback({ message: 'New ' +params.type+ ' filter created with id ' + params.id});
                    }
                }
            }
        );
    }
// =============================================================================
// LMS FILTERS MANAGEMENT METHODS
// =============================================================================

};
