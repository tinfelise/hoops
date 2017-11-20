#http://docs.python-guide.org/en/latest/scenarios/scrape/
print 'Geting ESPN DI Schedule...'
from lxml import html
import requests
from lxml import etree
import datetime

# urls = ['http://www.espn.com/mens-college-basketball/schedule/_/date/20171120/group/50','http://www.espn.com/mens-college-basketball/schedule/_/date/20171121/group/50']
# create dates for the season to construct the URLs
dates = ['20171120','20171121']
today = datetime.datetime.today()
numdays = 100
dateList = [] # remove once date formatting is correct
for x in range (0, numdays):
    dateList.append(today + datetime.timedelta(days = x))
    # format and append to date instead
print dateList

espn_games = []
for date in dates:
	url = 'http://www.espn.com/mens-college-basketball/schedule/_/date/' + date + '/group/50'
	page = requests.get(url)
	tree = html.fromstring(page.content)
	games = tree.xpath("//table[@class='schedule has-team-logos align-left']/tbody/tr")

	for game in games:
		away_team = game.xpath("./td[1]//*[@class='team-name']/span/text()")[0]
		home_team = game.xpath("./td[2]//*[@class='team-name']/span/text()")[0]
		# how should I handle TBD team names?

		timestamp = game.xpath("./td[3]/@data-date")
		if timestamp:
			time = game.xpath("./td[3]/@data-date")[0]
		
		network = ''
		network_text = game.xpath("./td[4]/text()")
		network_logo = game.xpath("./td[4]/a[1]/img/@alt")
		if len(network_text) > 0:
			network = game.xpath("./td[4]/text()")[0]
		elif len(network_logo) > 0:
			network = game.xpath("./td[4]/a[1]/img/@alt")[0]

		game_obj = {}
		game_obj['home'] = home_team
		game_obj['away'] = away_team
		game_obj['time'] = time
		game_obj['network'] = network
		espn_games.append(game_obj)

	times = tree.xpath("//td[3]/@data-date")
	away_logos = tree.xpath("//table[@class='schedule has-team-logos align-left']/tbody/tr/td[1]//img/@src")
	home_logos = tree.xpath("//table[@class='schedule has-team-logos align-left']/tbody/tr/td[2]//img/@src")
	
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

# print espn_games


