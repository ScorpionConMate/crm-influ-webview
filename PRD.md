## PRD — CRM mobile para Influencers (Lugares) v2 (React 19 + Vite)

### Contexto

CRM pensado para influencers que colaboran con **lugares/marcas locales**. La UI **debe verse siempre mobile** (360–430px) porque se va a **embeber dentro de una app React Native** (WebView). En esta etapa **no** priorizamos la app RN, solo el “mobile web embebible”.

### Stack (obligatorio)

* **Frontend**: React 19 + Vite
* **UI**: shadcn/ui + Tailwind
* **State**: Zustand (stores por dominio)
* **Validación / Tipado runtime**: Zod
* **Routing**: TanStack Router

---

## Objetivo del producto

1. Centralizar **lugares**, **contactos** y **deals** en un **pipeline** simple.
2. Convertir visitas / check-ins en **seguimientos accionables** (notas, voice memo, resumen).
3. Tener **recordatorios** y **calendario/agenda** para no perder oportunidades.
4. Mantener una UX mobile consistente, rápida y operable con una mano.

---

## No-Objetivos (descartado explícitamente)

* Plantillas de mensajes
* Campos personalizados
* Propuesta PDF
* Brand Reports
* Integraciones (mail/whatsapp/calendar externo/webhooks, etc.)
* Agency multicreator (multi-tenant avanzado / múltiples creadores por cuenta)

---

## IA / Navegación principal (mobile shell)

**Layout fijo mobile**

* Contenedor centrado con `max-w-[430px]`, `min-w-[360px]` (tolerante), altura completa.
* “App chrome”: Top bar + Bottom tabs.
* Soporte de safe-area (padding inferior para iOS).

**Bottom Tabs (propuesta final, alineada a pantallas)**

1. **Home** (dashboard + próximos recordatorios)
2. **Pipeline** (deals por estado)
3. **Places** (lista unificada lugares/contactos + búsqueda)
4. **Calendar** (calendar + agenda)
5. **More** (perfil, settings, plan/upgrade)

Acciones globales:

* **FAB “+”** contextual (crear Place / Contact / Deal / Reminder / Check-in)

---

## Mapa de pantallas (según tus artifacts)

### Onboarding / Home

* `onboarding/influencer_crm_dashboard_1`
* `onboarding/influencer_crm_dashboard_2`
* `onboarding/upcoming_reminders_list`
* `onboarding/user_profile_&_settings`
* `onboarding/subscription_plans_&_limits`
* `onboarding/plan_limits_&_upgrade_status`

**Rol**

* Dashboard: pipeline snapshot, próximos recordatorios, atajos.
* Plan/limits: solo lectura + CTA upgrade (sin pasarela compleja por ahora).

---

### Places / Contacts (unificado)

* `places/places_&_contacts_unified_list`
* `places/filtered_places_list_view`
* `places/place_details_&_history`
* `places/add_new_place_1`
* `places/add_new_place_2`
* `places/places_empty_state`

y equivalente en `contact/*`:

* `contact/places_&_contacts_unified_list`
* `contact/filtered_places_list_view`
* `contact/place_details_&_history`
* `contact/add_new_contact`
* `contact/places_empty_state`

**Decisión clave**

* Mantener **vista unificada** “Places & Contacts” con filtros (segmented control):

  * All / Places / Contacts
* Detalle de Place muestra:

  * info principal + historial (deals, visits, notas, recordatorios asociados)
* Detalle de Contact:

  * info + lugares vinculados + deals + historial

---

### Pipeline (deals)

* `pipelines/collaboration_pipeline`
* `pipelines/deal_status_management`
* `pipelines/pipeline_empty_state`

**Estados (mínimo viable)**

* Lead
* Contacted
* Negotiation
* Confirmed
* Delivered
* Paid
* Lost

*(Configurable internamente, pero sin “custom fields”; solo estados y reason Lost opcional.)*

---

### New Deal (wizard)

* `new-deal/new_deal:_general_info`
* `new-deal/new_deal:_deliverables`
* `new-deal/new_deal:_payments_&_legal`
* `new-deal/new_deal:_review`

**Wizard en 4 pasos**

1. General info (place/contact, fechas tentativas, valor estimado, notas)
2. Deliverables (lista: tipo, cantidad, due date, status)
3. Payments & Legal (monto, moneda, método, invoice?, términos básicos)
4. Review (resumen + crear)

---

### Calendar / Agenda

* `calendar/calendar_&_agenda_view_1`
* `calendar/calendar_&_agenda_view_2`
* `calendar/calendar_empty_state`

**Eventos soportados (internos)**

* Reminders (seguimientos)
* Deal milestones (opcional: fecha de entrega / fecha de pago)
* Visits/check-ins (session)

---

### Check-in / Visit (visitas al lugar)

* `check-in/start_a_visit_check-in`
* `check-in/visit_notes_&_voice_memo_1`
* `check-in/visit_notes_&_voice_memo_2`
* `check-in/visit_reference_history`
* `check-in/visit_session_summary`

**Concepto**

* Una “Visit Session” vinculada a Place (y opcionalmente a Deal).
* Captura:

  * notas rápidas
  * voice memo (archivo)
  * referencias/historial (qué se hizo antes)
  * summary final (acciones siguientes + posibles recordatorios)

---

### Quick Reminder

* `quick-reminder/code.html + screen.png` (pantalla única)
  **Rol**
* Crear recordatorio rápido desde cualquier tab (FAB o shortcut en dashboard).

---

## Flujos principales

### 1) Alta y organización básica

* Home → “Add Place” → `add_new_place_1` → `add_new_place_2` → Place detail + history
* Home/Places → “Add Contact” → `add_new_contact` → Contact detail

**Regla**

* Place puede existir sin Contact; Contact puede vincularse a múltiples Places.

---

### 2) Crear Deal y mover en Pipeline

* Place detail → “New Deal” → wizard (4 pasos) → vuelve a Pipeline (estado inicial Lead/Negotiation según input)
* Pipeline → abrir deal → cambiar status (`deal_status_management`) → queda reflejado en:

  * Pipeline board/list
  * Place/Contact history
  * Calendar (si hay fechas)

---

### 3) Check-in (visita) y follow-up

* Place detail o Calendar → “Start visit” → `start_a_visit_check-in`
* Durante visita:

  * notas + voice memo (`visit_notes_&_voice_memo_*`)
  * ver historial (`visit_reference_history`)
* Cierre:

  * `visit_session_summary` sugiere “Next steps” + botón crear reminder (rápido)

---

### 4) Recordatorios y Calendar

* FAB → Quick reminder → asignar a Place/Contact/Deal → aparece:

  * Home (upcoming list)
  * Calendar agenda
  * historial en detalle correspondiente
* Completar reminder desde lista → queda en historial (no se borra)

---

### 5) Plan/limits (sin fricción)

* More → Plan & limits → ver límites + CTA upgrade
* Bloqueos suaves:

  * si excede límite, mostrar paywall ligero (sheet) y permitir cancelar

---

## Entidades y modelo mínimo (Zod-first)

### Entidades

* **User**
* **Place**
* **Contact**
* **Deal**
* **Deliverable** (child de Deal)
* **PaymentInfo** (child de Deal)
* **Reminder**
* **VisitSession** (con `notes[]`, `voiceMemoUrl?`, `summary`)
* **TimelineEvent** (vista unificada en “history”: deal updates, reminders, visits)

### Relaciones clave

* Place 1—N Deals
* Contact 1—N Deals (opcional, si el deal se gestiona con alguien específico)
* Place N—M Contacts (a través de tabla link simple)
* Deal 1—N Deliverables
* Place 1—N VisitSessions
* Reminder puede linkear a Place/Contact/Deal (uno o varios)

---

## Stores (Zustand)

* `authStore`: sesión, user, gating de plan
* `placesStore`: lista, filtros, detalle, links a contactos
* `contactsStore`: lista, filtros, detalle
* `dealsStore`: pipeline, deal detail, wizard draft
* `calendarStore`: eventos internos (reminders + milestones + visits)
* `remindersStore`: CRUD + completado
* `visitsStore`: sesión activa, upload voice memo, resumen

---

## Validación (Zod) y UX de forms

* Cada form step del wizard usa:

  * `schemaStep1.parse()`, etc.
* Modo mobile:

  * inputs grandes
  * bottom sheet para selectores
  * confirmaciones con toast + undo cuando aplique (ej: “mark reminder done”)

---

## Estados vacíos y edge cases (ya contemplados en artifacts)

* `places_empty_state`
* `pipeline_empty_state`
* `calendar_empty_state`

Edge cases necesarios:

* Crear Deal sin Contact asignado (solo Place)
* Contact sin Place asignado
* Reminder sin entidad (personal)
* Visit sin Deal asociado
* Manejo de borrado (soft delete recomendado) para no romper history

---

## Checklist de Tasks (implementación)

## Tasks — Base app shell (mobile embed)

* [ ] setup Vite + React 19 + Tailwind + shadcn
* [ ] create mobile shell layout (max width, safe-area, bottom tabs, top bar)
* [ ] routing (tabs + nested routes) + transitions mobile (sheet/drawer)
* [ ] add global FAB (+) with contextual actions

## Tasks — Auth (decisión previa)

* [ ] create auth screens (login, magic link / oauth opcional)
* [ ] persist session + guarded routes
* [ ] logout flow in settings

## Tasks — Home / Onboarding

* [ ] dashboard v1 (KPIs: deals by status + upcoming reminders)
* [ ] upcoming reminders list (mark done + open entity)
* [ ] plan limits & upgrade status (UI + gating)
* [ ] subscription plans & limits screen (UI-only por ahora)
* [ ] user profile & settings

## Tasks — Places & Contacts (unificado)

* [ ] unified list (Places/Contacts) + search + filters
* [ ] place empty state
* [ ] add new place (2-step form) + validation zod
* [ ] place detail & history timeline
* [ ] add new contact + link a place(s)
* [ ] contact detail & history timeline

## Tasks — Pipeline (Deals)

* [ ] pipeline board/list (collaboration pipeline)
* [ ] deal status management (change status, lost reason opcional)
* [ ] pipeline empty state
* [ ] deal detail view (resumen + deliverables + payments + history)

## Tasks — New Deal Wizard

* [ ] step 1: general info (place/contact selection)
* [ ] step 2: deliverables CRUD
* [ ] step 3: payments & legal (simple)
* [ ] step 4: review + create
* [ ] persist wizard draft in zustand (recover si se cierra)

## Tasks — Calendar & Agenda

* [ ] calendar + agenda view (toggle)
* [ ] calendar empty state
* [ ] map internal events (reminders, deal dates, visits) to calendar store
* [ ] day detail / agenda interactions (open entity, create reminder)

## Tasks — Check-in / Visits

* [ ] start a visit (select place, optional deal)
* [ ] visit notes + voice memo (storage adapter)
* [ ] visit reference history (timeline)
* [ ] visit session summary + create reminder CTA

## Tasks — Quick Reminder

* [ ] quick reminder screen/sheet
* [ ] link reminder to place/contact/deal
* [ ] surface reminders in home + calendar + history