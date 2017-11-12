var ncaaScoreboard = {};
ncaaScoreboard.dispScoreboard = function(data) {
    var ncaa_games = data.scoreboard[0].games;
    console.log('NCAA games:');
    console.log(ncaa_games);
	for (i in ncaa_games) {
		var game = ncaa_games[i];
		var away = {};
			away.team = game.away.nameRaw;
			away.logo = 'https://www.ncaa.com' + game.away.iconURL;
			away.color = game.away.color;
			away.rank = game.away.teamRank;
		var home = {};
			home.team = game.home.nameRaw;
			home.logo = 'https://www.ncaa.com' + game.home.iconURL;
			home.color = game.home.color;
			home.rank = game.home.teamRank;
		var start = '';
		if (game.startTime != 'TBA') {
			start = game.startTimeEpoch;
			start = moment(start, 'X').format();
		};
		var network = game.network_logo;
		var division = '';
		var conference = game.conference.split(' ');
		if (game.startTime == 'TBA') {
			console.log(away.team + ' @ ' + home.team + ' is TBA');
		};
		createGame('NCAA', home, away, start, network, division, conference);
		// createGame('NCAA', home, away, start, network);
	};
	// console.log('Clean:');
	// console.log(games);
	createDailyFeed();
};

function fetch_ncaa() {
	var divisions = ['d1','d2','d3'];
	for (i in divisions) {
		var ncaa_url = "https://data.ncaa.com/jsonp/scoreboard/basketball-men/"
			+ divisions[i] + '/'
			+ moment().format('YYYY/MM/DD')
			+ "/scoreboard.html?callback=ncaaScoreboard.dispScoreboard";
		// var ncaa_url = "https://data.ncaa.com/jsonp/scoreboard/basketball-men/d1/2017/11/10/scoreboard.html?callback=ncaaScoreboard.dispScoreboard";
		var ncaa_settings = {
		  "dataType": 'jsonp',
		  "url": ncaa_url
		}
		$.ajax(ncaa_settings);
	};
};
// fetch_ncaa();