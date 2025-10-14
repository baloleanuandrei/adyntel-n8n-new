# n8n-nodes-adyntel

This is an n8n community node that integrates with [Adyntel's Facebook Ads API](https://adyntel.com). Get comprehensive Facebook advertising data including ads, creatives, targeting, and performance metrics.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Usage](#usage)
- [Examples](#examples)
- [Pagination](#pagination)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-adyntel` in the npm package name field
5. Click **Install**

### Manual Installation

If you're self-hosting n8n, you can install this node manually:

```bash
npm install n8n-nodes-adyntel
```

For Docker installations, rebuild your n8n image after adding the package to your dependencies.

## Credentials

You need an Adyntel API account to use this node. Sign up at [adyntel.com](https://adyntel.com) to get your credentials.

### Required Credentials

1. **API Key** - Your Adyntel API key
2. **Email** - The email address associated with your Adyntel account

### Setting Up Credentials

1. In n8n, go to **Credentials** > **New**
2. Search for "Adyntel API"
3. Enter your **API Key** and **Email**
4. Click **Save**

## Operations

### Get Facebook Ads

Retrieve Facebook advertising data for a company or Facebook page.

#### Parameters

**Target Type** (Required)
- **Company Domain** - Search by company domain (e.g., `example.com`)
- **Facebook URL** - Search by Facebook page URL (must start with `https://`)

**Additional Options**
- **Webhook URL** - Optional webhook URL to receive notifications
- **Continuation Token** - Token for pagination (use the token from a previous response to get the next page)
- **Media Type** - Filter results by media type:
  - Image
  - Meme
  - Image and Meme
  - Video
- **Country Code** - Filter results by country code (e.g., `US`, `UK`, `CA`)
- **Active Status** - Filter results by active status:
  - Active Only (default)
  - Inactive Only
  - All

## Usage

### Basic Usage

1. Add the **Adyntel Facebook API** node to your workflow
2. Select your Adyntel API credentials
3. Choose your **Target Type**:
   - For company domain: Enter the domain (e.g., `nike.com`)
   - For Facebook URL: Enter the full Facebook page URL (e.g., `https://www.facebook.com/nike`)
4. Optionally configure additional options
5. Execute the node

### Using Expressions

All parameters support n8n expressions, allowing you to use dynamic values from previous nodes:

**Example: Dynamic Company Domain**
```javascript
{{$json["domain"]}}
```

**Example: Dynamic Facebook URL**
```javascript
{{$json["facebook_url"]}}
```

## Examples

### Example 1: Basic Company Lookup

**Scenario:** Get Facebook ads for a company by domain

1. Add an **Adyntel Facebook API** node
2. Set **Target Type** to "Company Domain"
3. Enter `nike.com` in the **Company Domain** field
4. Execute

**Result:** Returns all Facebook ads data for Nike

### Example 2: Facebook Page URL with Filters

**Scenario:** Get only video ads from a specific Facebook page

1. Add an **Adyntel Facebook API** node
2. Set **Target Type** to "Facebook URL"
3. Enter `https://www.facebook.com/nike` in the **Facebook URL** field
4. Under **Additional Options**, add **Media Type**
5. Select "Video"
6. Execute

**Result:** Returns only video ads from the Nike Facebook page

### Example 3: Bulk Processing with Expressions

**Scenario:** Process multiple companies from a list

1. Add a **Code** node or **Spreadsheet File** node with company domains
2. Add an **Adyntel Facebook API** node
3. Set **Target Type** to "Company Domain"
4. In the **Company Domain** field, use: `{{$json["domain"]}}`
5. Execute

**Result:** Processes each company domain from your list

### Example 4: Pagination Loop

**Scenario:** Get all results using pagination

1. Add an **Adyntel Facebook API** node for the initial request
2. Add an **IF** node to check if `continuation_token` exists in the response
3. If token exists, loop back to **Adyntel Facebook API** node
4. In the loop, use **Additional Options** > **Continuation Token**: `{{$json["continuation_token"]}}`
5. Collect all results

## Pagination

The Adyntel API returns results in pages. If there are more results available, the response will include a `continuation_token` field.

### How to Handle Pagination

1. Make your initial request
2. Check if the response contains a `continuation_token`
3. If present, make another request with the token in **Additional Options** > **Continuation Token**
4. Repeat until no `continuation_token` is returned

### Example Response with Pagination

```json
{
  "ads": [...],
  "continuation_token": "eyJwYWdlIjoyLCJvZmZzZXQiOjEwMH0="
}
```

## Troubleshooting

### Authentication Failed

**Error:** "Authentication failed. Please check your API Key and Email credentials."

**Solutions:**
- Verify your API Key and Email are correct in your credentials
- Check that your Adyntel account is active
- Ensure there are no extra spaces in your credentials

### Invalid Facebook URL

**Error:** "Facebook URL must start with https://"

**Solutions:**
- Ensure the URL starts with `https://` (not `http://`)
- Use the full Facebook page URL (e.g., `https://www.facebook.com/pagename`)
- Check for typos in the URL

### Rate Limit Exceeded

**Error:** "Rate limit exceeded. Please wait a moment before trying again."

**Solutions:**
- Wait a few seconds before retrying
- Reduce the frequency of your requests
- Consider implementing delays between requests in your workflow
- Contact Adyntel support to increase your rate limit

### Network Errors

**Error:** "Network error: Unable to connect to Adyntel API"

**Solutions:**
- Check your internet connection
- Verify your n8n instance can reach external APIs
- Check if there are any firewall rules blocking the connection
- Try again later as there might be temporary connectivity issues

### Empty Results

If you receive an empty response or no ads:
- Verify the company domain or Facebook URL is correct
- The company might not have active Facebook ads
- Try adjusting your filters (media type, country code, active status)

## API Response Format

The node returns the raw API response from Adyntel, which includes:

- **ads** - Array of ad objects with details about each ad
- **page_info** - Information about the Facebook page
- **continuation_token** - Token for pagination (if more results are available)
- Additional metadata depending on the API response

All fields from the response are accessible in downstream nodes using n8n expressions like:

```javascript
{{$json["ads"]}}
{{$json["continuation_token"]}}
{{$json["page_info"]}}
```

## Support

- **Adyntel Support:** [support@adyntel.com](mailto:support@adyntel.com)
- **Adyntel Documentation:** [adyntel.com/docs](https://adyntel.com/docs)
- **n8n Community:** [community.n8n.io](https://community.n8n.io)
- **Issues:** [GitHub Issues](https://github.com/adyntel/n8n-nodes-adyntel/issues)

## License

[MIT](LICENSE.md)

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Adyntel API Documentation](https://adyntel.com/docs)
