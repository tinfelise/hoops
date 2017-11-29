import json

d1 = json.load(open('espn_DI_teams.json'))
d2 = json.load(open('herosports_DII_teams.json'))
d3 = json.load(open('d3hoops_DIII_teams.json'))

def merge_dicts(*dict_args):
	result = {}
	for dictionary in dict_args:
		result.update(dictionary)
	return result

ncaa_teams = merge_dicts(d3,d2,d1)

missing = len(d1) + len(d2) + len(d3) - len(ncaa_teams)

print len(d1), 'DI teams,', len(d2), 'DII teams,', len(d3), 'DIII teams added'
print len(ncaa_teams), 'NCAA teams total'
print missing, 'teams overwritten'

import json
with open('ncaa_teams.json', 'w') as outfile:
	json.dump(ncaa_teams, outfile)
print 'Exported to ncaa_teams.json'