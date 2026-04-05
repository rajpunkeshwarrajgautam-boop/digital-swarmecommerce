## KEY ARCHITECTURE & LOGIC (MILESTONE 12)

### 📊 SWARM ANALYTICS ENGINE (12.1)
- **Service**: `src/lib/analytics.ts` for "Swarm Score" calculations.
- **Metrics**: Treasury velocity, community consensus (DAO), and artifact activity.
- **Pulse**: Integrated into `/dao` with HSL-styled real-time synchronization dashboards.

### 🌉 CROSS-SWARM BRIDGING (12.2)
- **Protocol**: HMAC-SHA256 signed manifests for asset movement between Digital Swarm nodes.
- **Tunelling**: `/api/bridge` handling secure export/import with cryptographic signatures.
- **Registry**: `bridge.ts` ensures manifest integrity via `timingSafeEqual`.

### 🌌 NEURAL SYNTHETICS (12.3)
- **Auras**: Dynamic atmospheric metadata (e.g., RADIATING_ALPHA) based on performance scores.
- **Hue Sync**: Global HSL `--primary-hue` shift controlled by treasury velocity via `SwarmHueSync.tsx`.
- **UI**: Marketplace `ProductCard` displaying match-density and aura glow.

## DESIGN LANGUAGE (PRO MAX)
- **Colors**: HSL `142, 70%, 45%` (Atomic Green) / `199, 89%, 48%` (Neural Blue).
- **Global**: Dynamic Hue Synchronization between 142 (Green) and 200 (Blue).
- **Consistency**: High-fidelity dark mode with holographic glow accents.

## PROJECT STATUS: MILESTONE 12 COMPLETE
The platform is now a self-evolving, interconnected digital nation with autonomous analytics and cross-node asset tunneling.

*Memory Synced: 2026-04-03*
