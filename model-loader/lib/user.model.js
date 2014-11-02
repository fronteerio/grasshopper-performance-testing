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

exports.User = function() {
    var that = {};

    that.sex = general.randomize([[0.5, 'M'],[0.5, 'F']]);
    that.firstName = general.generateFirstName(that.sex);
    that.lastName = general.generateLastName();
    that.displayName = that.firstName + ' ' + that.lastName;
    that.email = general.generateEmail([that.firstName, that.lastName]);
    that.password = general.generatePassword();

    that.model_id = general.generateId([that.firstName, that.lastName]);

    // Roughly 3% of users do not have anything in their calendar
    that.hasEvents = (_.random(100) >= 3);
    that.numberOfEvents = 0;
    if (that.hasEvents) {
        // If users are registered for events, they will
        // register for about 21 events
        that.numberOfEvents = general.ASM([21, 10, 0, 600]);   
    }

    return that;
};
