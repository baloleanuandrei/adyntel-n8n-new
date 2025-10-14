import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AdyntelApi implements ICredentialType {
	name = 'adyntelApi';
	displayName = 'Adyntel API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://adyntel.com/docs';
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
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				'api_key': '={{$credentials.apiKey}}',
<<<<<<< HEAD
				'email': '={{$credentials.email}}',
=======
				'email': '={{$credentials.email}}'
>>>>>>> be6ae7bc460f8c0bb171b532485992b37bebaa06
			}
		},
	};
}
