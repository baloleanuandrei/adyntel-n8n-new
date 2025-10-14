import { Adyntel } from '../nodes/Adyntel/Adyntel.node';
import { IExecuteFunctions } from 'n8n-workflow';

describe('Adyntel Node', () => {
	let adyntelNode: Adyntel;

	beforeEach(() => {
		adyntelNode = new Adyntel();
	});

	describe('Node Configuration', () => {
		it('should have correct display name', () => {
			expect(adyntelNode.description.displayName).toBe('Adyntel API');
		});

		it('should have correct name', () => {
			expect(adyntelNode.description.name).toBe('adyntel');
		});

		it('should have correct icon', () => {
			expect(adyntelNode.description.icon).toBe('file:adyntel-logo.svg');
		});

		it('should require adyntelApi credentials', () => {
			expect(adyntelNode.description.credentials).toEqual([
				{
					name: 'adyntelApi',
					required: true,
				},
			]);
		});

		it('should have platform selector', () => {
			const platformProperty = adyntelNode.description.properties.find(
				(p) => p.name === 'platform',
			);
			expect(platformProperty).toBeDefined();
			expect(platformProperty?.options).toEqual([
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
			]);
		});

		it('should have getAds operation', () => {
			const operationProperty = adyntelNode.description.properties.find(
				(p) => p.name === 'operation',
			);
			expect(operationProperty).toBeDefined();
			expect(operationProperty?.options).toEqual([
				{
					name: 'Get Ads',
					value: 'getAds',
					action: 'Get ads data',
					description: 'Get ads data for a company or page',
				},
			]);
		});

		it('should have targetType property with correct options for Facebook', () => {
			const targetTypeProperties = adyntelNode.description.properties.filter(
				(p) => p.name === 'targetType',
			);
			expect(targetTypeProperties.length).toBeGreaterThan(0);

			// Find the Facebook-specific target type property
			const facebookTargetType = targetTypeProperties.find(
				(p) => p.displayOptions?.show?.platform?.includes('facebook')
			);
			expect(facebookTargetType).toBeDefined();
			expect(facebookTargetType?.options).toEqual([
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
			]);
		});

		it('should have companyDomain property', () => {
			const companyDomainProperty = adyntelNode.description.properties.find(
				(p) => p.name === 'companyDomain',
			);
			expect(companyDomainProperty).toBeDefined();
			expect(companyDomainProperty?.required).toBe(true);
		});

		it('should have facebookUrl property', () => {
			const facebookUrlProperty = adyntelNode.description.properties.find(
				(p) => p.name === 'facebookUrl',
			);
			expect(facebookUrlProperty).toBeDefined();
			expect(facebookUrlProperty?.required).toBe(true);
		});

		it('should have additionalOptions with correct sub-options', () => {
			const additionalOptionsProperty = adyntelNode.description.properties.find(
				(p) => p.name === 'additionalOptions',
			);
			expect(additionalOptionsProperty).toBeDefined();
			expect(additionalOptionsProperty?.options).toBeDefined();

			const options = additionalOptionsProperty?.options as any[];
			expect(options.find((o) => o.name === 'webhook_url')).toBeDefined();
			expect(options.find((o) => o.name === 'continuation_token')).toBeDefined();
			expect(options.find((o) => o.name === 'media_type')).toBeDefined();
			expect(options.find((o) => o.name === 'country_code')).toBeDefined();
			expect(options.find((o) => o.name === 'active_status')).toBeDefined();
		});
	});

	describe('Parameter Validation', () => {
		let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

		beforeEach(() => {
			mockExecuteFunctions = {
				getInputData: jest.fn().mockReturnValue([{ json: {} }]),
				getNodeParameter: jest.fn(),
				getCredentials: jest.fn().mockResolvedValue({
					apiKey: 'test-api-key',
					email: 'test@example.com',
				}),
				helpers: {
					httpRequest: jest.fn(),
				},
				getNode: jest.fn().mockReturnValue({ name: 'Adyntel Test Node' }),
				continueOnFail: jest.fn().mockReturnValue(false),
			} as any;
		});

		it('should validate empty company domain', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce(''); // companyDomain (empty)

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				'Company Domain cannot be empty',
			);
		});

		it('should validate empty facebook URL', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('facebookUrl') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce(''); // facebookUrl (empty)

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				'Facebook URL cannot be empty',
			);
		});

		it('should validate facebook URL starts with https://', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('facebookUrl') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('http://facebook.com/page'); // facebookUrl (wrong protocol)

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				'Facebook URL must start with https://',
			);
		});

		it('should accept valid facebook URL', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('facebookUrl') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('https://www.facebook.com/nike'); // facebookUrl

			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue({
				ads: [],
			});

			const result = await adyntelNode.execute.call(mockExecuteFunctions);
			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
		});

		it('should trim whitespace from company domain', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('  nike.com  '); // companyDomain with spaces

			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue({
				ads: [],
			});

			await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.adyntel.com/facebook',
				body: {
					api_key: 'test-api-key',
					email: 'test@example.com',
					company_domain: 'nike.com',
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('API Request Building', () => {
		let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

		beforeEach(() => {
			mockExecuteFunctions = {
				getInputData: jest.fn().mockReturnValue([{ json: {} }]),
				getNodeParameter: jest.fn(),
				getCredentials: jest.fn().mockResolvedValue({
					apiKey: 'test-api-key',
					email: 'test@example.com',
				}),
				helpers: {
					httpRequest: jest.fn().mockResolvedValue({ ads: [] }),
				},
				getNode: jest.fn().mockReturnValue({ name: 'Adyntel Test Node' }),
				continueOnFail: jest.fn().mockReturnValue(false),
			} as any;
		});

		it('should build request with company domain for Facebook', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('nike.com'); // companyDomain

			await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.adyntel.com/facebook',
				body: {
					api_key: 'test-api-key',
					email: 'test@example.com',
					company_domain: 'nike.com',
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should build request with company domain for LinkedIn', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('linkedin') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('nike.com'); // companyDomain

			await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.adyntel.com/linkedin',
				body: {
					api_key: 'test-api-key',
					email: 'test@example.com',
					company_domain: 'nike.com',
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should build request with company domain for Google', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('google') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('nike.com'); // companyDomain

			await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.adyntel.com/google',
				body: {
					api_key: 'test-api-key',
					email: 'test@example.com',
					company_domain: 'nike.com',
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should build request with facebook URL', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('facebookUrl') // targetType
				.mockReturnValueOnce({}) // additionalOptions
				.mockReturnValueOnce('https://www.facebook.com/nike'); // facebookUrl

			await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.adyntel.com/facebook',
				body: {
					api_key: 'test-api-key',
					email: 'test@example.com',
					facebook_url: 'https://www.facebook.com/nike',
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should include optional parameters when provided', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({
					webhook_url: 'https://webhook.example.com',
					continuation_token: 'token123',
					media_type: 'video',
					country_code: 'US',
					active_status: 'all',
				}) // additionalOptions
				.mockReturnValueOnce('nike.com'); // companyDomain

			await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.adyntel.com/facebook',
				body: {
					api_key: 'test-api-key',
					email: 'test@example.com',
					company_domain: 'nike.com',
					webhook_url: 'https://webhook.example.com',
					continuation_token: 'token123',
					media_type: 'video',
					country_code: 'US',
					active_status: 'all',
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should not include empty optional parameters', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds') // operation
				.mockReturnValueOnce('facebook') // platform
				.mockReturnValueOnce('companyDomain') // targetType
				.mockReturnValueOnce({
					webhook_url: '',
					continuation_token: '  ',
					media_type: '',
				}) // additionalOptions with empty values
				.mockReturnValueOnce('nike.com'); // companyDomain

			await adyntelNode.execute.call(mockExecuteFunctions);

			const callArgs = (mockExecuteFunctions.helpers.httpRequest as jest.Mock).mock.calls[0][0];
			expect(callArgs.body).toEqual({
				api_key: 'test-api-key',
				email: 'test@example.com',
				company_domain: 'nike.com',
			});
			expect(callArgs.body.webhook_url).toBeUndefined();
			expect(callArgs.body.continuation_token).toBeUndefined();
			expect(callArgs.body.media_type).toBeUndefined();
		});
	});

	describe('Error Handling', () => {
		let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

		beforeEach(() => {
			mockExecuteFunctions = {
				getInputData: jest.fn().mockReturnValue([{ json: {} }]),
				getNodeParameter: jest.fn(),
				getCredentials: jest.fn().mockResolvedValue({
					apiKey: 'test-api-key',
					email: 'test@example.com',
				}),
				helpers: {
					httpRequest: jest.fn(),
				},
				getNode: jest.fn().mockReturnValue({ name: 'Adyntel Test Node' }),
				continueOnFail: jest.fn().mockReturnValue(false),
			} as any;

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds')
				.mockReturnValueOnce('facebook')
				.mockReturnValueOnce('companyDomain')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('nike.com');
		});

		it('should handle authentication errors', async () => {
			const error: any = new Error('Authentication failed');
			error.response = { status: 401, data: { message: 'Invalid API key' } };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				/Authentication failed/,
			);
		});

		it('should handle rate limiting errors', async () => {
			const error: any = new Error('Rate limited');
			error.response = { status: 429, data: { message: 'Too many requests' } };
			// Mock will be called 4 times (initial + 3 retries)
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				/Rate limit exceeded/,
			);

			// Verify retry logic was attempted (initial + 3 retries = 4 calls)
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(4);
		}, 15000);

		it('should handle server errors', async () => {
			const error: any = new Error('Server error');
			error.response = { status: 500, data: { message: 'Internal server error' } };
			// Mock will be called 4 times (initial + 3 retries)
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				/server error/,
			);

			// Verify retry logic was attempted
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(4);
		}, 15000);

		it('should handle network errors', async () => {
			const error: any = new Error('Network timeout');
			error.code = 'ETIMEDOUT';
			// Mock will be called 4 times (initial + 3 retries)
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow();

			// Verify retry logic was attempted
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(4);
		}, 15000);

		it('should retry on transient errors', async () => {
			const error: any = new Error('Server error');
			error.response = { status: 500 };

			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockRejectedValueOnce(error)
				.mockRejectedValueOnce(error)
				.mockResolvedValueOnce({ ads: [] });

			const result = await adyntelNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(3);
			expect(result).toBeDefined();
		});

		it('should handle continueOnFail', async () => {
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const error: any = new Error('Some error');
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			const result = await adyntelNode.execute.call(mockExecuteFunctions);

			expect(result[0][0].json).toEqual({ error: 'Error: Some error' });
		});

		it('should handle validation errors (400)', async () => {
			const error: any = new Error('Bad request');
			error.response = { status: 400, data: { message: 'Invalid parameters' } };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				/Invalid request/,
			);
		});

		it('should handle generic API errors with other status codes', async () => {
			const error: any = new Error('Not found');
			error.response = { status: 404, data: { message: 'Resource not found' } };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				/API error \(404\)/,
			);
		});

		it('should handle null/undefined errors gracefully', async () => {
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(null);

			await expect(adyntelNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
				/Unknown error occurred/,
			);
		});
	});

	describe('Response Handling', () => {
		let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

		beforeEach(() => {
			mockExecuteFunctions = {
				getInputData: jest.fn().mockReturnValue([{ json: {} }]),
				getNodeParameter: jest.fn(),
				getCredentials: jest.fn().mockResolvedValue({
					apiKey: 'test-api-key',
					email: 'test@example.com',
				}),
				helpers: {
					httpRequest: jest.fn(),
				},
				getNode: jest.fn().mockReturnValue({ name: 'Adyntel Test Node' }),
				continueOnFail: jest.fn().mockReturnValue(false),
			} as any;

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAds')
				.mockReturnValueOnce('facebook')
				.mockReturnValueOnce('companyDomain')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('nike.com');
		});

		it('should return raw API response', async () => {
			const mockResponse = {
				ads: [{ id: 1, name: 'Test Ad' }],
				continuation_token: 'token123',
				page_info: { name: 'Nike', id: 'nike123' },
			};

			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue(mockResponse);

			const result = await adyntelNode.execute.call(mockExecuteFunctions);

			expect(result).toEqual([
				[
					{
						json: mockResponse,
						pairedItem: { item: 0 },
					},
				],
			]);
		});

		it('should process multiple items', async () => {
			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: {} },
				{ json: {} },
			]);

			// Reset mock to handle two items
			mockExecuteFunctions.getNodeParameter = jest.fn()
				// First item
				.mockReturnValueOnce('getAds')
				.mockReturnValueOnce('facebook')
				.mockReturnValueOnce('companyDomain')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('nike.com')
				// Second item
				.mockReturnValueOnce('getAds')
				.mockReturnValueOnce('linkedin')
				.mockReturnValueOnce('companyDomain')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('adidas.com');

			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockResolvedValueOnce({ ads: [{ name: 'Nike Ad' }] })
				.mockResolvedValueOnce({ ads: [{ name: 'Adidas Ad' }] });

			const result = await adyntelNode.execute.call(mockExecuteFunctions);

			expect(result[0]).toHaveLength(2);
			expect((result[0][0].json as any).ads[0].name).toBe('Nike Ad');
			expect((result[0][1].json as any).ads[0].name).toBe('Adidas Ad');
		});
	});
});

