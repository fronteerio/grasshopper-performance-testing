/**
 * Copyright (c) 2014 "Fronteer LTD"
 * Grasshopper Event Engine
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var _ = require('lodash');
var general = require('./general.js');

var Event = require('./event.model.js').Event;

exports.Series = function() {
    var that = {};
    that.displayName = general.generateSentence(1);
    that.model_id = general.generateId(that.displayName.split(' '));
    that.type = 'series';

    // A series has on average 8 events
    that.children = [];
    that.nrOfChildren = general.ASM([8, 7, 1, 67]);
    for (var i = 0; i < that.nrOfChildren; i++) {
        that.children.push(new Event(i, that.nrOfChildren));
    }

    return that;
};