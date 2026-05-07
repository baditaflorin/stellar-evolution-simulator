# Deploy

Published site:

https://baditaflorin.github.io/stellar-evolution-simulator/

Repository:

https://github.com/baditaflorin/stellar-evolution-simulator

## Publishing

GitHub Pages serves the `main` branch `/docs` directory.

To publish:

```sh
make build
git add docs
git commit -m "chore: publish pages"
git push
```

## Rollback

Revert the publishing commit that changed `docs/`, then push `main`.

```sh
git revert <commit_sha>
git push
```

## Custom Domains

No custom domain is configured in v1. If one is added later, create `docs/CNAME` and configure DNS according to GitHub Pages documentation:

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
