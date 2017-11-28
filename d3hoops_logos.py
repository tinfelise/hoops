print 'Geting DIII team data...'
from lxml import html
import requests

print 'Geting team page URLs...'
urls = []
regions = ['http://www.d3hoops.com/teams/region/northeast-men','http://www.d3hoops.com/teams/region/east-men','http://www.d3hoops.com/teams/region/atlantic-men','http://www.d3hoops.com/teams/region/mid-atlantic-men','http://www.d3hoops.com/teams/region/south-men','http://www.d3hoops.com/teams/region/great_lakes-men','http://www.d3hoops.com/teams/region/central-men','http://www.d3hoops.com/teams/region/west-men']
for region in regions:
	region_page = requests.get(region)
	region_tree = html.fromstring(region_page.content)
	team_urls = region_tree.xpath("//main[@id='mainbody']/table[@class='roster']//td[1]/a/@href")
	for team_url in team_urls:
		urls.append("http://www.d3hoops.com" + team_url)

print '... and the team data now...'
D3_teams = {}
for url in urls:
	page = requests.get(url)
	tree = html.fromstring(page.content)
	
	if tree.xpath("//h2[@class='team-name']"):
		school = tree.xpath("//h2[@class='team-name']")[0].text_content()
		team_data = {}

		logo = tree.xpath("//img[@class='logo']/@src")[0]
		if logo:
			team_data['logo'] = logo.split('?')[0]
		team_data['mascot'] = tree.xpath("//h3[@class='nick-name']")[0].text_content()
		team_data['division'] = 'DIII'
		team_data['conference'] = tree.xpath("//div[@class='coach-conf']/div[@class='row clearfix'][2]/a[@class='value']")[0].text_content()
		
		D3_teams[school] = team_data
		print school, team_data

print 'Found', len(D3_teams), 'DIII teams'

import json
with open('d3hoops_DIII_teams.json', 'w') as outfile:
	json.dump(D3_teams, outfile)
print 'Exported to d3hoops_DIII_teams.json'