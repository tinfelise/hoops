var ncaa_teams = {};
function get_ncaa_team_data () {
	var settings = {
		url: 'https://tinfelise.github.io/hoops/ncaa_teams.json',
		success: function (data) {
			ncaa_teams = data;
		}
	};
	$.ajax(settings)
};
get_ncaa_team_data();

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function check_for_abbr (str) {
	var length = str.length;
};

function lookup_ncaa_team (obj) {
	if (ncaa_teams[obj.team]) {
		return obj.team;
	} else if (ncaa_teams[obj.short]) {
		return obj.short;
	} else if (ncaa_teams[toTitleCase(obj.short)]) {
		return toTitleCase(obj.short);
	} else if (ncaa_teams[ obj.team.replace(/\./g, "") ]) {
		return obj.team.replace(/\./g, "");
	} else if (ncaa_teams[ obj.team.replace('St.', 'State') ]) {
		return obj.team.replace('St.', 'State');
	} else {
		console.log(obj);
	};
};

var ncaaScoreboard = {};
ncaaScoreboard.dispScoreboard = function(data) {
    var ncaa_games = data.scoreboard[0].games;
	for (i in ncaa_games) {
		var game = ncaa_games[i];
		var away = {};
			away.team = game.away.nameRaw;
			away.logo = 'https://www.ncaa.com' + game.away.iconURL;
			away.color = game.away.color;
			away.rank = game.away.teamRank;
			if(ncaa_teams[away.team]) {
				away.logo = ncaa_teams[away.team].logo;
				away.conference = ncaa_teams[away.team].conference;
				away.division = ncaa_teams[away.team].division;
			};
		var home = {};
			home.team = game.home.nameRaw;
			home.logo = 'https://www.ncaa.com' + game.home.iconURL;
			home.color = game.home.color;
			home.rank = game.home.teamRank;
			if(ncaa_teams[home.team]) {
				home.logo = ncaa_teams[home.team].logo;
				home.conference = ncaa_teams[home.team].conference;
				home.division = ncaa_teams[home.team].division;
			};
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
	};
	createDailyFeed();
};

var ncaa_divisions = ['d1','d2','d3'];
var ncaa_divisions = ['d1'];

function fetch_ncaa(day, divisions) {
	for (i in divisions) {
		var ncaa_url = "https://data.ncaa.com/jsonp/scoreboard/basketball-men/"
			+ divisions[i] + '/'
			+ moment(day, 'YYYY/MM/DD').format('YYYY/MM/DD')
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

function get_ncaa_team_names (days) {
	var ncaa_divisions = ['d1','d2','d3'];
	for (i=0; i<=days; i++) {
		var day = moment().add(i, 'days').format('YYYY/MM/DD');
		fetch_ncaa(day, ncaa_divisions);
	};
	var team_names_from_ncaa_com = [];
	for (game in games) {
		if (games[game].league == 'NCAA') {
			team_names_from_ncaa_com.push(games[game].away.team);
			team_names_from_ncaa_com.push(games[game].home.team);
		};
	};
	console.log(team_names_from_ncaa_com);
};
// get_ncaa_team_names(2);


