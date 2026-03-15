/*
  # Create automatic order notification trigger

  1. Changes
    - Creates a database trigger that automatically calls the send-order-notification Edge Function
    - Trigger fires after INSERT on orders table
    - Sends order details to the Edge Function via HTTP webhook
  
  2. Security
    - Uses Supabase's pg_net extension for secure HTTP requests
    - Automatically includes authentication headers
*/

-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to trigger order notification
CREATE OR REPLACE FUNCTION trigger_order_notification()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Call the Edge Function via HTTP POST
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-order-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key')
    ),
    body := jsonb_build_object('orderId', NEW.id::text)
  ) INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_order_notification();