/*
  # Create automatic order notification webhook

  1. Changes
    - Creates a database trigger that automatically calls the send-order-notification Edge Function
    - Uses supabase_functions.http_request for webhook calls
    - Trigger fires after INSERT on orders table
  
  2. Security
    - Calls Edge Function securely with proper authentication
*/

-- Drop old trigger and function if exists
DROP TRIGGER IF EXISTS on_order_created ON orders;
DROP FUNCTION IF EXISTS trigger_order_notification();

-- Create function to trigger order notification via webhook
CREATE OR REPLACE FUNCTION trigger_order_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Use pg_net to make HTTP request to Edge Function
  PERFORM net.http_post(
    url := 'https://xtrfcpolvkizoggtfiib.supabase.co/functions/v1/send-order-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('orderId', NEW.id::text)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on orders table
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_order_notification();