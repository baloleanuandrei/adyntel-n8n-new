import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

function getErrorMessage(error: any): string {
	if (!error) {
		return 'Unknown error occurred';
	}

	// Authentication errors
	if (error.response && (error.response.status === 401 || error.response.status === 403)) {
		return 'Authentication failed. Please check your API Key and Email credentials. Error: ' + (error.response.data?.message || error.message);
	}

	// Rate limiting
	if (error.response && error.response.status === 429) {
		return 'Rate limit exceeded. Please wait a moment before trying again. Error: ' + (error.response.data?.message || error.message);
	}

	// Server errors
	if (error.response && error.response.status >= 500) {
		return 'Adyntel API server error. Please try again later. Error: ' + (error.response.data?.message || error.message);
	}

	// Network errors
	if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
		return 'Network error: Unable to connect to Adyntel API. Please check your internet connection and try again. Error code: ' + error.code;
	}

	// Validation errors
	if (error.response && error.response.status === 400) {
		return 'Invalid request. Please check your input parameters. Error: ' + (error.response.data?.message || error.message);
	}

	// Generic error with response
	if (error.response) {
		return `API error (${error.response.status}): ${error.response.data?.message || error.message}`;
	}

	// Generic error
	return 'Error: ' + error.message;
}

export class Adyntel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Adyntel API',
		name: 'adyntel',
		icon: 'file:adyntel-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["platform"]}} - {{$parameter["operation"]}}',
		description: 'Get ads data from Adyntel API (Facebook, LinkedIn, Google). Returns raw API response for maximum flexibility.',
		defaults: {
			name: 'Adyntel API',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Facebook',
						value: 'facebook',
						description: 'Get Facebook ads data',
					},
					{
						name: 'LinkedIn',
						value: 'linkedin',
						description: 'Get LinkedIn ads data',
					},
					{
						name: 'Google',
						value: 'google',
						description: 'Get Google ads data',
					},
				],
				default: 'facebook',
				description: 'Choose which platform to get ads data from',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Ads',
						value: 'getAds',
						action: 'Get ads data',
						description: 'Get ads data for a company or page',
					},
				],
				default: 'getAds',
			},
			{
				displayName: 'Target Type',
				name: 'targetType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['getAds'],
						platform: ['facebook'],
					},
				},
				options: [
					{
						name: 'Company Domain',
						value: 'companyDomain',
						description: 'Search by company domain',
					},
					{
						name: 'Facebook URL',
						value: 'facebookUrl',
						description: 'Search by Facebook page URL',
					},
				],
				default: 'companyDomain',
				description: 'Choose whether to search by company domain or Facebook URL',
			},
			{
				displayName: 'Target Type',
				name: 'targetType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['getAds'],
						platform: ['linkedin', 'google'],
					},
				},
				options: [
					{
						name: 'Company Domain',
						value: 'companyDomain',
						description: 'Search by company domain',
					},
				],
				default: 'companyDomain',
				description: 'Search by company domain',
			},
			{
				displayName: 'Company Domain',
				name: 'companyDomain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getAds'],
						targetType: ['companyDomain'],
					},
				},
				default: '',
				required: true,
				placeholder: 'example.com',
				description: 'The company domain to search for (e.g., example.com). Supports n8n expressions.',
			},
			{
				displayName: 'Facebook URL',
				name: 'facebookUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getAds'],
						platform: ['facebook'],
						targetType: ['facebookUrl'],
					},
				},
				default: '',
				required: true,
				placeholder: 'https://www.facebook.com/pagename',
				description: 'The Facebook page URL (must start with https://). Supports n8n expressions.',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['getAds'],
					},
				},
				options: [
					{
						displayName: 'Active Status',
						name: 'active_status',
						type: 'options',
						options: [
							{
								name: 'Active Only',
								value: 'active',
							},
							{
								name: 'Inactive Only',
								value: 'inactive',
							},
							{
								name: 'All',
								value: 'all',
							},
						],
						default: 'active',
						description: 'Filter results by active status',
					},
					{
						displayName: 'Continuation Token',
						name: 'continuation_token',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						placeholder: 'token_from_previous_response',
						description: 'Token for pagination. Use the continuation_token from a previous response to get the next page.',
					},
					{
						displayName: 'Country Code',
						name: 'country_code',
						type: 'string',
						default: '',
						placeholder: 'US',
						description: 'Filter results by country code (e.g., US, UK, CA)',
					},
					{
						displayName: 'Media Type',
						name: 'media_type',
						type: 'options',
						options: [
							{
								name: 'Image',
								value: 'image',
							},
							{
								name: 'Meme',
								value: 'meme',
							},
							{
								name: 'Image and Meme',
								value: 'image_and_meme',
							},
							{
								name: 'Video',
								value: 'video',
							},
						],
						default: 'image',
						description: 'Filter results by media type',
					},
					{
						displayName: 'Webhook URL',
						name: 'webhook_url',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						placeholder: 'https://your-webhook-url.com',
						description: 'Optional webhook URL to receive notifications',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('adyntelApi');

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const platform = this.getNodeParameter('platform', i) as string;

				if (operation === 'getAds') {
					const targetType = this.getNodeParameter('targetType', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

					// Determine API endpoint based on platform
					let apiEndpoint = '';
					switch (platform) {
						case 'facebook':
							apiEndpoint = 'https://api.adyntel.com/facebook';
							break;
						case 'linkedin':
							apiEndpoint = 'https://api.adyntel.com/linkedin';
							break;
						case 'google':
							apiEndpoint = 'https://api.adyntel.com/google';
							break;
						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown platform: ${platform}`,
								{ itemIndex: i }
							);
					}

					// Build request body
					const body: any = {
						api_key: credentials.apiKey,
						email: credentials.email,
					};

					// Add target parameter (company_domain or facebook_url)
					if (targetType === 'companyDomain') {
						const companyDomain = this.getNodeParameter('companyDomain', i) as string;

						// Validate company domain is not empty
						if (!companyDomain || companyDomain.trim() === '') {
							throw new NodeOperationError(
								this.getNode(),
								'Company Domain cannot be empty',
								{ itemIndex: i }
							);
						}

						body.company_domain = companyDomain.trim();
					} else if (targetType === 'facebookUrl') {
						const facebookUrl = this.getNodeParameter('facebookUrl', i) as string;

						// Validate Facebook URL
						if (!facebookUrl || facebookUrl.trim() === '') {
							throw new NodeOperationError(
								this.getNode(),
								'Facebook URL cannot be empty',
								{ itemIndex: i }
							);
						}

						const trimmedUrl = facebookUrl.trim();
						if (!trimmedUrl.startsWith('https://')) {
							throw new NodeOperationError(
								this.getNode(),
								'Facebook URL must start with https://',
								{ itemIndex: i }
							);
						}

						body.facebook_url = trimmedUrl;
					}

					// Add optional parameters if provided
					if (additionalOptions.webhook_url && additionalOptions.webhook_url.trim() !== '') {
						body.webhook_url = additionalOptions.webhook_url.trim();
					}

					if (additionalOptions.continuation_token && additionalOptions.continuation_token.trim() !== '') {
						body.continuation_token = additionalOptions.continuation_token.trim();
					}

					if (additionalOptions.media_type && additionalOptions.media_type !== '') {
						body.media_type = additionalOptions.media_type;
					}

					if (additionalOptions.country_code && additionalOptions.country_code.trim() !== '') {
						body.country_code = additionalOptions.country_code.trim();
					}

					if (additionalOptions.active_status && additionalOptions.active_status !== '') {
						body.active_status = additionalOptions.active_status;
					}

					// Make API request with retry logic
					let response;
					let retryCount = 0;
					const maxRetries = 3;
					let lastError;

					while (retryCount <= maxRetries) {
						try {
							response = await this.helpers.httpRequest({
								method: 'POST',
								url: apiEndpoint,
								body,
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								json: true,
							});
							break; // Success, exit retry loop
					} catch (error: any) {
						lastError = error;

						// Check if error is retryable (only if error exists)
						const isRetryable = error &&
							(error.code === 'ETIMEDOUT' ||
							error.code === 'ECONNRESET' ||
							(error.response && error.response.status >= 500) ||
							(error.response && error.response.status === 429));

						if (!isRetryable || retryCount >= maxRetries) {
							// Not retryable or max retries reached, throw error
							break;
						}

						// Wait before retrying (exponential backoff)
						retryCount++;
						const waitTime = Math.pow(2, retryCount) * 1000;
						await new Promise(resolve => setTimeout(resolve, waitTime));
					}
					}

					if (!response) {
						// All retries failed, throw detailed error
						const errorMessage = getErrorMessage(lastError);
						throw new NodeOperationError(
							this.getNode(),
							errorMessage,
							{ itemIndex: i }
						);
					}

					// Return raw API response
					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
