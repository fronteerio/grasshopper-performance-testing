# Gatling simulations

This folder contains a set of gatling simulation scripts.


## Tips and pointers

* Configure the hostname of your application by editting `baseURL` in `timetable/TimetableSimulation.scala`
* Ensure Apache is allowed to use lots of file descriptors. Have a look at /usr/local/bin/apachectl and tweak the ulimit settings
* Ensure Grasshopper is allowed to use lots of file descriptors. Run `ulimit -n 4096` before starting Grasshopper


## Running a Gatling simulation

1. Download [the gatling bundle (highcharts)](http://gatling.io/download/). At the time of writing that page links to the wrong file. Grab [gatling-bundle-2.1.0 here](https://oss.sonatype.org/content/repositories/snapshots/io/gatling/gatling-bundle/2.1.0-SNAPSHOT/gatling-bundle-2.1.0-20141029.223551-64-bundle.zip).
2. Extract it somewhere. (Assume, `~/projects/fronteer/timetable/gatling`)
3. Remove everything under:
  * `~/projects/fronteer/timetable/gatling/user-files/data`
  * `~/projects/fronteer/timetable/gatling/user-files/simulations`
4. Copy `*.loaded.json` from `model-loader/scripts` to `~/projects/fronteer/timetable/gatling/user-files/data`
5. Copy the `timetable` directory to `~/projects/fronteer/timetable/gatling/user-files/simulations`
6. Change directory to `~/projects/fronteer/timetable/gatling`
7. Run `./bin/gatling.sh`
8. Hit enter a few times (the descriptions aren't really that important)
9. The tests will now run
