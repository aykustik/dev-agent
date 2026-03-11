# Advanced Node.js Expertise

## Overview
Advanced Node.js skill provides tools for streams, clustering, performance optimization, and backend patterns.

## Tools
- `generate_server` - Generate Node.js server
- `implement_streams` - Implement Node.js streams
- `setup_cluster` - Setup cluster configuration
- `add_error_handling` - Add error handling

## Streams
- Use streams for large data
- Handle backpressure
- Pipe streams together
- Handle errors properly

## Clustering
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  app.listen(3000);
}
```

## Performance Tips
- Use connection pooling
- Enable gzip compression
- Cache frequently accessed data
- Use HTTP/2
- Implement rate limiting
- Use async/await over callbacks

## Error Handling
- Always use try/catch for async
- Implement domain error handling
- Log errors with context
- Implement graceful shutdown
