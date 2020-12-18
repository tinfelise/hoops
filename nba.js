var nba_teams = {
  "Hawks":{"city":"Atlanta","color":"#C8102E","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/ATL.svg"},
  "Celtics":{"city":"Boston","color":"#007A33","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/BOS.svg"},"Nets":{"city":"Brooklyn","color":"#FFFFFF","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/BKN.svg"},"Hornets":{"city":"Charlotte","color":"#201747","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/CHA.svg"},"Bulls":{"city":"Chicago","color":"#BA0C2F","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/CHI.svg"},"Cavaliers":{"city":"Cleveland","color":"#6F263D","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/CLE.svg"},"Mavericks":{"city":"Dallas","color":"#0050B5","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/DAL.svg"},"Nuggets":{"city":"Denver","color":"#418FDE","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/DEN.svg"},"Pistons":{"city":"Detroit","color":"#003DA5","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/DET.svg"},"Warriors":{"city":"Golden State","color":"#003DA5","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/GSW.svg"},"Rockets":{"city":"Houston","color":"#BA0C2F","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/HOU.svg"},"Pacers":{"city":"Indiana","color":"#041E42","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/IND.svg"},"Clippers":{"city":"Los Angeles","color":"#D50032","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/LAC.svg"},"Lakers":{"city":"Los Angeles","color":"#702F8A","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/LAL.svg"},"Grizzlies":{"city":"Memphis","color":"#23375B","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/MEM.svg"},"Heat":{"city":"Miami","color":"#862633","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/MIA.svg"},"Bucks":{"city":"Milwaukee","color":"#2C5234","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/MIL.svg"},"Timberwolves":{"city":"Minnesota","color":"#002B5C","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/MIN.svg"},"Pelicans":{"city":"New Orleans","color":"#002B5C","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/NOP.svg"},"Knicks":{"city":"New York","color":"#003DA5","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/NYK.svg"},"Thunder":{"city":"Oklahoma City","color":"#007DC3","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/OKC.svg"},"Magic":{"city":"Orlando","color":"#007DC5","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/ORL.svg"},"76ers":{"city":"Philadelphia","color":"#006BB6","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/PHI.svg"},"Suns":{"city":"Phoenix","color":"#E56020","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/PHX.svg"},"Trail Blazers":{"city":"Portland","color":"#F0163A","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/POR.svg"},"Kings":{"city":"Sacramento","color":"#724C9F","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/SAC.svg"},"Spurs":{"city":"San Antonio","color":"#B6BFBF","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/SAS.svg"},"Raptors":{"city":"Toronto","color":"#CE1141","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/TOR.svg"},"Jazz":{"city":"Utah","color":"#002B5C","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/UTA.svg"},"Wizards":{"city":"Washington","color":"#0C2340","logo":"https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/WAS.svg"}
};

var nba;
function get_nba_data (season, date, stations) {
  var allow_cors = 'https://cors-anywhere.herokuapp.com/';
  var path = allow_cors + 'https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/' + season + '/league/00_full_schedule_week.json'
  var settings = {
      url: path,
      beforeSend: function () {
        console.log('Getting the ' + season + ' NBA schedule...')
      },
      error: function (request, error) {
        console.log('Airball. (' + error + ')');
      },
      success: function (data) {
        nba = data;
        filterNBAData(data, date, stations);
      },
      timeout: 5000
    };
    $.ajax(settings)
};

function filterNBAData (data, date, local_networks) {
  games = [];
  var x = 0;
  var nba_games = [];

  for (i in data.lscd) {
    var month_games = data.lscd[i].mscd;
    for (each in month_games.g) {
      nba_games[x] = month_games.g[each];
      x++;
    };
  };

  for (i in nba_games) {
    var game_day = nba_games[i].etm;
      game_day = moment(game_day).format('YYYYMMDD');
    if (game_day == date) {
      var home = {};
        home.team = nba_games[i].h.tn;
        home.logo = nba_teams[home.team].logo;
        home.color = nba_teams[home.team].color;
      var away = {};
        away.team = nba_games[i].v.tn;
        away.logo = nba_teams[away.team].logo;
        away.color = nba_teams[away.team].color;
      var start = nba_games[i].etm;
        start = start + '-04:00'; // EST timezone offset
      var network = '';
      var networks = nba_games[i].bd.b;
      for (i in networks) {
        if ( (networks[i].scope == 'natl') && (networks[i].type == 'tv') && (networks[i].disp != 'NBATV') && (networks[i].disp != 'NBA TV') ) {
          network = networks[i].disp;
        } else if ((local_networks) && (local_networks.indexOf(networks[i].disp)) >= 0) {
          network = networks[i].disp;
        };
      };
      createGame('NBA', home, away, start, network);
    }
  };
};

