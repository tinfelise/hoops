# http://docs.python-guide.org/en/latest/scenarios/scrape/
print 'Geting ESPN DI Teams...'
from lxml import html
import requests

espn_teams = {}

conference_page = requests.get('http://www.espn.com/mens-college-basketball/teams')
conference_html = html.fromstring(conference_page.content)
conferences = conference_html.xpath("//div[@class='mod-container mod-open-list mod-teams-list-medium mod-no-footer']")

for block in conferences:
	conference = block.xpath(".//h4/text()")[0]
	teams = block.xpath(".//h5/a")
	
	for team in teams:
		name = team.xpath("./text()")[0]

		team_data = {}
		team_data['division'] = 'DI'
		team_data['conference'] = conference

		link = team.xpath("./@href")[0]
		team_page = requests.get(link)
		team_tree = html.fromstring(team_page.content)
		
		school = team_tree.xpath("//li[@class='team-name']/span[@class='link-text-short']/text()")[0]
		team_data['school'] = school

		full_name = team_tree.xpath("//li[@class='team-name']/span[@class='link-text']/text()")[0]
		if len(full_name.split(school + ' ')) > 1:
			team_data['mascot'] = full_name.split(school + ' ')[1]
		team_data['full_name'] = full_name

		logo = team_tree.xpath("//nav//img/@src")[1]
		if logo:
			team_data['logo'] = logo.split('&')[0]
		
		print name, team_data
		espn_teams[name] = team_data

print len(espn_teams), 'teams found'
# print espn_teams

import json
with open('espn_DI_teams.json', 'w') as outfile:
	json.dump(espn_teams, outfile)
print 'Exported to espn_teams.json'

