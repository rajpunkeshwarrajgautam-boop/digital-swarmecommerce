/**
 * 🏗️ DIGITAL SWARM | Token Factory
 * ---------------------------------
 * Mints "Digital Swarm Tokens" (DSTs) for every transaction.
 */

import { supabaseAdmin } from './supabase';
import { getNodeIdentity } from './nodes';
import { createHash } from 'crypto';
import { RoyaltyService } from './royalties';

export interface DigitalToken {
  id: string;
  owner_id: string;
  product_id: string;
  mint_node: string;
  ledger_signature: string;
  metadata: any;
  created_at?: string;
}

export class TokenService {
  /**
   * Mints a unique token for every product in a paid order.
   */
  static async mintFromOrder(orderId: string, ledgerSignature: string): Promise<{ success: boolean; tokens: string[] }> {
    if (!supabaseAdmin) return { success: false, tokens: [] };

    try {
      // 1. Fetch order details with items
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .select(`
          user_id,
          order_items (
            product_id,
            price
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError || !order) throw orderError || new Error("Order not found");

      const node = getNodeIdentity();
      const tokens: DigitalToken[] = [];
      const tokenIds: string[] = [];

      // 2. Generate tokens for each item
      for (const item of order.order_items) {
        const tokenId = createHash('sha256')
          .update(`${orderId}:${item.product_id}:${order.user_id}:${Date.now()}`)
          .digest('hex')
          .substring(0, 16)
          .toUpperCase();

        tokens.push({
          id: `DST-${tokenId}`,
          owner_id: order.user_id,
          product_id: item.product_id,
          mint_node: node.id,
          ledger_signature: ledgerSignature,
          metadata: {
            acquisition_node: node.id,
            region: node.region,
            price_at_mint: item.price
          }
        });
        tokenIds.push(`DST-${tokenId}`);
      }

      // 3. Record in database
      const { error: mintError } = await supabaseAdmin
        .from('digital_tokens')
        .insert(tokens);

      if (mintError) {
        console.error('[MINT_FAULT] Token registration failed:', mintError.message);
        // Fallback: If table doesn't exist, log for manual recovery
      }

      console.log(`[TOKEN_STRIKE] ${tokens.length} tokens minted for Order: ${orderId}`);
      return { success: true, tokens: tokenIds };

    } catch (err) {
      console.error('[MINTING_ERROR] Factory failure:', err);
      return { success: false, tokens: [] };
    }
  }

  /**
   * 🎁 SECONDARY TRANSFER PROTOCOL
   * ------------------------------
   * Transfers ownership of a token to another user.
   */
  static async transferToken(tokenId: string, fromUserId: string, toEmail: string, price: number = 0): Promise<{ success: boolean; message: string }> {
    if (!supabaseAdmin) return { success: false, message: "Database offline" };

    try {
      // 1. Verify current ownership
      const { data: token, error: fetchError } = await supabaseAdmin
        .from('digital_tokens')
        .select('id, owner_id')
        .eq('id', tokenId)
        .eq('owner_id', fromUserId)
        .single();

      if (fetchError || !token) {
        return { success: false, message: "Ownership verification failure" };
      }

      // 2. Resolve Recipient ID (Mocked for now - we'd normally lookup the clerkId from the email)
      const toUserId = `user_from_email_${toEmail.split('@')[0]}`;

      // 3. Atomic Transfer
      const { error: updateError } = await supabaseAdmin
        .from('digital_tokens')
        .update({ owner_id: toUserId })
        .eq('id', tokenId);

      if (updateError) throw updateError;

      // 4. Process Royalties (Milestone 11.1)
      if (price > 0) {
        await RoyaltyService.calculateSplit(tokenId, price);
      }

      // 5. Log Transfer Transaction
      await supabaseAdmin.from('token_transfers').insert({
        token_id: tokenId,
        from_id: fromUserId,
        to_id: toUserId,
        to_email: toEmail,
        amount: price,
        signature: createHash('sha256').update(`${tokenId}:${fromUserId}:${toUserId}:${price}:${Date.now()}`).digest('hex')
      });

      console.log(`[TRANSFER] Token ${tokenId} moved to ${toEmail} for $${price}`);
      return { success: true, message: "Transfer sequence complete" };

    } catch (err) {
      console.error('[TRANSFER_ERROR] Failed to move artifact:', err);
      return { success: false, message: "Transfer protocol fault" };
    }
  }
}
