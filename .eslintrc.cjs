module.exports = {
	"env": {
		"node": true,
		"browser": true,
		"es2020": true,
	},
	"globals": {
		"Behaviour": true,
	},
	"ignorePatterns": [
		"theme/_build/*",
	],
	"extends": "eslint:recommended",
	"overrides": [
		{
			"files": [
				"*.cjs"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		},
		{
			"files": [
				"*.mjs",
			],
			"parserOptions": {
				"sourceType": "module"
			}
		},
	],
	"rules": {
		"no-prototype-builtins": "off",
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
			},
		],
		//"array-bracket-newline": ["error", { "multiline": true, "minItems": 3 }],
		//"array-element-newline": ["error", { "multiline": true }]
		"array-element-newline": ["error", "consistent"]
	}
}