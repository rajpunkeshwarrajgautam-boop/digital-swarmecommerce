-- SQL Script to create a transaction-safe order RPC in Supabase
-- Run this in your Supabase SQL Editor.

CREATE OR REPLACE FUNCTION create_order_v3(
  p_user_email TEXT,
  p_total DECIMAL,
  p_items JSONB
) RETURNS JSONB AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- 1. Create the Order
  INSERT INTO orders (user_id, total, status)
  VALUES (p_user_email, p_total, 'pending')
  RETURNING id INTO v_order_id;

  -- 2. Create the Order Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (
      v_order_id, 
      (v_item->>'id')::UUID, 
      (v_item->>'quantity')::INTEGER, 
      (v_item->>'price')::DECIMAL
    );
  END LOOP;

  -- 3. Return Success
  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id
  );

EXCEPTION WHEN OTHERS THEN
  -- Automatic Rollback occurs on exception in PG functions
  RAISE EXCEPTION 'TRANSACTION_FAULT: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
