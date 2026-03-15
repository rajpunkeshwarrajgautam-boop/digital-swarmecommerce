# Rule: Coding Style (AntiGravity Standard)

## Description

Enforce standard coding practices aligned with Antigravity v4.2.1 standards.

## Scope

**/*.{js,ts,jsx,tsx,py,css}

## Guidelines

1. **Clean Code**: Keep components small (< 150 lines) and functions focused.
2. **Performance**: Use React.memo, useMemo, and useCallback where appropriate. Avoid unnecessary re-renders.
3. **Styling**: Always use CSS Variables and HSL colors. Transition everything for a "smooth" feel.
4. **Error Handling**: Every API route and complex function must have a try-catch block with meaningful error logging.
5. **Documentation**: Add TSDoc/JSDoc for all public exports.
