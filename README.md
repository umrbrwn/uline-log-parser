# Log parser app 🚌
Typescript based CLI app that uses Node.js streams and Transform to parse and transform logs to JSON format.

### How to setup
- Requires Node.js version 18+ to develop (may work on v16 but not tested)
- Install packages using `yarn install`
- `npm run build`
- `cd dist`

### Usage

```
node dist/index.js --input ./sample-app.log --output ./sample-output.json
```

### Demo
Check `sample-app.log` for inputs, and `sample-output.json` for generated output. Same can be generated with usage command.