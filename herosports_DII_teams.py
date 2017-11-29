print 'Geting DII Teams from hersoports.com...'
from lxml import html
import requests

d2_page = 'https://herosports.com/rankings/college-d2-mens-basketball'
page = requests.get(d2_page)
tree = html.fromstring(page.content)

links = tree.xpath("//li/span[@class='team-name']/a/@href")
conference_pages = []
for link in links:
	if link.startswith('https://herosports.com/ncaa-conferences/'):
		conference_pages.append(link)
print 'Found', len(conference_pages), 'conferences'

d2_teams = {}
for url in conference_pages:
	conference_page = requests.get(url)
	conference_tree = html.fromstring(conference_page.content)
	conference = conference_tree.xpath("//div[@class='school-name']/big/text()")[0].strip()
	teams = conference_tree.xpath("//li[@class='team-list school_page_sports_icon']")
	for team in teams:
		school = team.xpath(".//a/span[@class='stand']/text()")[0]
		
		path  = team.xpath(".//a/@href")[0]
		team_page = requests.get(path)
		team_tree = html.fromstring(team_page.content)

		team_data = {}

		team_data['logo'] = team_tree.xpath("//div[@class='teamname_leftpart']//@src")[0]
		team_data['conference'] = conference
		team_data['division'] = 'DII'
		
		full_name = team_tree.xpath("//div[@class='teamname_leftpart']//@alt")
		if full_name:
			full_name = full_name[0].split(' - ')[0]
			team_data['full_name'] = full_name
			mascot = full_name.split(school)
			if len(mascot) > 1:
				mascot = mascot[1].strip()
				mascot = mascot.split('ate ')
				if len(mascot) > 1:
					mascot = mascot[1]
				else:
					mascot = mascot[0]
				mascot = mascot.split(') ')
				if len(mascot) > 1:
					mascot = mascot[1]
				else:
					mascot = mascot[0]
				team_data['mascot'] = mascot

		print school, team_data
		d2_teams[school] = team_data

print 'Found', len(d2_teams), 'DII teams'

import json
with open('herosports_DII_teams.json', 'w') as outfile:
	json.dump(d2_teams, outfile)
print 'Exported to herosports_DII_teams.json'
