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

var Part = require('./part.model').Part;

exports.Subject = function(type) {
    var that = {};
    that.displayName = general.generateKeywords(_.random(2, 5)).join(' ');
    that.model_id = general.generateId(that.displayName.split(' '));
    that.type = 'subject';

    // A subject has on average 2 parts
    that.children = [];
    that.nrOfChildren = general.ASM([2, 2, 1, 8]);
    for (var i = 0; i < that.nrOfChildren; i++) {
        that.children.push(new Part());
    }

    return that;
};
