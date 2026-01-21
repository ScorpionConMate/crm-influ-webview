# Task Context: Multi-Feature Implementation Coordination

Session ID: task-manager-implementation-coordination
Created: 2025-01-21
Status: in_progress

## Current Request
Coordinate and execute the implementation of all pending feature modules in `.tmp/tasks/`:
- Group A: Places & Contacts (places-contacts)
- Group B: Pipeline & Deals (pipeline-deals)
- Group D: Calendar & Agenda (calendar-agenda)
- Group E: Check-in/Visit Flow (checkin-visit)
- Group F: Quick Reminder (quick-reminder)

All task.json and subtask_NN.json files are already created in `.tmp/tasks/{feature}/` directories.

## Requirements
- Execute tasks in dependency order (see dependencies section)
- Track progress of all subtasks across all features
- Ensure code quality standards are followed
- Validate each subtask completion (lint, typecheck)
- Report completion status and next steps after each subtask
- Handle failures by stopping and reporting (no auto-fixing)

## Feature Dependencies

### Dependency Chain
```
Group A (places-contacts) → Group B (pipeline-deals) → Group D (calendar-agenda)
                                        ↓
                                 Group E (checkin-visit)
                                        ↓
                                 Group F (quick-reminder)
```

**Detailed Dependencies:**
- **checkin-visit** (Group E) depends on: places-contacts (Group A)
- **quick-reminder** (Group F) depends on: places-contacts (Group A), pipeline-deals (Group B)
- **calendar-agenda** (Group D) depends on: remindersStore, visitsStore, dealsStore (all exist)
- **pipeline-deals** (Group B) has no dependencies
- **places-contacts** (Group A) has no dependencies

**Recommended Execution Order:**
1. places-contacts (Group A) - 10 subtasks, no dependencies
2. pipeline-deals (Group B) - 9 subtasks, no dependencies
3. [Parallel] calendar-agenda (Group D) - 9 subtasks, stores exist
   [Parallel] checkin-visit (Group E) - 7 subtasks, depends on A
4. quick-reminder (Group F) - 5 subtasks, depends on A and B

## Task Status Overview

### places-contacts (Group A) - Status: completed ✅
- 10 subtasks total, 10 completed
- Location: `.tmp/tasks/places-contacts/`
- Estimated: Medium complexity
- Priority: High (blocks multiple features)

### pipeline-deals (Group B) - Status: pending
- 9 subtasks total, 0 completed
- Location: `.tmp/tasks/pipeline-deals/`
- Estimated: 16 hours
- Priority: High

### calendar-agenda (Group D) - Status: pending
- 9 subtasks total, 0 completed
- Location: `.tmp/tasks/calendar-agenda/`
- Estimated: 2 days
- Priority: Medium
- Can start in parallel with checkin-visit

### checkin-visit (Group E) - Status: pending
- 7 subtasks total, 0 completed
- Location: `.tmp/tasks/checkin-visit/`
- Estimated: 16 hours
- Priority: High
- Requires: places-contacts (Group A)

### quick-reminder (Group F) - Status: pending
- 5 subtasks total, 0 completed
- Location: `.tmp/tasks/quick-reminder/`
- Estimated: 1 day
- Priority: Medium
- Requires: places-contacts (Group A), pipeline-deals (Group B)

## Files to Modify/Create

### Common Patterns Across All Features
- **Components**: src/components/{feature}/ - kebab-case naming
- **UI Components**: src/components/ui/ - shadcn/ui primitives
- **Stores**: src/stores/*Store.ts - Zustand 5 patterns
- **Schemas**: src/lib/zod/schemas.ts - Zod 4 validation
- **Utils**: src/lib/utils.ts - helpers (cn(), etc.)
- **Router**: src/router/index.tsx - navigation

### Per Feature

**places-contacts:** ✅ COMPLETED
- Update: src/stores/placesStore.ts, src/stores/contactsStore.ts
- Update: src/lib/zod/schemas.ts
- Create: src/components/places/*.tsx, src/components/contacts/*.tsx
- Create: Timeline component
- Routes added to src/router/index.tsx

**pipeline-deals:**
- Update: src/stores/dealsStore.ts
- Create: DealDetail.tsx, DealStatusPicker.tsx
- Update: Pipeline.tsx

**calendar-agenda:**
- Create: src/stores/calendarStore.ts
- Create: src/lib/calendar/eventTypes.ts, src/lib/calendar/eventMapper.ts
- Create: CalendarView.tsx, AgendaView.tsx, DayDetail.tsx
- Update: Calendar.tsx

**checkin-visit:**
- Update: src/stores/visitsStore.ts
- Create: src/lib/voiceMemoStorage.ts (IndexedDB)
- Create: StartVisit.tsx, VisitNotes.tsx, VisitHistory.tsx, VisitSummary.tsx
- Update: src/router/index.tsx

**quick-reminder:**
- Create: src/components/ui/dialog.tsx (shadcn)
- Update: src/stores/remindersStore.ts
- Create: QuickReminder.tsx, EntitySelector.tsx

## Static Context Available

### Code Standards
- **Location**: .opencode/context/core/standards/code-quality.md
- **Key Principles**:
  - Pure functions, immutability, composition
  - Modular design (< 100 lines per component)
  - Explicit dependencies (dependency injection)
  - Small functions (< 50 lines)
  - Validate at boundaries
  - Error handling with explicit success/error returns

### Project Standards
- **Location**: AGENTS.md
- **Tech Stack**: React 19.2, TypeScript 5.9, Vite 7.2, Tailwind CSS 4.1, Zustand 5, Zod 4
- **Import Style**: `@/` alias, named imports, grouped logically
- **Component Patterns**: Named exports, functional, React 19 patterns
- **TypeScript**: Strict mode, `type` keyword, avoid `any`
- **Styling**: cn() utility, cva for variants, CSS variables
- **Naming**: PascalCase components, camelCase functions, kebab-case files

### Skills to Auto-Invoke
- `typescript` - for type definitions
- `react-19` - for React components (no useMemo/useCallback)
- `tailwind-4` - for styling (cn() utility)
- `zod-4` - for schema validation
- `zustand-5` - for store patterns (persist, selectors, slices)
- `ui-ux-pro-max` - for UI/UX design decisions

## Constraints/Notes

### Critical Rules
1. **STOP on test fail/errors** - NEVER auto-fix
2. **Report first** - On fail: REPORT → PROPOSE FIX → REQUEST APPROVAL → FIX
3. **Context loading** - Load code-quality.md before executing any code changes
4. **Validation** - Run `npm run lint` and `npx tsc --noEmit` after each subtask

### Project Structure
- Working directory: /home/scorpion/www/crm-influ-webview
- Git repo: yes
- Platform: linux

### Development Commands
```bash
npm run dev          # Start dev server
npm run build        # TypeScript + Vite build
npm run lint         # ESLint linting
npx tsc --noEmit     # TypeScript type check
npm run preview      # Preview production build
```

### No Test Framework
- This project does not have a test framework configured
- Manual testing required (run dev server and verify functionality)
- Add test setup if needed (Vitest recommended)

## Progress

### Phase 1: Foundation (Dependencies Met)
- [x] places-contacts (Group A) - 10 subtasks ✅ COMPLETED
  - [x] subtask_01 - ✅ Completed
  - [x] subtask_02 - ✅ Completed
  - [x] subtask_03 - ✅ Completed
  - [x] subtask_04 - ✅ Completed
  - [x] subtask_05 - ✅ Completed
  - [x] subtask_06 - ✅ Completed
  - [x] subtask_07 - ✅ Completed
  - [x] subtask_08 - ✅ Completed
  - [x] subtask_09 - ✅ Completed
  - [x] subtask_10 - ✅ Completed

### Phase 2: Core Features (Can Parallel)
- [ ] pipeline-deals (Group B) - 9 subtasks
  - [ ] subtask_01
  - [ ] subtask_02
  - [ ] subtask_03
  - [ ] subtask_04
  - [ ] subtask_05
  - [ ] subtask_06
  - [ ] subtask_07
  - [ ] subtask_08
  - [ ] subtask_09

- [ ] calendar-agenda (Group D) - 9 subtasks
  - [ ] subtask_01_create_calendar_store
  - [ ] subtask_02_create_event_types_and_mapper
  - [ ] subtask_03_create_calendar_view_month
  - [ ] subtask_04_create_agenda_view
  - [ ] subtask_05_create_day_detail_component
  - [ ] subtask_06_update_calendar_toggle_integration
  - [ ] subtask_07_implement_empty_state
  - [ ] subtask_08_add_navigation_and_controls
  - [ ] subtask_09_integrate_stores_and_test

- [ ] checkin-visit (Group E) - 7 subtasks
  - [ ] subtask_01
  - [ ] subtask_02
  - [ ] subtask_03
  - [ ] subtask_04
  - [ ] subtask_05
  - [ ] subtask_06
  - [ ] subtask_07

### Phase 3: Integration (After A and B)
- [ ] quick-reminder (Group F) - 5 subtasks
  - [ ] subtask_01
  - [ ] subtask_02
  - [ ] subtask_03
  - [ ] subtask_04
  - [ ] subtask_05

---

## Instructions for TaskManager

### Your Role
You are the TaskManager, responsible for coordinating the implementation of all feature modules in `.tmp/tasks/`. Your job is to:

1. **Read all task.json and subtask_NN.json files** to understand the full scope
2. **Determine optimal execution order** based on dependencies
3. **Track progress** of all subtasks across all features
4. **Coordinate subtask execution** either by delegating to CoderAgent or executing directly
5. **Validate each subtask** with lint and typecheck commands
6. **Report status** after each subtask completion
7. **Handle failures** by stopping and proposing fixes (never auto-fix)

### Execution Strategy

**Phase 1: Sequential Execution**
1. Start with **places-contacts (Group A)** - no dependencies, high priority
2. Execute subtasks 01-10 sequentially
3. Validate each subtask with `npm run lint` and `npx tsc --noEmit`

**Phase 2: Parallel Execution**
After Group A completes, start parallel execution:
- **pipeline-deals (Group B)** - subtasks 01-09
- **calendar-agenda (Group D)** - subtasks 01-09
- **checkin-visit (Group E)** - subtasks 01-07

**Phase 3: Final Integration**
- **quick-reminder (Group F)** - subtasks 01-05 (depends on A and B)

### Subtask Execution Flow

For each subtask:

1. **Read the subtask JSON file** to understand requirements
2. **Load code-quality.md** (already loaded, keep it handy)
3. **Determine execution approach**:
   - Simple, isolated subtask → Execute directly
   - Complex subtask with multiple files → Delegate to CoderAgent
4. **Execute the subtask**:
   - Create/modify files as specified
   - Follow code standards (pure functions, immutability, modular design)
   - Use project patterns (React 19, Zustand 5, Zod 4, Tailwind 4)
5. **Validate the subtask**:
   - Run `npm run lint` - must pass
   - Run `npx tsc --noEmit` - must pass
   - If validation fails: STOP, REPORT error, PROPOSE fix, REQUEST approval before fixing
6. **Update progress** in this context file
7. **Report completion** with:
   - Files created/modified
   - Validation results
   - Next subtask to execute

### Validation Requirements

After each subtask:
```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit
```

**On Failure:**
- STOP immediately
- Report the error with full details
- Propose a fix approach
- Request approval before applying any fix
- After approval, apply fix and re-validate

### Error Handling Rules

1. **Never auto-fix** - Always report and request approval
2. **Report format**:
   ```
   ❌ Validation Failed
   - Error: {error message}
   - Location: {file:line}
   - Proposed Fix: {suggested fix}
   - Approval required before proceeding
   ```

3. **Stop criteria**:
   - Lint errors
   - TypeScript errors
   - Missing dependencies
   - Test failures (when tests are added)

### Communication Style

- **Brief updates**: "Completed subtask_01 for places-contacts - 3 files created, validation passed"
- **Error reports**: Clear, detailed error information + proposed fix
- **Next steps**: Always indicate what comes next
- **Progress tracking**: Update the progress section in this context file

### Expected Return

After each feature or significant milestone, report:
- Completed subtasks (count)
- Files created/modified
- Validation status
- Next recommended action

When all features are complete, provide a final summary with:
- Total subtasks completed
- Total files created/modified
- Any issues encountered and resolved
- Recommended next steps (testing, deployment, etc.)

### Session Management

This is a long-running coordination task. You should:
- Maintain state in this context file
- Update progress as you go
- Continue until all subtasks are complete or critical errors occur
- Report completion when all 5 features are implemented

---

## Available Skills Reference

When executing subtasks, invoke these skills automatically:

| Action | Skill | Purpose |
|--------|-------|---------|
| Creating Zod schemas | `zod-4` | New API patterns (z.email(), z.uuid()) |
| Using Zustand stores | `zustand-5` | Persist, selectors, slices |
| Writing React components | `react-19` | No useMemo/useCallback, React Compiler |
| TypeScript types | `typescript` | Const types, flat interfaces, utility types |
| Tailwind styling | `tailwind-4` | cn() utility, no var() in className |
| UI/UX decisions | `ui-ux-pro-max` | Design intelligence for components |

---

**START EXECUTION**: Begin with places-contacts subtask_01 and proceed according to the dependency chain.
