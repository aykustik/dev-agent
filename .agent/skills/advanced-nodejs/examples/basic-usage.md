# Advanced Node.js Examples

## Streams

### Readable Stream
```javascript
const fs = require('fs');
const readStream = fs.createReadStream('large-file.txt');

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log('Done reading file');
});
```

---

## Clustering

### Using Cluster Module
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = require('./app');
  app.listen(3000);
}
```

---

## Performance Tips

| Technique | Use Case |
|-----------|----------|
| Caching | Repeated computations |
| Streaming | Large file processing |
| Clustering | Multi-core utilization |
| Compression | Network bandwidth |

---

## Using with Skill Loader

```bash
node .agent/core/scripts/skill-loader.js find node
```
