# Publication Checklist for n8n-nodes-adyntel

## Pre-Publication Requirements

### ✅ Code Quality
- [x] All TypeScript files compile without errors
- [x] ESLint passes with no errors
- [x] All tests pass (38 tests passing)
- [x] Code coverage meets thresholds (80%+)

### ✅ Package Metadata
- [x] package.json has correct name: `n8n-nodes-adyntel`
- [x] package.json has correct version: `0.1.0`
- [x] package.json has accurate description
- [x] package.json has correct author information (Adyntel)
- [x] package.json has correct repository URL
- [x] package.json has correct homepage URL
- [x] package.json has appropriate keywords
- [x] package.json includes bugs URL

### ✅ Documentation
- [x] README.md is comprehensive and accurate
- [x] README.md includes installation instructions
- [x] README.md includes credential setup guide
- [x] README.md includes usage examples
- [x] README.md includes troubleshooting section
- [x] README.md includes pagination documentation
- [x] LICENSE.md has correct copyright (2025 Adyntel)

### ✅ Node Implementation
- [x] Credential system uses only API Key and Email
- [x] Node supports company_domain parameter
- [x] Node supports facebook_url parameter
- [x] Parameters support n8n expressions
- [x] All optional API parameters implemented:
  - [x] webhook_url
  - [x] continuation_token
  - [x] media_type
  - [x] country_code
  - [x] active_status
- [x] Comprehensive error handling with retry logic
- [x] Raw API response pass-through
- [x] Input validation for all parameters

### ✅ Build & Distribution
- [x] Build process completes successfully
- [x] All assets copied to dist directory
- [x] SVG icons included in dist
- [x] TypeScript declarations generated
- [x] Source maps generated
- [x] JSON files copied correctly
- [x] package.json files array correctly configured
- [x] Test files excluded from build

### ✅ Testing
- [x] Unit tests for node configuration
- [x] Unit tests for parameter validation
- [x] Unit tests for API request building
- [x] Unit tests for error handling
- [x] Unit tests for response handling
- [x] Unit tests for credentials
- [x] Integration tests with mocked responses
- [x] Retry logic tests
- [x] Test scripts configured in package.json

### ✅ n8n Compatibility
- [x] n8n configuration in package.json is correct
- [x] Credential class name follows n8n conventions (camelCase)
- [x] Node follows n8n declarative style where appropriate
- [x] Proper use of IExecuteFunctions
- [x] NodeConnectionType properly configured
- [x] All n8n linter rules pass

## Publication Steps

### 1. Final Verification
```bash
# Clean build
npm run build

# Run all tests
npm test

# Run linter
npm run lint

# Test package creation
npm pack --dry-run
```

### 2. Version Management
- Ensure version follows semantic versioning
- Update CHANGELOG.md if present
- Tag release in git

### 3. npm Publication
```bash
# Publish to npm registry
npm publish

# Or for first-time publication with public access
npm publish --access public
```

### 4. Post-Publication
- Verify package appears on npm registry
- Test installation: `npm install n8n-nodes-adyntel`
- Test in n8n instance
- Verify node appears in n8n palette
- Test credential creation
- Test API calls
- Submit to n8n community nodes (optional)

## n8n Community Node Submission (Optional)

If you want the node to appear on n8n cloud:

1. Go to https://github.com/n8n-io/n8n/tree/master/packages/@n8n/nodes-community
2. Follow submission guidelines
3. Create pull request with node information
4. Wait for review and approval

## Troubleshooting

### Package not found after publication
- Wait a few minutes for npm registry to sync
- Clear npm cache: `npm cache clean --force`
- Try with full package name: `npm install n8n-nodes-adyntel`

### Node not appearing in n8n
- Restart n8n after installation
- Check n8n logs for errors
- Verify package.json n8n configuration
- Check file paths in n8n.credentials and n8n.nodes arrays

### Build errors
- Delete node_modules and dist directories
- Run `npm install` again
- Run `npm run build` again

## Support Contacts

- **Adyntel Support:** support@adyntel.com
- **GitHub Issues:** https://github.com/adyntel/n8n-nodes-adyntel/issues
- **n8n Community:** https://community.n8n.io

---

**Last Updated:** 2025-10-13
**Package Version:** 0.1.0
**Status:** Ready for Publication ✅

