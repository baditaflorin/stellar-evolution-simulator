.DEFAULT_GOAL := help

.PHONY: help install install-hooks dev build test smoke lint fmt pages-preview clean

help:
	@awk 'BEGIN {FS = ":.*##"; printf "Available targets:\n"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install project dependencies
	@echo "No dependencies yet."

install-hooks: ## Wire local git hooks
	@git config core.hooksPath .githooks
	@echo "Git hooks path set to .githooks"

dev: ## Run local development server
	@echo "Frontend scaffold pending."

build: ## Build Pages-ready site
	@test -f docs/index.html
	@echo "docs/index.html is ready for GitHub Pages."

test: ## Run unit tests
	@echo "Tests pending."

smoke: ## Run static smoke test
	@test -f docs/index.html
	@echo "Smoke baseline passed."

lint: ## Run linters
	@echo "Linters pending."

fmt: ## Format files
	@echo "Formatters pending."

pages-preview: ## Serve docs like GitHub Pages
	@python3 -m http.server 4173 --directory docs

clean: ## Remove local build artifacts
	@rm -rf node_modules coverage playwright-report test-results
