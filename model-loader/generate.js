#!/usr/bin/env node

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
var fs = require('fs');
var yargs = require('yargs');

var general = require('./lib/general');

var Course = require('./lib/course.model').Course;
var User = require('./lib/user.model').User;


var argv = yargs
    .usage('Generate dummy data that can be loaded into Grasshopper.\nUsage: $0')
    .example('$0 --users 10000 --courses 100', 'Generate dummy data that can be loaded into grasshopper')
    .demand('u')
    .alias('u', 'users')
    .describe('u', 'The number of users that should be created')
    .demand('c')
    .alias('c', 'courses')
    .describe('c', 'The number of courses that should be created')
    .argv;


var run = function() {
    console.log('Beginning to generate data');
    // Generate the users
    var users = [];
    for (var i = 0; i < argv.users; i++) {
        users.push(new User());
    }
    console.log(' - Users generated');


    var courses = [];
    for (var i = 0; i < argv.courses; i++) {
        courses.push(new Course());
    }
    console.log(' - Courses generated');

    fs.writeFileSync('./scripts/users.generated.json', JSON.stringify(users));
    fs.writeFileSync('./scripts/courses.generated.json', JSON.stringify(courses));
};

var checkDirectories = function() {
    general.createFolder('scripts');
};

var init = function() {
    checkDirectories();
    run();
};

init();
