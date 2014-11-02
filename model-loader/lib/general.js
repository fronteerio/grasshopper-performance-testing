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

///////////////////////////
// GENERIC API FUNCTIONS //
///////////////////////////

// Generator object
Generators = require('gen');

var _ = require('lodash');
var fs = require('fs');
var gm = require('gm');
var mime = require('mime');
var Path = require('path');
var util = require('util');


exports.loadFileIntoArray = function(filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var finallines = [];
    var lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\r/g, '');
        if (lines[i]) {
            finallines.push(lines[i]);
        }
    }
    return finallines;
};

exports.loadJSONFileIntoObject = function(filename) {
    var items = exports.loadFileIntoArray(filename);
    var finalitems = {};
    for (var i = 0; i < items.length; i++) {
        var item = JSON.parse(items[i]);
        finalitems[item.model_id] = item;
    }
    return finalitems;
};

exports.writeFile = function(filename, content) {
    try {
        fs.unlinkSync(filename);
    } catch (err) {}
    fs.writeFileSync(filename, content, 'utf8');
};

exports.writeObjectToFile = function(filename, object) {
    try {
        fs.unlinkSync(filename);
    } catch (err) {}
    var finalArray = [];
    for (var i in object) {
        finalArray.push(JSON.stringify(object[i]));
    }
    fs.writeFileSync(filename, finalArray.join('\n'), 'utf8');
};

// Folder specific functions
exports.folderExists = function(path) {
    return fs.existsSync(path);
};

exports.createFolder = function(path) {
    if (!exports.folderExists(path)) {
        fs.mkdirSync(path);
    }
};

// List files in a folder
exports.getFileListForFolder = function(foldername) {
    var files = fs.readdirSync(foldername);
    return files;
};

// List files in a folder who match one of the specified mimetypes
exports.getFilesInFolder = function(foldername, mimetypes) {
    var files = fs.readdirSync(foldername);
    var matchedFiles = [];
    for (var i = 0; i < files.length; i++) {
        var type = mime.lookup(foldername + '/' + files[i]);
        if (mimetypes.indexOf(type) !== -1) {
            matchedFiles.push(files[i]);
        }
    }
    return matchedFiles;
};

exports.removeFilesInFolder = function(foldername) {
    var files = exports.getFileListForFolder(foldername);
    for (var f = 0; f < files.length; f++) {
        fs.unlinkSync(foldername + '/' + files[f]);
    }
};

// Randomize function
// Pass this something along the lines of [[0.5, 'M'],[0.5, 'F']]
exports.randomize = function(_mapfunc) {
    // Make a copy of the array
    var mapFuncLength = _mapfunc.length;
    var mapfunc = [];
    // Make it a Cummulative Density Function
    for (var i = 0; i < mapFuncLength; i++) {
        mapfunc[i] = [_mapfunc[i][0], _mapfunc[i][1]];
        if (i !== 0) {
            mapfunc[i][0] = mapfunc[i -1][0] + mapfunc[i][0];
        }
    }

    // Select the randoms
    var random = Math.random() * mapfunc[mapFuncLength - 1][0];

    // Return the selected one
    for (var j = 0; j < mapFuncLength; j++) {
        if (random <= mapfunc[j][0]) {
            return mapfunc[j][1];
        }
    }
};

// Calculate a value given an average, standard deviation and maximum
exports.ASM = function(vars) {
    var average = vars[0]; var sdev = vars[1]; var minimum = vars[2]; var maximum = vars[3];
    var outlier = exports.randomize([[0.02, true], [0.98, false]]);
    if (outlier) {
        // Generate an outlier
        return Math.round(Math.random() * (maximum - average) + average);
    } else {
        // Generate a number from a gaussian distribution
        var G = (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
        var R = Math.round(G*sdev+average);
        if (R < minimum) {
            R = minimum;
        } else if (R > maximum) {
            R = maximum;
        }
        return R;
    }
};

////////////////
// LOAD NAMES //
////////////////

var maleFirstNames = exports.loadFileIntoArray('./data/male.first.txt');
var femaleFirstNames = exports.loadFileIntoArray('./data/female.first.txt');
var lastNames = exports.loadFileIntoArray('./data/all.last.txt');

////////////////
// LOAD WORDS //
////////////////

var verbs = exports.loadFileIntoArray('./data/verbs.txt');
var nouns = exports.loadFileIntoArray('./data/nouns.txt');
var keywords = exports.loadFileIntoArray('./data/keywords.txt');
Generators.english.prototype.NOUN = Generators.english.words(nouns);
Generators.english.prototype.VERBAS = Generators.english.words(verbs);

//////////////////////////
// USER DATA GENERATION //
//////////////////////////

exports.generateSentence = function(total) {
    if (!total || total === 1) {
        return Generators.english.sentence();
    }
    var sentences = [];
    for (var i = 0; i < total; i++) {
        sentences.push(Generators.english.sentence());
    }
    return sentences.join(' ');
};

exports.generateParagraph = function(total) {
    if (!total || total === 1) {
        return Generators.english.paragraph();
    } else {
        return Generators.english.paragraphs(total);
    }
};

exports.generateFirstName = function(sex) {
    if (!sex) {
        sex = exports.randomize([[0.5, 'M'],[0.5, 'F']]);
    }
    var firstName = '';
    if (sex === 'M') {
        firstName = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)].toLowerCase();
    } else if (sex === 'F') {
        firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)].toLowerCase();
    }
    return firstName[0].toUpperCase() + firstName.substring(1);
};

exports.generateLastName = function() {
    var lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
    return lastName[0].toUpperCase() + lastName.substring(1);
};

exports.generateName = function(sex) {
    return exports.generateFirstName(sex) + ' ' + exports.generateLastName();
};

exports.generateId = function(seed) {
    return (seed.join('-').toLowerCase()) + '-' + Math.round(Math.random() * 1000);
};

exports.generateEmail = function(seed) {
    return seed.join('_').toLowerCase() + '@example.com';
};

exports.generatePassword = function() {
    var passwords = exports.loadFileIntoArray('./data/passwords.txt');
    return passwords[Math.floor(Math.random() * passwords.length)];
};

exports.generateKeywords = function(total) {
    var toReturn = [];
    for (var i = 0; i < total; i++) {
        // 50% is from a dedicated keywords list, 50% is from the noun list
        var fromDedicated = exports.randomize([[0.5, true], [0.5, false]]);
        if (fromDedicated) {
            toReturn.push(keywords[Math.floor(Math.random() * keywords.length)]);
        } else {
            toReturn.push(nouns[Math.floor(Math.random() * nouns.length)]);
        }
    }
    return toReturn;
};
