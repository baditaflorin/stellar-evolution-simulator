.DEFAULT_GOAL := help

.PHONY: help install install-hooks dev build test test-integration smoke lint fmt pages-preview clean

help:
	@awk 'BEGIN {FS = ":.*##"; printf "Available targets:\n"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install project dependencies
	npm install

install-hooks: ## Wire local git hooks
	@git config core.hooksPath .githooks
	@echo "Git hooks path set to .githooks"

dev: ## Run local development server
	npm run dev

build: ## Build Pages-ready site
	npm run build

test: ## Run unit tests
	npm run test

test-integration: ## Run integration tests
	npm run test:integration

smoke: ## Run static smoke test
	npm run smoke

lint: ## Run linters
	npm run lint

fmt: ## Format files
	npm run fmt

pages-preview: ## Serve docs like GitHub Pages
	npm run preview

clean: ## Remove local build artifacts
	@rm -rf node_modules coverage playwright-report test-results
