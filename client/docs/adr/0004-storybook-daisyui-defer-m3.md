# ADR-0004 – [Architecture] Adopt Storybook for DaisyUI and Defer M3 Migration

## Context/Forces

The assigned task requires exploring Material 3 (M3) design system and implementing Storybook for a documented component library. However, the application is fully functional with a productive DaisyUI + Tailwind CSS stack that meets current needs.

A direct task implementation would mean building custom M3 components from scratch and replacing the working DaisyUI system. This presents architectural friction: a high-cost migration versus immediate value from our current, functional UI.

We have two distinct needs that shouldn't be conflated:

- improving our _development process_ (with Storybook)
- potentially upgrading our _design system_ (with M3)

The proposal decouples these needs to deliver value without prohibitive costs. We want to avoid the "Frankenstein UI" problem of mixing design systems while maintaining development velocity.

## Decision

We will execute the assigned task with a pragmatic modification that prioritizes process improvement over disruptive redesign:

1. **M3 Investigation as Proof-of-Concept**

   Complete the research portion using **Figma Material Theme Builder** to generate a custom M3 theme. The resulting `theme.css` will be committed as a proof-of-concept artifact, but **these styles will not be implemented** in the main application.

2. **Storybook Adoption**

   Install and configure **Storybook** as the primary environment for UI component development and documentation.

3. **Document Existing Components**

   Instead of creating new M3 components, use Storybook to create stories for our **existing, commonly used DaisyUI-based components**.

This approach fulfills the spirit of the task—learning M3 and implementing Storybook—while making a conscious architectural decision to avoid costly migration at this time.

## Rationale

Delivers the most valuable parts of the task with lowest risk and effort:

**Immediate process improvement**: we gain the primary benefits of Storybook—isolated development, documentation, and easier testing—immediately, addressing a key process weakness without being blocked by a full UI rewrite.

**De-risking the M3 migration**: treating the M3 theming work as separate proof-of-concept completes the research portion while consciously deferring high-cost implementation. This avoids the "Frankenstein UI" problem and allows a separate decision about full migration when the need is greater.

**Pragmatism over purity**: the current DaisyUI system is "good enough" for the application's current stage. This decision prioritizes maintaining feature velocity over achieving architectural purity at high opportunity cost.

### Rejected alternatives

**Full M3 migration (per original task)**: rejected due to unfavorable cost/benefit ratio and significant negative impact on development velocity from replacing a working UI system.

**Do nothing**: rejected because it fails to deliver on the task's core requirement to improve development process by introducing a component catalog via Storybook.

## Status

Accepted – 14.07.2025

## Consequences

Positive:

- **task completion**: the primary goals (M3 research, Storybook implementation) are achieved;
- **improved maintainability**: the project gains an interactive catalog of its _current_ UI components, improving developer onboarding;
- **preserved velocity**: development speed is maintained as no rewrite is required;
- **future-ready**: a designed and validated M3 theme exists as an artifact, ready for potential future migration.

Negative/Trade-offs:

- **deferred UI upgrade**: the application's UI will not be upgraded to the more professional M3 aesthetic at this time;
- **dependency formalization**: the new Storybook library will document and formalize our dependency on DaisyUI, rather than moving us away from it.

Overall, this adjustment delivers high-value process improvements while avoiding architectural disruption.
