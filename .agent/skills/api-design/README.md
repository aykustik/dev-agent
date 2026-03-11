# API Design & Integration

## Overview
API Design & Integration skill provides tools for designing REST/GraphQL APIs, generating OpenAPI specs, and implementing authentication.

## Tools
- `generate_endpoint` - Generate API endpoint code
- `generate_openapi` - Generate OpenAPI specification
- `design_schema` - Design request/response schemas
- `add_auth` - Add authentication (JWT, OAuth, Basic, API Key)
- `validate_endpoint` - Validate endpoint design

## REST Best Practices
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Use plural nouns for resources (/users not /user)
- Version APIs (/v1/users)
- Return appropriate status codes
- Use pagination for collections

## Authentication
- JWT for stateless auth
- OAuth 2.0 for third-party access
- API Keys for service-to-service
- Rate limiting on all endpoints

## OpenAPI Example
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        200:
          description: User list
```
