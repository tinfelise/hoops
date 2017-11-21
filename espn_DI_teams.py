#http://docs.python-guide.org/en/latest/scenarios/scrape/
print 'Geting ESPN DI Teams...'
from lxml import html
import requests
from lxml import etree
import datetime

dates = []
today = datetime.datetime.today()

numdays = 10
for x in range (0, numdays):
    date = today + datetime.timedelta(days = x)
    date = date.strftime('%Y%m%d')
    dates.append(date)

espn_teams = {}
for date in dates:
	url = 'http://www.espn.com/mens-college-basketball/schedule/_/date/' + date + '/group/50'
	page = requests.get(url)
	tree = html.fromstring(page.content)
	games = tree.xpath("//table[@class='schedule has-team-logos align-left']/tbody/tr")

	if tree.xpath("//*[@class='team-name']"): # checks to see whether there are any games scheduled
		for game in games:
			
			away_team = {}
			home_team = {}

			away_team_name = game.xpath("./td[1]//*[@class='team-name']/span/text()")[0]
			home_team_name = game.xpath("./td[2]//*[@class='team-name']/span/text()")[0]

			if away_team_name != 'TBD':
				away_full = game.xpath("./td[1]//*[@class='team-name']/abbr/@title")[0]
				if len(away_full.split(away_team_name + ' ')) > 1:
					away_team['mascot'] = away_full.split(away_team_name + ' ')[1]
				away_team['abbr'] = game.xpath("./td[1]//*[@class='team-name']/abbr/text()")[0]
				away_logo = game.xpath("./td[1]//img/@src")
				if away_logo:
					away_team['logo'] = game.xpath("./td[1]//img/@src")[0]
					away_team['logo'] = away_team['logo'].split('&')[0]

			if home_team_name != 'TBD':
				home_full = game.xpath("./td[2]//*[@class='team-name']/abbr/@title")[0]
				if len(home_full.split(home_team_name + ' ')) > 1:
					home_team['mascot'] = home_full.split(home_team_name + ' ')[1]
				home_team['abbr'] = game.xpath("./td[2]//*[@class='team-name']/abbr/text()")[0]
				home_logo = game.xpath("./td[2]//img/@src")
				if home_logo:
					home_team['logo'] = game.xpath("./td[2]//img/@src")[0]
					home_team['logo'] = home_team['logo'].split('&')[0]

			# print away_team, home_team

			espn_teams[away_team_name] = away_team
			espn_teams[home_team_name] = home_team

		# away_logos = tree.xpath("//table[@class='schedule has-team-logos align-left']/tbody/tr/td[1]//img/@src")
		# home_logos = tree.xpath("//table[@class='schedule has-team-logos align-left']/tbody/tr/td[2]//img/@src")
		
		# print 'networks_logos'
		# print len(networks_logos)
		# print 'home_teams'
		# print len(home_teams)
		# print 'away_teams'
		# print len(away_teams)
		# print home_teams
		# logos = tree.xpath("//img[@class='schedule-team-logo imageLoaded']/@src")
		# images = tree.xpath("//img/@src")
		# away_team = ''
		# print images
		# logo = tree.xpath("//img[@class='logo']/@src")[0]
		# school = tree.xpath("//h2[@class='team-name']")[0].text_content()
		# mascot = tree.xpath("//h3[@class='nick-name']")[0].text_content()
		# conference = tree.xpath("//div[@class='coach-conf']/div[@class='row clearfix'][2]/a[@class='value']")[0].text_content()
		# ncaa_teams[school] = {'logo':logo, 'mascot':mascot, 'division':'DIII', 'conference':conference}

print len(espn_teams), 'teams found'
print espn_teams

import json
with open('espn_DI_teams.json', 'w') as outfile:
    json.dump(espn_teams, outfile)
