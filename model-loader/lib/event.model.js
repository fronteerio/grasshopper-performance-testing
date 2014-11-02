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
var moment = require('moment');

var general = require('./general.js');


/**
 * Create an event
 * @param {Number}      nr      The number of this event within a series
 * @param {Number}      total   The total number of events within a series
 */
exports.Event = function(nr, total) {
    var that = {};
    that.displayName = general.generateSentence(1);
    that.model_id = general.generateId(that.displayName.split(' '));
    that.type = 'event';

    // We pick an artificial date range that starts at the first of last month
    // and ends 10 months later
    var timePeriodStart = moment().startOf('month').subtract(1, 'month')
    var timePeriodEnd = moment().startOf('month').subtract(1, 'month').add(10, 'month');

    // Get the total number of days in this 10 month period
    var days = timePeriodEnd.diff(timePeriodEnd, 'day');

    // Events are usually spread out quite evenly
    var addDays = Math.random(nr * (days / total));
    var start = timePeriodStart.add(addDays, 'day');

    // Randomly pick an hour between 8am and 8pm
    var addHours = 8 + _.random(12);
    start.add(addHours, 'hour');

    that.eventStart = start.toDate().getTime();

    // On average, an event lasts about 75 minutes
    var eventTime = general.ASM([75, 45, 15, 1020]);
    that.eventEnd = start.add(eventTime, 'minute').toDate().getTime();

    return that;
};