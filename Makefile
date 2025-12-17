.PHONY: run
run:
	@pnpm dev

.PHONY: check
check:
	@clear && pnpm i && pnpm format && pnpm lint && pnpm exec tsc -b