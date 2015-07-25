//
//  lms-tcp-socket.js - TCP socket's implementation specifics for the LiveMediaStreamer framework
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

var net = require('net');

var lmsSocket = function(socket) {
    this._socket = socket;
    this._buffer = '';
    this._closed = false;
    socket.on('data', this._onData.bind(this));
    socket.on('close', this._onClose.bind(this));
    socket.on('err', this._onError.bind(this));
};
module.exports = lmsSocket;

lmsSocket.sendSingleMessage = function(port, host, message, callback) {
    callback = callback || function(){};
    var socket = new lmsSocket(new net.Socket());
    socket.connect(port, host);
    socket.on('error', function(err) {
        callback(err);
    });
    socket.on('connect', function() {
        socket.sendEndMessage(message, callback);
    });
};

lmsSocket.sendSingleMessageAndReceive = function(port, host, message, callback) {
    callback = callback || function(){};
    var socket = new lmsSocket(new net.Socket());
    socket.connect(port, host);
    socket.on('error', function(err) {
        callback(err);
    });
    socket.on('connect', function() {
        socket.sendMessage(message, function(err) {
            if (err) {
                socket.end();
                return callback(err);
            }
            socket.on('message', function(message) {
                socket.end();
                if (message.success === false) {
                    return callback(new Error(message.message));
                }
                callback(null, message)
            });
        });
    });
};

lmsSocket.prototype = {
    _onData: function(data) {
        data = data.toString();
        try {
            this._handleData(data);
        } catch (e) {
            this.sendError(e);
        }
    },
    _handleData: function(data) {
        this._buffer += data;
        console.log('Incoming response from LMS: '+this._buffer);
        this._handleMessage(this._buffer);
    },
    _handleMessage: function(data) {
        this._buffer = '';
        var message;
        try {
            message = JSON.parse(data);
        } catch (e) {
            var err = new Error('Could not parse JSON: '+e.message+'\nRequest data: '+data);
            err.code = 'E_INVALID_JSON';
            throw err;
        }
        message = message || {};
        this._socket.emit('message', message);
    },
    
    sendError: function(err) {
        this.sendMessage(this._formatError(err));
    },
    sendEndError: function(err) {
        this.sendEndMessage(this._formatError(err));
    },
    _formatError: function(err) {
        return {success: false, error: err.toString()};
    },

    sendMessage: function(message, callback) {
        if (this._closed) {
            if (callback) {
                callback(new Error('The socket is closed.'));
            }
            return;
        }
        this._socket.write(this._formatMessageData(message), 'utf-8', callback);
    },
    sendEndMessage: function(message, callback) {
        var that = this;
        this.sendMessage(message, function(err) {
            that.end();
            if (callback) {
                if (err) return callback(err);
                callback();
            }
        });
    },
    _formatMessageData: function(message) {
        var messageData = JSON.stringify(message);
        var data = messageData;
        return data;
    },

    _onClose: function() {
        this._closed = true;
    },
    _onError: function() {
        this._closed = true;
    },
    isClosed: function() {
        return this._closed;
    }
};

var delegates = [
    'connect',
    'on',
    'end'
];
delegates.forEach(function(method) {
    lmsSocket.prototype[method] = function() {
        this._socket[method].apply(this._socket, arguments);
    }
});
