# Shlabadawoop

A TypeScript and Express API template for building backend services.

## Requirements

- Node.js 22.12 or newer (Node.js 24 is used by the container image)
- npm
- PostgreSQL for application database features

## Development

Install the locked dependency tree and run all validation:

```bash
npm ci
npm run check
```

`npm run check` runs ESLint, strict TypeScript checking, the test suite with
coverage, and an npm audit that fails on any known vulnerability. The test
command explicitly discovers nested `*.spec.ts` files on every supported
operating system.

Useful commands:

```bash
npm run build
npm test
npm run lint
npm run start:dev
```

The production entry point is `npm start`, which runs the compiled
`dist/src/start.js` application.

## Container

Build the multi-stage, non-root Node.js 24 image:

```bash
docker build -t shlabadawoop .
docker run --rm -p 3000:3000 shlabadawoop
```

The image installs dependencies reproducibly with `npm ci`, compiles the
TypeScript source in its build stage, and copies only production dependencies
and runtime files into the final image.

## Continuous integration

GitHub Actions validates Node.js 22 and 24 on pushes and pull requests. Each
job performs a clean install followed by the complete `npm run check` gate.

## Version

**1.5.1**

## License

MIT

## Code of conduct

Don't be a d\*ck.

## Contact

maxime@cassonade.org
