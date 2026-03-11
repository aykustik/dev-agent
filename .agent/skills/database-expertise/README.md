# Database Expertise

## Overview
The Database Expertise skill provides tools for SQL/NoSQL databases, schema design, query optimization, migrations, and CRUD operations.

## Tools
- `generate_schema` - Generate database schema
- `optimize_query` - Optimize SQL queries
- `create_migration` - Generate migration scripts
- `design_index` - Design database indexes
- `generate_crud` - Generate CRUD operations

## Schema Design
### Normalization
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies
- Use denormalization strategically for performance

### Data Types
- Use appropriate sizes (INT vs BIGINT)
- Prefer DECIMAL over FLOAT for money
- Use JSON/JSONB for flexible schemas
- Consider ENUM for fixed sets

## Query Optimization
1. Use EXPLAIN ANALYZE
2. Index WHERE clauses
3. Avoid SELECT *
4. Use LIMIT/OFFSET for pagination
5. Batch inserts
6. Use connection pooling

## Index Design
- Index frequently queried columns
- Composite indexes order matters
- Consider covering indexes
- Avoid over-indexing

## Migrations
- Always use transactions
- Backward compatible
- Test rollback procedures
- Version control migrations
