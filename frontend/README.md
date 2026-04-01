# NexaBank Frontend

This frontend uses Next.js App Router with a scalable, feature-first structure.

## Run Locally

```bash
npm run dev
```

## Folder Structure

```txt
frontend/
	app/
		(marketing)/
			layout.tsx
			page.tsx
			about/
				page.tsx
			contact/
				page.tsx
		globals.css
		layout.tsx
		page.tsx

	components/
	features/
	lib/
	services/
	hooks/
	store/
	types/
	constants/
	styles/
	config/
	tests/
	public/
```

## What Goes Where

- `app/`: Route files, layouts, loading/error boundaries, and route composition.
- `components/`: Shared reusable UI building blocks.
- `features/`: Domain modules (auth, accounts, transactions, cards, loans, etc.).
- `lib/`: Shared helpers and technical utilities.
- `services/`: External integration and service adapter logic.
- `hooks/`: Cross-feature reusable React hooks.
- `store/`: Global state management setup.
- `types/`: Shared TypeScript types and interfaces.
- `constants/`: App-wide constants and enum-like values.
- `styles/`: Design tokens and style resources.
- `config/`: Static app configuration modules.
- `tests/`: Integration and e2e test organization.

## Conventions

- Keep route files in `app/` thin and move domain logic to `features/`.
- Prefer Server Components; add `"use client"` only when needed.
- Keep generic UI in `components/` and domain UI in `features/<domain>/components`.
