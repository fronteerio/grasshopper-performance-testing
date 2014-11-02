package timetable

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class Timetable extends Simulation {

	val httpProtocol = http
		.baseURL("http://cam.timetable.grasshopper.com")
		.inferHtmlResources(BlackList(""".*\.js""", """.*\.css""", """.*\.gif""", """.*\.jpeg""", """.*\.jpg""", """.*\.ico""", """.*\.woff""", """.*\.(t|o)tf""", """.*\.png"""), WhiteList())
		.acceptHeader("""application/json;q=0.9,*/*;q=0.8""")
		.acceptEncodingHeader("""gzip, deflate""")
		.acceptLanguageHeader("""en-US,en;q=0.5""")
		.connection("""keep-alive""")
		.contentTypeHeader("""application/x-www-form-urlencoded""")
		.userAgentHeader("""Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0""")

        // Bypass CSRF
        .header("Referer", "/")


    object Page {
    	val login = exec(http("Login")
    		.post("""/api/auth/login""")
    		.formParam("""username""", "${email}")
    		.formParam("""password""", "${password}"))
            .pause(1)

    	val load = exec(http("Landing page - Calendar")
				.get("""/api/calendar"""))
			.exec(http("Landing page - Tree")
				.get("""/api/orgunit?types=c,s,p"""))
			pause(5)
    }

    object Courses {
    	val select = exec(http("Select a course/part")
				.get("""/api/orgunit?parent=1&includeSeries=true"""))
			.pause(5)
    }

    object Series {
    	val subscribe = exec(http("Subscribe to a series")
				.get("""/api/orgunit"""))
                //.formParam("""a""", """a"""))
                .pause(1)
			.exec(http("Reload the calendar")
				.get("""/api/calendar"""))
                .pause(5)
    }

    // Select a random user out of our CSV file
    val userFeeder = jsonFile("users.json").random

	val scn = scenario("Student view")
        .feed(userFeeder)
        .exec(
    		Page.login
    		//Page.load,
    		//Courses.select,
    		//Series.subscribe
    	)

	setUp(scn.inject(rampUsers(50) over (5 seconds))).protocols(httpProtocol)
}
