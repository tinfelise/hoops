var today = moment().format('YYYYMMDD');

var games = [];

function createGame(league, home, away, start, network, division, conference) {
	var game = {};
	game.league = league;
	game.home = home;
	game.away = away;
	game.start = start;
	if (network) {
		game.network = network;
	};
	if (division) {
		game.division = division;
	};
	if (conference) {
		game.conference = conference;
	};
	games.push(game);
};

function orderGames () {
	games = games.sort(function (a, b) {
    	return moment(a.start).format('x')
    		.localeCompare(
    			moment(b.start).format('x')
			);
	});
};

function createCountdown (elem, unix_timestamp) {
	var hour = moment(unix_timestamp, 'x').format('H');
	var time_of_day = 'today';
	if (hour > 16) {
		time_of_day = 'tonight';
	};

	$(elem).prepend('<h2 class="countdown"></h2>');
	$(elem).countdown(unix_timestamp)
		.on('update.countdown', function(event) {
			var timer = '';
			if(event.offset.hours > 5) {
				timer = '<div>Later ' + time_of_day + '</div>';
				$(this).addClass('later');
			} else if(event.offset.hours > 0) {
				timer = '<div>In %-H hour%!H %-M minute%!M</div>';
			} else if(event.offset.minutes > 15) {
				timer = '<div>In %-M minute%!M</div>';
			} else {
				timer = '<div>Starting soon</div>';
				$(this).addClass('gametime');
			};
			$('.countdown', this).html(event.strftime(timer));
		})
		.on('finish.countdown', function(event) {
			$('.countdown', this).html('<div>On now</div>');
			$(this).addClass('gametime now');
		});
};
function createCountdowns (selector) {
	$(selector).each( function() {
		var id = '#' + $(this).attr('id');
		var timestamp = $(this).attr('data-timestamp');
		createCountdown(id, timestamp);
	});
};

function search_link (league, home, away) {
	var link = "";
	if (league == "NBA") {
		link = "https://www.reddit.com/r/nbastreams/search?q=";
		link += home + "+" + away;
		link += "&restrict_sr=on";
	};
	if (league == "NCAA") {
		link = "https://www.google.com/search?q=";
		link += home + "+" + away;
		link += "+basketball+live+stream";
	}
	return link;
};
function search_cta (league, home, away) {
	var network_logo = '';
	var search_engine = '';
	if (league == "NBA") {
		// network_logo = 'http://svgshare.com/i/2SL.svg';
		network_logo = 'reddit.svg';
		search_engine = 'Reddit';
	};
	if (league == "NCAA") {
		network_logo = 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg';
		search_engine = 'Google';
	};
	return "Search on <img src='" + network_logo +"' alt='" + search_engine + "'>";
};
function action_class (league) {
	if (league == "NCAA") {
		return 'google';
	};
};

function abbr(str) {
	var words = str.split(' ');
	var abbr = '';
	for (word in words) {
		var first = words[word].slice(0,1);
		if (word < 3 && first != '(') {
			abbr += first;
		};
	};
	return abbr;
};

function createDailyFeed (test) {
	orderGames();
	var games_html = '';
	if (games.length == 0) {
		games_html = '<h2 id="noGames">There are no games today. <span>Stay strong.</span></h2>';
	};
	for (i in games) {
		var league_logo = league_logos[games[i].league];
		var destination = '';
		var cta = '';
		var action_class_name ='';
		var network_logo = '';
		var national = false;
		var network = games[i].network;

		if (network) {
			national = true;
			if (networks[network]) {
				cta = networks[network].link;
				network_logo = networks[network].logo;
				destination = "Watch on <img src='" + network_logo + "' alt='" +  network +"'>";
			} else {
				destination = "Watch on " + network;
			};
		} else {
			cta = search_link(games[i].league,games[i].home.team,games[i].away.team);
			destination = search_cta(games[i].league,games[i].home.team,games[i].away.team);
			action_class_name = action_class(games[i].league);
		}
		
		var time = moment(games[i].start).format('h:mma');
		var display_time = time;
		var unix_time = moment(games[i].start).format('x');
		var same_time_as_last = false;
		if ( (i > 0) && ( time == moment(games[i-1].start).format('h:mma') ) ) {
			same_time_as_last = true;
		};
		if (national && network_logo) {
			display_time += " on <img src='" + network_logo + "' alt='" + network +"'>";
		} else if (national) {
			display_time += " on " + network;
		};
		
		var html = "<div class='logos'>";

			if (games[i].away.logo) {
				html += "<img class='away' src='" + games[i].away.logo + "' alt='" + abbr(games[i].away.team) + "' data-color='" + games[i].home.color + "'>"
			} else {
				html += "<div class='missing' style='background-color:" + games[i].away.color + "'>" + abbr(games[i].away.team) + "</div>";
			};

			if (games[i].home.logo) {
				html += "<img class='home' src='" + games[i].home.logo + "' alt='" + abbr(games[i].home.team) + "' data-color='" + games[i].home.color + "'>"
			} else {
				html += "<div class='missing' style='background-color:" + games[i].home.color + "'>" + abbr(games[i].home.team) + "</div>";
			};
			
			html += "</div>"
				+ "<div class='data'>"
					+ "<h3><span>" + games[i].away.team + "</span> @ <span>" + games[i].home.team + "</span></h3>"
						+ "<span class='time'>" + display_time + "</span>"
						+ "<span class='action " + action_class_name + "'>"
							+ destination 
						+ "</span>"
				+ "</div>"
				+ "<img class='leagueIcon' src='" + league_logo + "' alt='" + games[i].league + " logo'>";
			if (cta) {
				html = "<a class='game' href='" + cta + "' target='blank_'>" + html + "</a>"
			} else {
				html = "<div class='game nolink'>" + html + "</div>"
			};

		var block_id = moment(games[i].start).format('hmmA') + '_start';
		if (i==0) {
			html = "<div class='block' id='" + block_id + "' data-timestamp='" + unix_time + "'>" + html;
		} else if ( (i > 0) && (same_time_as_last == false) ) {
			html = "</div>" + "<div class='block' id='" + block_id + "' data-timestamp='" + unix_time + "'>" + html;
		};
		if (i==games.length - 1) {
			html += '</div>'
		};
		games_html += html;
	};

	$('#gameFeed').html(games_html).addClass('loaded');
	createCountdowns('.block');
	guess_timezone();
	$('#gameFeed').addClass('loaded');
	if (test == 'gametime') {
		gametime();
	}

};

function guess_timezone() {
	var est_timezone = moment.tz.guess();
	var est_timezone_abr = moment.tz(est_timezone).zoneName();
	if (games.length > 0) {
		$('#timezone').html('All times displayed in ' + est_timezone_abr + '.');
	};
};

// Tests
function parseURLs() {
	var currentURL = window.location.href;
		currentURL = currentURL.split('?')[1];
	if (currentURL) {
		currentURL = currentURL.split('&');
	};
	var parameters = {};
	for (i in currentURL) {
		var key = currentURL[i].split('=')[0];
		var val = currentURL[i].split('=')[1];
		parameters[key] = val;
	};
	check_for_tests(parameters);
};
parseURLs();

function check_for_tests (obj) {
	var test = obj.test;
	if (test) {
		console.log('Test:' + test)
		var input = test.split('(')[1];
		if (input) {
			input = input.split(')')[0];
			console.log('with input(s): ' + input);
		};
		test = test.split('(')[0];
		window[test](input);
	};
	if (test == 'NBAVariety' || test == 'noGames') {
		createDailyFeed(test);
	} else if (test != 'notLoading') {
		customizations(obj);
		var ncaa_divisions = ['d1','d2','d3'];
		// var ncaa_divisions = ['d1'];
		// fetch_ncaa(today, ncaa_divisions);
		createDailyFeed(test);
	};
};

// Check url for apps=app1,app2, etc.
function installed_apps (obj) {
	var url_apps = obj.apps;
	var apps = [];
	if (url_apps) {
		apps = url_apps.split(',')
		console.log('Installed apps:' + apps);
	};
};

function loc (obj) {
	var url_location = obj.loc;
	var local_networks = {
		"bayarea":["NBCSBA"],
		"beantown":["NBC SPORTS BOSTON","NBCSB"]
	};
	if (url_location) {
		return local_networks[url_location];
	};
};

function customizations (obj) {
	var local_stations;
	installed_apps(obj);
	local_stations = loc(obj);
	get_nba_data('2020', today, local_stations);
};

function college (divisions) {
	divisions = divisions.split(',');
	fetch_ncaa(today, divisions);
};
function noGames () {
	games = [];
};
function NBAVariety () {
	games = [];
	var now = moment().format('x');
		now = parseInt(now);
	var second = 1000;
	var minute = second*60;
	var hour = minute*60;

	games = [
		{
			"league":"NBA",
			"home": {
				"team":"Warriors",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/GSW.svg",
				"color":"#003DA5"
			},
			"away": {
				"team":"Rockets",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/HOU.svg",
				"color":"#BA0C2F"
			},
			"start": moment().format('MMM DD YYYY hh:mm:ss'),
			"network":"NBA TV"
		},
		{
			"league":"NBA",
			"home": {
				"team":"Timberwolves",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/MIN.svg",
				"color":"#002B5C"
			},
			"away": {
				"team":"Trail Blazers",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/POR.svg",
				"color":"#F0163A"
			},
			"start": moment( now + (minute*15) + (second*3), 'x' ).format('MMM DD YYYY hh:mm:ss'),
			"network":"ESPN"
		},
		{
			"league":"NBA",
			"home":{
				"team":"Thunder",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/OKC.svg",
				"color":"#007DC3"
			},
			"away": {
				"team":"Pelicans",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/NOP.svg",
				"color":"#002B5C"
			},
			"start": moment( now + (hour*1), 'x' ).format('MMM DD YYYY hh:mm:ss'),
			"network":"TNT"	
		},
		{
			"league":"NBA",
			"home":{	
				"team":"Knicks",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/NYK.svg",
				"color":"#003DA5"
			},
			"away":{
				"team":"Lakers",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/LAL.svg",
				"color":"#702F8A"
			},
			"start": moment( now + (hour*2), 'x' ).format('MMM DD YYYY hh:mm:ss'),
			"network":"Nickelodeon"	
		},
		{
			"league":"NBA",
			"home":{	
				"team":"Spurs",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/UTA.svg",
				"color":"#B6BFBF"
			},
			"away":{
				"team":"Nets",
				"logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/BKN.svg",
				"color":"#FFFFFF"
			},
			"start": moment( now + (minute*15) + 3, 'x' ).format('MMM DD YYYY hh:mm:ss'),
			"network":""	
		}
	];
};
function changeDate(date) {
	filterNBAData(nba, date);
	console.log(date);
};
function notLoading() {};
function gametime() {
	$('.block').addClass('gametime');
};