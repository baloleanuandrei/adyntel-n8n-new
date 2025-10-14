import { AdyntelApi } from '../credentials/AdyntelApi.credentials';

describe('AdyntelApi Credentials', () => {
	let credentials: AdyntelApi;

	beforeEach(() => {
		credentials = new AdyntelApi();
	});

	describe('Configuration', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('adyntelApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Adyntel API');
		});

		it('should have correct documentation URL', () => {
			expect(credentials.documentationUrl).toBe('https://adyntel.com/docs');
		});
	});

	describe('Properties', () => {
		it('should have API Key property', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp).toBeDefined();
			expect(apiKeyProp?.displayName).toBe('API Key');
			expect(apiKeyProp?.type).toBe('string');
			expect(apiKeyProp?.typeOptions).toEqual({ password: true });
		});

		it('should have Email property', () => {
			const emailProp = credentials.properties.find((p) => p.name === 'email');
			expect(emailProp).toBeDefined();
			expect(emailProp?.displayName).toBe('Email');
			expect(emailProp?.type).toBe('string');
		});

		it('should not have Company Domain property', () => {
			const companyDomainProp = credentials.properties.find((p) => p.name === 'companyDomain');
			expect(companyDomainProp).toBeUndefined();
		});

		it('should have exactly 2 properties', () => {
			expect(credentials.properties).toHaveLength(2);
		});
	});

	describe('Authentication', () => {
		it('should have generic authentication type', () => {
			expect(credentials.authenticate.type).toBe('generic');
		});

		it('should include api_key in authentication body', () => {
			const body = credentials.authenticate.properties.body as any;
			expect(body.api_key).toBe('={{$credentials.apiKey}}');
		});

		it('should include email in authentication body', () => {
			const body = credentials.authenticate.properties.body as any;
			expect(body.email).toBe('={{$credentials.email}}');
		});

		it('should not include company_domain in authentication body', () => {
			const body = credentials.authenticate.properties.body as any;
			expect(body).not.toHaveProperty('company_domain');
		});

		it('should have exactly 2 fields in authentication body', () => {
			const body = credentials.authenticate.properties.body as any;
			expect(Object.keys(body)).toHaveLength(2);
		});
	});
});

