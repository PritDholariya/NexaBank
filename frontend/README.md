# NexaBank Frontend

This frontend uses Next.js App Router with a scalable, feature-first structure.

## Run Locally

This repository currently contains the NexaBank frontend built with Next.js.

## Frontend Setup

### 1. Go to the frontend app

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend will run locally at [http://localhost:3000](http://localhost:3000).

## Available Scripts

Run these commands from the `frontend/` directory:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4


## Notes

- The main landing page lives in `frontend/app/page.tsx`.
- Shared reusable UI components live in `frontend/components/`.
- The reusable landing-page navbar lives in `frontend/components/navbar.tsx`.


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
