# ADR-0003 – [Maintainability] Replace `react-toastify` with `sonner`

## Context/Forces

- **bundle weight & dependency tree**: `react-toastify` ships ≈ 536 kB unpacked and introduces one runtime dependency (`clsx`) plus twenty dev‑deps. Every extra package enlarges the audit surface and slows CI installs;
- **maintenance cadence**: the library’s last release was four months ago; issues are answered but turn‑around is moderate;
- **safer, lighter alternative**: `sonner` provides the same toast API with **zero** runtime dependencies and a 165 kB unpacked size. It has shipped four releases in the past month;
- **adoption signal**: despite fewer GitHub ⭐, weekly downloads (\~4.9 M) already surpass `react‑toastify` (\~2.3 M), hinting at growing community trust.

## Decision

We will **replace `react-toastify` with `sonner`** across the client code‑base.

### Evaluation & Security Checks

1. **Repository health**

   | Metric       | react‑toastify   | sonner       |
   | ------------ | ---------------- | ------------ |
   | Last release | 4 mo ago         | 11 d ago     |
   | Runtime deps | 1                | 0            |
   | Dev deps     | 20               | 9            |
   | Open issues  | active, moderate | active, fast |

2. **Vulnerability scan**
   `npm audit` reports **0 vulnerabilities** for both packages.

3. **Community metrics**

   | Metric           | react‑toastify | sonner  |
   | ---------------- | -------------- | ------- |
   | Weekly downloads | \~2.3 M        | \~4.9 M |
   | GitHub stars     | 12.9 k         | 6.4 k   |

4. **API compatibility test**  
   Swapped imports and parameters in our actual helper and App components, then manually verified all toast flows:

```diff
client/src/helpers/showToastMessage/index.tsx
-import { toast } from "react-toastify";
+import { toast } from "sonner";
-  toast(<span data-testid={`toast-${type}`}>{msg}</span>, { type });
+  toast(<span data-testid={`toast-${type}`}>{msg}</span>, { variant: type });
```

```diff
client/src/App.tsx
-import "react-toastify/dist/ReactToastify.css";
-import { ToastContainer } from "react-toastify";
+import { Toaster } from "sonner";
-      <ToastContainer
-        data-testid="toast-container"
-        position="top-right"
-        autoClose={3000}
-        hideProgressBar={false}
-        newestOnTop
-        closeOnClick
-        pauseOnHover
-        draggable
-        theme={toastTheme}
-      />
+      <Toaster
+        data-testid="toast-container"
+        containerStyle={{ top: 8, right: 8 }}
+        toastOptions={{ duration: 3000 }}
+      />
```

5. **Implementation tasks**

   1. `npm install sonner && npm uninstall react-toastify`
   2. Replace `<ToastContainer />` with `<Toaster />` in `App.tsx`.
   3. Update all `react-toastify` imports to `sonner`.
   4. Manually verify all notification flows.
   5. Commit `package.json`, lockfile, and code changes.

## Rationale

Choosing `sonner` yields a **smaller bundle**, **zero extra attack surface**, and faster upstream fixes. The migration is trivial and keeps the familiar toast API, so developer learning cost is negligible.

### Rejected alternatives

**Keep `react-toastify`**: no functional blockers today, but larger footprint and slower maintenance offer no long‑term advantage.

## Status

Proposed – 13.06.2025

## Consequences

Positive:

- bundle size 371 kB is smaller and one fewer runtime dependency;
- faster CI/CD because of lighter installs;
- simpler audits thanks to a trimmed dependency graph.

Negative / trade‑offs:

- potential for subtle behavioral differences in rare edge case;
- new library to learn.
