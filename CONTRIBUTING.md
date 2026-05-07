# Contributing

Thanks for helping improve Stellar Evolution Simulator.

## Local Setup

```sh
make install
make install-hooks
make dev
```

## Commit Style

Use Conventional Commits:

- `feat: add simulator control`
- `fix: correct remnant threshold`
- `docs: update deployment notes`
- `test: cover stellar tracks`

## Checks

Before pushing, run:

```sh
make lint
make test
make build
make smoke
```

Do not commit secrets, real `.env` files, private keys, or generated credentials.
