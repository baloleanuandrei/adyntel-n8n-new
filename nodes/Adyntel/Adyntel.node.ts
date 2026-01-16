import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Adyntel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Adyntel API',
		name: 'adyntel',
		icon: 'file:adyntel.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Learn if a domain is running ads or not using the Adyntel API',
		defaults: {
			name: 'Adyntel API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'adyntelApi',
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
						action: 'Get meta ads data',
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
					{
						name: 'Get LinkedIn Ads',
						value: 'getLinkedInAds',
						action: 'Get linked in ads data',
						description: 'Get LinkedIn ads data for a company domain',
						routing: {
							request: {
								method: 'POST',
								url: '/linkedin',
								body: {
									api_key: '={{$credentials.apiKey}}',
									email: '={{$credentials.email}}',
									company_domain: '={{$parameter.companyDomain}}'
								},
							},
						},
					},
					{
						name: 'Get Google Ads',
						value: 'getGoogleAds',
						action: 'Get google ads data',
						description: 'Get Google ads data for a company domain',
						routing: {
							request: {
								method: 'POST',
								url: '/google',
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
						operation: ['getFacebookAds', 'getLinkedInAds', 'getGoogleAds'],
					},
				},
				default: '',
				description: 'The company domain to get ads data for (e.g., example.com)',
			},
		]
	};
}
