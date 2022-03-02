# scalable-teams
Version **1.0.0**

Generates a pre-made teams add-on, scalable and customizable. Appends itself to developed packs.

## Usage
This filter requires that you have [nodejs](https://nodejs.org/en/) installed.

Install this filter by running (`github.com/cda94581/regolith-premade-addons/scalable-teams`). Apply the filters similar to the example:
```json
{
	"filters": [
		{
			"filter": "scalable-teams",
			"settings": {
				"type": "stable",
				"teams": 4
			}
		}
	]
}
```

### Settings

Name | Default | Description
---- | ------- | -----------
`type` | `stable` | The method in which the script obtains the files.
`teams` | `4` | The amount of teams to create.

#### type
There are three possible values for the `type` setting. Setting the value to `custom` assumes you have a `player.json` file already created, allowing for graceful merging. Setting the value to `stable` downloads the vanilla `player.json` file for the latest stable release, and setting the value to `beta` downloads the vanilla `player.json` file for the latest beta release.

## Changelog
### 1.0.0
- Initial release