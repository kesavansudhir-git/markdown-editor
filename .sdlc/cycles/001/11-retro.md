---
stage: 12-retro
cycle: 001
project: Markdown Editor
created: 2026-05-05
status: COMPLETE
gate: N/A
constitution-version: 1
---

# Retrospective — Cycle 001

## What Went Well
- Adopting a spec-driven development framework from the start produced noticeably better output — requirements were clearer, implementation was more focused, and deviations were caught early by the pipeline gates.
- The SDLC framework naturally generalised beyond this project; it felt like an overarching engineering discipline rather than a project-specific scaffold.

## What Went Poorly
- Core app features (File open, Save, Close) were not identified during the Specify or Clarify stages. They were discovered mid-cycle after the user experienced the app, requiring out-of-pipeline implementation and a retroactive cycle 002 effort.

## Surprises
- How naturally and quickly the spec-driven framework became a general-purpose habit. The expectation was that it would feel heavyweight for an MVP; in practice it accelerated delivery and caught issues (XSS coverage, branch coverage, CSS variable limitation) that would have been discovered much later.

## Root Cause Analysis
**Missing features (File/Open/Close/Save) surfaced too late:**
Root cause — the Clarify and Analyse stages focused on refining stated requirements rather than validating the user journey end-to-end. No one asked "what happens when the user is done editing?" A low-fidelity UI mockup or a step-through of the user journey would have surfaced these gaps before planning began.

## Action Items
| ID | Action | Target Cycle |
|---|---|---|
| ACTION-001 | Add a UI/UX Validation step to the SDLC pipeline between Analyse and Tasks — create a low-fidelity mockup and walk the user journey to identify missing interactions before planning | 002 |
| ACTION-002 | In future Clarify stages, explicitly ask: "Walk me through a complete session — what does the user do from opening the app to closing it?" | 002 |

## Constitution Amendment Proposals
**Proposed: Add Stage 05.5 — UI/UX Validation** (between Analyze and Tasks)

- Create a low-fidelity wireframe or ASCII mockup of all screens/states the user will interact with.
- Walk the user journey from first open to last action (open file → edit → save → close).
- Compare the journey against the spec's acceptance criteria and identify any missing interactions or states.
- Any gaps found must be fed back as spec amendments before planning proceeds.

This stage has no human gate but its output (a `05-ui-validation.md` artefact) is a prerequisite for Tasks.

**Rationale:** Cycle 001 shipped without File, Edit, and Close operations because no one modelled the full user session before implementation. A 30-minute mockup exercise would have caught these gaps at the cheapest possible point in the pipeline.

## SDLC Framework Improvement Proposals
- The pipeline should prompt the Clarify stage to always include a "user journey walkthrough" question, not just edge-case questions about stated requirements. The goal is to discover unstated requirements before they become mid-cycle surprises.
