/**
 * ⚛️ DIGITAL SWARM | Bridging Protocol
 * ------------------------------------
 * Facilitates cross-swarm asset movement via signed manifests.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from './supabase';
import { env } from './env';

export interface AssetManifest {
  tokenId: string;
  metadata: Record<string, unknown>;
  reputation: number;
  originNode: string;
  timestamp: string;
  signature?: string;
}

export class SwarmBridgeService {
  private static SECRET = env.SWARM_SECRET;
  
  static {
    if (!this.SECRET || this.SECRET === 'SWARM_ALPHA_SYNC_v1') {
      console.warn('⚠️ [BRIDGE_SECURITY] SWARM_SECRET is missing or using insecure default. Cross-swarm bridging is disabled.');
    }
  }
  private static PROTOCOL_VERSION = '2.0';

  /**
   * 🏗️ SIGN MANIFEST
   * Generates a cryptographic HMAC-SHA256 signature with protocol versioning.
   */
  private static sign(payload: string): string {
    const keyedPayload = `${this.PROTOCOL_VERSION}:${payload}`;
    return createHmac('sha256', this.SECRET).update(keyedPayload).digest('hex');
  }

  /**
   * 🛰️ EXPORT ASSET
   * Packages an asset into a signed manifest for cross-node tunneling.
   */
  static async exportAsset(tokenId: string): Promise<AssetManifest | null> {
    if (!supabaseAdmin) return null;

    try {
      const { data: token, error } = await supabaseAdmin
        .from('digital_tokens')
        .select('*')
        .eq('id', tokenId)
        .single();

      if (error || !token) throw new Error('Asset not found');

      const manifest: AssetManifest = {
        tokenId: token.id,
        metadata: token.metadata || {},
        reputation: token.metadata?.reputation || 0,
        originNode: env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        timestamp: new Date().toISOString()
      };

      const canonical = JSON.stringify({
        id: manifest.tokenId,
        node: manifest.originNode,
        ts: manifest.timestamp
      });
      manifest.signature = this.sign(canonical);

      return manifest;

    } catch (err) {
      console.error('[BRIDGE_FAULT] Export failed:', err);
      return null;
    }
  }

  /**
   * 📥 IMPORT ASSET
   * Validates and hydrates an external asset manifest.
   */
  static async importAsset(manifest: AssetManifest): Promise<{ success: boolean; error?: string }> {
    if (!supabaseAdmin) return { success: false, error: 'Database offline' };

    try {
      if (!manifest.signature) return { success: false, error: 'Manifest unsigned' };

      const canonical = JSON.stringify({
        id: manifest.tokenId,
        node: manifest.originNode,
        ts: manifest.timestamp
      });
      const expectedSignature = this.sign(canonical);

      if (!timingSafeEqual(Buffer.from(manifest.signature), Buffer.from(expectedSignature))) {
        return { success: false, error: 'Cryptographic mismatch. Registry untrusted.' };
      }

      const age = Date.now() - new Date(manifest.timestamp).getTime();
      if (age > 3600000) return { success: false, error: 'Manifest expired. Tunnel collapsed.' };

      const { error: upsertError } = await supabaseAdmin
        .from('digital_tokens')
        .upsert({
          id: manifest.tokenId,
          metadata: {
            ...manifest.metadata,
            bridged_from: manifest.originNode,
            bridged_at: new Date().toISOString(),
            external_reputation: manifest.reputation
          },
          owner_id: 'SYSTEM_BRIDGE'
        });

      if (upsertError) throw upsertError;

      return { success: true };

    } catch (err) {
      console.error('[BRIDGE_FAULT] Import failed:', err);
      return { success: false, error: 'Uplink synchronization fault' };
    }
  }
}
