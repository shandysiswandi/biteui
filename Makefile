.PHONY: help install run build preview lint format format-check typecheck test check docker-build docker-run

PM ?= pnpm
RUN = $(PM) run

DOCKER_IMAGE ?= biteui:latest
DOCKER_PORT ?= 3332

help: ## List available targets.
	@awk -F ':.*## ' '/^[a-zA-Z0-9_-]+:.*## / { printf "%-18s %s\n", $$1, $$2 }' Makefile
	@printf "\n"

install: ## Install dependencies (PM=bun|pnpm|npm|yarn), remove other lockfiles.
	@rm -rf dist
	@rm -rf node_modules
	@if [ "$(PM)" = "bun" ]; then \
		rm -f pnpm-lock.yaml package-lock.json yarn.lock; \
	elif [ "$(PM)" = "pnpm" ]; then \
		rm -f bun.lock bun.lockb package-lock.json yarn.lock; \
	elif [ "$(PM)" = "npm" ]; then \
		rm -f bun.lock bun.lockb pnpm-lock.yaml yarn.lock; \
	elif [ "$(PM)" = "yarn" ]; then \
		rm -f bun.lock bun.lockb pnpm-lock.yaml package-lock.json; \
	else \
		echo "Unsupported PM: $(PM)"; \
		exit 1; \
	fi
	@$(PM) install

run: ## Start Vite dev server.
	@$(RUN) dev

build: ## Build for production.
	@$(RUN) build

preview: ## Preview production build.
	@$(RUN) preview

lint: ## Run ESLint.
	@$(RUN) lint

format: ## Format with Prettier.
	@$(RUN) format

format-check: ## Check formatting with Prettier.
	@$(RUN) format:check

typecheck: ## Typecheck with tsc.
	@$(RUN) typecheck

test: ## Run Playwright tests.
	@$(RUN) test

check: ## Run format, lint, and typecheck.
	@clear
	@$(MAKE) install
	@$(MAKE) format
	@$(MAKE) lint
	@$(MAKE) typecheck

docker-build: ## Build production Docker image.
	@if docker image inspect $(DOCKER_IMAGE) >/dev/null 2>&1; then docker rmi -f $(DOCKER_IMAGE); fi
	@docker build -t $(DOCKER_IMAGE) .

docker-run: ## Run production Docker image.
	@docker run --rm -p $(DOCKER_PORT):80 $(DOCKER_IMAGE)
