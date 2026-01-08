# n8n-nodes-adyntel

This is an n8n community node. It lets you use Adyntel's API in your n8n workflows.

Adyntel is an Ad Intelligence Platform that helps you uncover competitor and prospect ads across Google, Meta (Facebook), and LinkedIn. Use this node to discover who's running ads on these platforms and analyze their advertising strategies.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In brief, you can install this node by:

1. Going to **Settings** → **Community Nodes**
2. Clicking **Install a community node**
3. Entering `n8n-nodes-adyntel`
4. Clicking **Install**

Alternatively, you can install it via npm in your n8n installation directory:

```bash
npm install n8n-nodes-adyntel
```

## Operations

### Get Facebook Ads

Retrieves Facebook ads data for a specified company domain. This operation allows you to discover what Facebook ads a company is running, including ad creatives, targeting information, and campaign details.

**Parameters:**
- **Company Domain** (required): The domain of the company you want to get Facebook ads data for (e.g., `example.com`). You can enter this directly or use an expression to reference data from previous nodes, such as `={{$json.domain}}`.

## Credentials

To use this node, you need to authenticate with Adyntel using your API credentials.

### Prerequisites

1. Sign up for an Adyntel account at [https://adyntel.com](https://adyntel.com)
2. Get your API key from your Adyntel Dashboard

### Setting up credentials

1. In the Adyntel node, click on **Credentials** → **Create New**
2. Select **Adyntel API**
3. Enter the following:
   - **API Key**: Your Adyntel API key (found in your Dashboard)
   - **Email**: The email address associated with your Adyntel account
4. Click **Save**

Your API key and email are used to authenticate all API requests to Adyntel's services.

## Compatibility

- **Minimum n8n version**: Compatible with n8n version 1.0.0 and above
- **Node.js version**: Requires Node.js 20.15 or higher

## Usage

### Basic Example

1. Add the **Adyntel** node to your workflow
2. Configure your **Adyntel API** credentials (see [Credentials](#credentials) above)
3. Select the **Get Facebook Ads** operation
4. Enter the **Company Domain** you want to analyze (e.g., `example.com`)
5. Execute the node to retrieve Facebook ads data

### Using with Previous Nodes

You can use the Company Domain parameter with expressions to dynamically pull domains from previous nodes:

**Example workflow:**
1. Use a node to fetch a list of companies (e.g., from a CRM or database)
2. Connect the **Adyntel** node
3. In the **Company Domain** field, use an expression like `={{$json.domain}}` or `={{$json.companyDomain}}`
4. The node will automatically process each company domain from the previous node's output

### Example Use Cases

- **Competitor Analysis**: Monitor what ads your competitors are running on Facebook
- **Prospect Research**: Discover which companies in your target market are actively advertising
- **CRM Enrichment**: Enrich your CRM data with ad intelligence information
- **ABM Segmentation**: Segment your ABM prospects by ad creative type or campaign strategy

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Adyntel Documentation](https://docs.adyntel.com)
* [Adyntel Website](https://adyntel.com)
* [Adyntel API Authorization Guide](https://docs.adyntel.com/authorization)
