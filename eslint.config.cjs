const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const n8nNodesBase = require('eslint-plugin-n8n-nodes-base');

module.exports = tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			// Enable all n8n-nodes-base rules
			...Object.keys(n8nNodesBase.rules).reduce((acc, rule) => {
				acc[`n8n-nodes-base/${rule}`] = 'error';
				return acc;
			}, {}),
		},
	},
	{
		ignores: ['dist/**', 'node_modules/**', '*.tgz'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
			},
		},
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			parser: tseslint.parser,
		},
	},
	{
		files: ['**/*.json'],
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off',
		},
	}
);

