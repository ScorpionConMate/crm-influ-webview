# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Available Skills

---
Use these skills for detailed patterns on-demand:

### Generic Skills (Any Project)

|Skill|Description|URL|
|---|---|---|
|`typescript`|Const types, flat interfaces, utility types|[SKILL.md](.opencode/skills/typescript/SKILL.md)|
|`react-19`|No useMemo/useCallback, React Compiler|[SKILL.md](.opencode/skills/react-19/SKILL.md)|
|`tailwind-4`|cn() utility, no var() in className|[SKILL.md](.opencode/skills/tailwind-4/SKILL.md)|
|`playwright`|Page Object Model, MCP workflow, selectors|[SKILL.md](.opencode/skills/playwright/SKILL.md)|
|`zod-4`|    New API (z.email(), z.uuid())|[SKILL.md](.opencode/skills/zod-4/SKILL.md)|
|`zustand-5`|Persist, selectors, slices|[SKILL.md](.opencode/skills/zustand-5/SKILL.md)|
|`ui-ux-pro-max`| UI/UX design intelligence (50 styles, 21 palettes, 50 font pairings, 20 charts, 9 frameworks)| [SKILL.md](.opencode/skills/ui-ux-pro-max/SKILL.md)|
|`task-management`|Task management CLI for tracking and managing feature subtasks with status, dependencies, and validation|[SKILL.md](.opencode/skills/task-management/SKILL.md)|

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Creating Zod schemas | `zod-4` |
| Using Zustand stores | `zustand-5` |
| Working with Tailwind classes | `tailwind-4` |
| Writing Playwright E2E tests | `playwright` |
| Writing React components | `react-19` |
| Writing TypeScript types/interfaces | `typescript` |

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (runs TypeScript compilation + Vite build)
npm run build

# Run ESLint linting
npm run lint

# Preview production build
npm run preview

# TypeScript type checking (run separately from build)
npx tsc --noEmit
```

Note: This project does not currently have a test framework configured. When adding tests, set up Vitest or similar.

## Tech Stack

- **React 19.2** with TypeScript 5.9
- **Vite 7.2** as build tool
- **Tailwind CSS 4.1** with Tailwind v4 plugin
- **shadcn/ui** components (radix-vega style)
- **Lucide React** for icons
- **class-variance-authority** for component variants
- **ESLint 9** with TypeScript ESLint, React Hooks, React Refresh plugins

## Code Style Guidelines

### Import Style

- Use named imports for UI components: `import { Button } from "@/components/ui/button"`
- Import React with namespace in components: `import * as React from "react"`
- Use `@/` alias for all src imports (configured in vite.config.ts and tsconfig.json)
- Group imports logically: third-party → internal UI → components → hooks → utils → icons
- Import multiple named items from same module on single line

### Component Patterns

- Use named exports: `export function ComponentName() {}`
- Main component file (e.g., App.tsx) should also have default export: `export default App;`
- Components are functional, use React 19 patterns
- Use `data-slot` attribute pattern for polymorphic components (e.g., with Radix Slot)
- Use data attributes like `data-variant`, `data-size`, `data-icon` for styling hooks

### TypeScript

- Strict mode enabled (tsconfig.json:20)
- Use `type` keyword for type aliases: `type Props = { ... }`
- For native element props, use `React.ComponentProps<"element">` spread pattern
- For variant components, use `VariantProps<typeof variantFunction>` from class-variance-authority
- Use `as const` for readonly arrays: `const items = ["a", "b"] as const`
- Avoid `any` - prefer `unknown` for truly unknown data

### Styling (Tailwind CSS)

- Use `cn()` utility from `@/lib/utils` for dynamic className merging
- Use class-variance-authority (cva) for component variants with typed props
- All CSS is utility-first - no custom CSS files except src/index.css
- Use CSS variables (configured with cssVariables: true in components.json)
- Base color is neutral
- Do not use `var()` in className - Tailwind handles CSS variables internally

### Naming Conventions

- Components: PascalCase (`Button`, `AlertDialogContent`)
- Functions: camelCase (`handleClick`, `cn`)
- Constants: camelCase for local consts, UPPER_SNAKE_CASE for module-level exports
- Icons: `IconNameIcon` pattern from Lucide (`PlusIcon`, `BluetoothIcon`)
- Files: kebab-case for UI components (`alert-dialog.tsx`), PascalCase for feature components

### File Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives (button, card, input, etc.)
│   └── *.tsx         # feature components
├── lib/
│   └── utils.ts      # utility functions (cn, etc.)
├── main.tsx          # entry point
├── App.tsx           # root component
└── index.css         # global styles + CSS variables
```

### Error Handling

- TypeScript strict mode catches most issues at compile time
- ESLint configured with recommended rules for React, TypeScript, and Hooks
- Run `npm run lint` before committing changes
- Fix all ESLint errors and TypeScript errors

### Component Props

- Destructure props directly in function signature
- Use rest pattern `...props` to forward remaining attributes
- For variant components, spread variant props and merge className:

```typescript
function Button({ className, variant = "default", size = "default", ...props }: Props) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

### State Management

- Use `React.useState` for local component state
- Current codebase doesn't use global state - if adding it, prefer Zustand 5

### Forms

- Use native HTML form elements wrapped in shadcn/ui Field components
- For selects with large datasets, use Combobox from shadcn/ui
- Input components should have `id` and associated labels via `htmlFor`

### Accessibility

- Use Radix UI primitives (Base UI in this project) for accessible components
- Include `aria-label`, `sr-only` text, and proper semantic HTML
- Icons should have descriptive text or be marked decorative

## Linting Rules

- ESLint ignores `dist` directory
- Extends: ESLint recommended, TypeScript ESLint recommended, React Hooks recommended, React Refresh
- No explicit test commands - add test setup if needed

## When Adding New Features

1. Create UI components in `src/components/ui/` if they're reusable primitives
2. Create feature components in `src/components/` if they're app-specific
3. Use existing shadcn/ui components from registry when possible
4. Follow the established patterns in button.tsx for variant components
5. Import utilities and components from `@/lib/utils` and `@/components/ui/*`
6. Always run `npm run lint` after making changes
7. Ensure TypeScript compiles with `npm run build` or `npx tsc --noEmit`
