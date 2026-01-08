import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Adyntel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Adyntel Facebook API',
		name: 'adyntel',
		icon: 'file:adyntel.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get Facebook ads data from Adyntel API',
		defaults: {
			name: 'Adyntel Facebook API',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'AdyntelApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.adyntel.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Facebook Ads',
						value: 'getFacebookAds',
						action: 'Get facebook ads data',
						description: 'Get Facebook ads data for a company domain',
						routing: {
							request: {
								method: 'POST',
								url: '/facebook',
								body: {
									api_key: '={{$credentials.apiKey}}',
									email: '={{$credentials.email}}',
									company_domain: '={{$parameter.companyDomain}}'
								},
							},
						},
					},
				],
				default: 'getFacebookAds',
			},
			{
				displayName: 'Company Domain',
				name: 'companyDomain',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getFacebookAds'],
					},
				},
				default: '',
				description: 'The company domain to get Facebook ads data for (e.g., example.com)',
			},
		]
	};
}
