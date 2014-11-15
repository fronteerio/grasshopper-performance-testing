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
var RestAPI = require('gh-rest');
var RestUtil = require('gh-rest/lib/util');
var yargs = require('yargs');

var general = require('./lib/general');

var Course = require('./lib/course.model').Course;
var User = require('./lib/user.model').User;


var argv = yargs
    .usage('Load generated data into Grasshopper.\nUsage: $0')
    .example('$0 --host cam.timetable.grasshopper.com --email admin@cam.grasshopper.com --password bananas', 'Load data into the system')
    .demand('h')
    .alias('h', 'host')
    .describe('h', 'The hostname of the app where the data should be loaded in')

    .demand('e')
    .alias('e', 'email')
    .describe('e', 'The email address of an application admin')

    .demand('p')
    .alias('p', 'password')
    .describe('p', 'The password of an application admin')
    .argv;

RestUtil.on('error', function(err) {
    console.log(err);
});

var restOptions = {
    'protocol': 'http',
    'host': argv.host,
    'authenticationStrategy': 'local',
    'username': argv.email,
    'password': argv.password
};
RestAPI.createClient(restOptions, function(err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Read in the users
    var users = require('./scripts/users.generated.json');

    // Load the users
    loadUsers(client, _.values(users), function(users) {

        // Write the user profiles to a json file
        fs.writeFileSync('./scripts/users.loaded.json', JSON.stringify(users));
        console.log(' - Loaded all users');
    });
});

/**
 * Load a set of users into the system
 *
 * @param  {RestClient}     client              The rest client with which to load the users into the system
 * @param  {User[]}         users               The set of users that needs to be loaded into the system
 * @param  {Function}       callback            Standard callback function
 * @param  {User[]}         callback.users      The created users, each user has an `id` field indicating their id in the system
 */
var loadUsers = function(client, users, callback, _createdUsers) {
    _createdUsers = _createdUsers || [];
    if (_.isEmpty(users)) {
        return callback(_createdUsers);
    }

    var user = users.pop();
    client.user.createUser(user.displayName, user.email, user.password, {}, function(err, createdUser) {
        if (err) {
            console.log(err);

            // Move on to the next user if an error ocurred
            return loadUsers(client, users, callback, _createdUsers);    
        }

        // Save the user's id
        user.id = createdUser.id;
        _createdUsers.push(user);

        // Move on to the next user
        loadUsers(client, users, callback, _createdUsers);
    });
};
