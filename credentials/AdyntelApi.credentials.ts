// import {
// 	IAuthenticateGeneric,
// 	ICredentialType,
// 	INodeProperties,
// 	ICredentialDataDecryptedObject,
// 	INodeCredentialTestResult,
// 	ICredentialTestFunctions,
// } from 'n8n-workflow';

// export class AdyntelApi implements ICredentialType {
// 	name = 'adyntelApi';
// 	displayName = 'Adyntel API';
// 	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
// 	documentationUrl = 'https://docs.adyntel.com';
// 	properties: INodeProperties[] = [
// 		{
// 			displayName: 'API Key',
// 			name: 'apiKey',
// 			type: 'string',
// 			typeOptions: { password: true },
// 			default: '',
// 		},
// 		{
// 			displayName: 'Email',
// 			name: 'email',
// 			type: 'string',
// 			placeholder: 'name@email.com',
// 			default: '',
// 		},
// 	];
// 	authenticate: IAuthenticateGeneric = {
// 		type: 'generic',
// 		properties: {
// 			body: {
// 				'api_key': '={{$credentials.apiKey}}',
// 				'email': '={{$credentials.email}}'
// 			}
// 		},
// 	};
// 	// @ts-expect-error - n8n supports async test methods even though TypeScript interface may not reflect it
// 	async test(
// 		this: ICredentialTestFunctions,
// 		credentials: ICredentialDataDecryptedObject,
// 	): Promise<INodeCredentialTestResult> {
// 		const options = {
// 			method: 'POST',
// 			url: 'https://api.adyntel.com/facebook',
// 			body: {
// 				api_key: credentials.apiKey as string,
// 				email: credentials.email as string,
// 				company_domain: 'lokalise.com', // Using a test domain for credential validation
// 			},
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		};

// 		try {
// 			// @ts-expect-error - httpRequest may not be in TypeScript types but is available at runtime
// 			await this.helpers.httpRequest(options);
// 			return {
// 				status: 'OK',
// 				message: 'Authentication successful!',
// 			};
// 		} catch (error) {
// 			return {
// 				status: 'Error',
// 				message: error instanceof Error ? error.message : 'Authentication failed',
// 			};
// 		}
// 	}
// }
import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AdyntelApi implements ICredentialType {
	name = 'adyntelApi';
	displayName = 'Adyntel API';
	documentationUrl = 'https://docs.adyntel.com';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			placeholder: 'name@email.com',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				api_key: '={{$credentials.apiKey}}',
				email: '={{$credentials.email}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: 'https://api.adyntel.com/facebook',
			body: {
				company_domain: 'lokalise.com',
			},
		},
	};
}
