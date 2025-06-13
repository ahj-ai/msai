-- Stack Credit System Migration for MathStackAI
-- Creates functions for atomic stack operations

-- 1. Create stacks_transaction_history table to track all stack transactions
CREATE TABLE IF NOT EXISTS stacks_transaction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  operation TEXT NOT NULL,
  previous_balance INTEGER NOT NULL,
  new_balance INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stack_transactions_user_id ON stacks_transaction_history(user_id);

-- 2. Create function to spend stacks with atomic operation
CREATE OR REPLACE FUNCTION spend_stacks(
  p_user_id TEXT,
  p_amount INTEGER,
  p_operation TEXT DEFAULT 'unknown'
) RETURNS JSONB AS $$
DECLARE
  v_current_stacks INTEGER;
  v_new_balance INTEGER;
  v_result JSONB;
BEGIN
  -- Select with FOR UPDATE to lock the row
  SELECT stacks INTO v_current_stacks
  FROM user_profiles
  WHERE user_id = p_user_id
  FOR UPDATE;  -- This locks the row
  
  -- Check if user exists
  IF v_current_stacks IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User profile not found'
    );
  END IF;
  
  -- Check balance
  IF v_current_stacks < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stacks',
      'code', 'INSUFFICIENT_STACKS',
      'available', v_current_stacks,
      'required', p_amount
    );
  END IF;
  
  -- Calculate new balance
  v_new_balance := v_current_stacks - p_amount;
  
  -- Update the balance
  UPDATE user_profiles
  SET stacks = v_new_balance
  WHERE user_id = p_user_id;
  
  -- Record transaction in history
  INSERT INTO stacks_transaction_history (
    user_id,
    amount,
    operation,
    previous_balance,
    new_balance,
    metadata
  ) VALUES (
    p_user_id,
    -p_amount, -- negative for spending
    p_operation,
    v_current_stacks,
    v_new_balance,
    jsonb_build_object('operation', p_operation)
  );
  
  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'remainingStacks', v_new_balance,
    'spent', p_amount
  );
END;
$$ LANGUAGE plpgsql;

-- 3. Create function to add stacks with atomic operation
CREATE OR REPLACE FUNCTION add_stacks(
  p_user_id TEXT,
  p_amount INTEGER,
  p_operation TEXT DEFAULT 'unknown',
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $$
DECLARE
  v_current_stacks INTEGER;
  v_new_balance INTEGER;
  v_result JSONB;
BEGIN
  -- Select with FOR UPDATE to lock the row
  SELECT stacks INTO v_current_stacks
  FROM user_profiles
  WHERE user_id = p_user_id
  FOR UPDATE;  -- This locks the row
  
  -- Check if user exists
  IF v_current_stacks IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User profile not found'
    );
  END IF;
  
  -- Calculate new balance
  v_new_balance := v_current_stacks + p_amount;
  
  -- Update the balance
  UPDATE user_profiles
  SET stacks = v_new_balance
  WHERE user_id = p_user_id;
  
  -- Record transaction in history
  INSERT INTO stacks_transaction_history (
    user_id,
    amount,
    operation,
    previous_balance,
    new_balance,
    metadata
  ) VALUES (
    p_user_id,
    p_amount, -- positive for adding
    p_operation,
    v_current_stacks,
    v_new_balance,
    p_metadata
  );
  
  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'newBalance', v_new_balance,
    'added', p_amount
  );
END;
$$ LANGUAGE plpgsql;

-- 4. Create function to get user stack history
CREATE OR REPLACE FUNCTION get_user_stack_history(
  p_user_id TEXT,
  p_limit INTEGER DEFAULT 50
) RETURNS TABLE (
  id UUID,
  amount INTEGER,
  operation TEXT,
  previous_balance INTEGER,
  new_balance INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sth.id,
    sth.amount,
    sth.operation,
    sth.previous_balance,
    sth.new_balance,
    sth.metadata,
    sth.created_at
  FROM stacks_transaction_history sth
  WHERE sth.user_id = p_user_id
  ORDER BY sth.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
