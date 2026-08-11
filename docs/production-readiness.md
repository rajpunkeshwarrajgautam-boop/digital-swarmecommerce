# Production readiness

Digital Swarm production releases are expected to pass the repository Quality Gate before promotion.

The gate currently verifies:

- production dependency audit at high/critical severity
- ESLint
- Vitest unit tests
- optimized Next.js production build
- Chromium commerce E2E
- WebKit commerce E2E
- Lighthouse CI

Production commerce principles:

- product pricing and availability are validated server-side
- paid digital assets are delivered through private, expiring links
- Cashfree webhooks are signature-validated and idempotent
- destructive catalog maintenance is not exposed through public mutation routes
- product and marketing claims should be factual and traceable to implemented behavior

Operational note: do not treat browser tests as a live-money payment test. A real gateway transaction should only be run intentionally with a controlled order and reconciliation plan.
