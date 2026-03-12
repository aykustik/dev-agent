# Database Expertise Examples

## SQL Queries

### Basic Select
```sql
SELECT id, name, email FROM users WHERE active = true;
```

### Join Example
```sql
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2024-01-01';
```

---

## Migrations

### Create Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Using with Task Runner

```bash
node .agent/core/scripts/task-runner.js start db-migration
node .agent/core/scripts/task-runner.js done db-migration
```

---

## Best Practices

- Use parameterized queries to prevent SQL injection
- Add indexes for frequently queried columns
- Always backup before migrations
- Use transactions for multi-step operations
