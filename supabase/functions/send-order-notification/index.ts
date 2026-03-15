import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { orderId } = await req.json();

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        quantity,
        price,
        products (
          name
        )
      `)
      .eq("order_id", orderId);

    if (itemsError) {
      throw new Error(`Failed to fetch order items: ${itemsError.message}`);
    }

    const items = (orderItems || []).map((item: any) => ({
      name: item.products?.name || "Produit inconnu",
      quantity: item.quantity,
      price: parseFloat(item.price),
    }));

    const orderData = {
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: "N/A",
      customerPhone: order.phone,
      shippingAddress: `${order.address}, ${order.city}`,
      items,
      total: parseFloat(order.total_amount),
    };

    // Format items list for plain text
    const itemsListText = orderData.items
      .map(
        (item) =>
          `- ${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} TND`
      )
      .join("\n");

    // Format items list for HTML
    const itemsListHtml = orderData.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} TND</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${(item.price * item.quantity).toFixed(2)} TND</td>
          </tr>`
      )
      .join("");

    const emailSubject = `Nouvelle commande #${orderData.orderId}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #111827; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; }
            .section { background-color: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .info-row { margin-bottom: 10px; }
            .info-label { font-weight: 600; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #f3f4f6; padding: 12px 8px; text-align: left; font-weight: 600; }
            .total-row { background-color: #f9fafb; font-weight: bold; font-size: 18px; }
            .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Nouvelle Commande Reçue</h1>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">Informations de commande</div>
                <div class="info-row"><span class="info-label">Numéro de commande:</span> #${orderData.orderId}</div>
              </div>

              <div class="section">
                <div class="section-title">Informations client</div>
                <div class="info-row"><span class="info-label">Nom:</span> ${orderData.customerName}</div>
                <div class="info-row"><span class="info-label">Email:</span> ${orderData.customerEmail}</div>
                <div class="info-row"><span class="info-label">Téléphone:</span> ${orderData.customerPhone}</div>
                <div class="info-row"><span class="info-label">Adresse de livraison:</span> ${orderData.shippingAddress}</div>
              </div>

              <div class="section">
                <div class="section-title">Produits commandés</div>
                <table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th style="text-align: center;">Quantité</th>
                      <th style="text-align: right;">Prix unitaire</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsListHtml}
                    <tr class="total-row">
                      <td colspan="3" style="padding: 12px 8px; text-align: right;">TOTAL:</td>
                      <td style="padding: 12px 8px; text-align: right; color: #111827;">${orderData.total.toFixed(2)} TND</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="footer">
              Cette commande a été passée via votre boutique en ligne.
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
Nouvelle commande reçue !

Numéro de commande: ${orderData.orderId}

CLIENT:
Nom: ${orderData.customerName}
Email: ${orderData.customerEmail}
Téléphone: ${orderData.customerPhone}
Adresse de livraison: ${orderData.shippingAddress}

PRODUITS:
${itemsListText}

TOTAL: ${orderData.total.toFixed(2)} TND

---
Cette commande a été passée via votre boutique en ligne.
    `.trim();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      console.log("Order notification (email not sent):", {
        to: "hamditebourbi07@gmail.com",
        subject: emailSubject,
        body: textBody,
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: "Email service not configured. Please add RESEND_API_KEY.",
          orderId: orderData.orderId,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Boutique Hamdi <onboarding@resend.dev>",
        to: ["hamditebourbi07@gmail.com"],
        reply_to: "hamditebourbi07@gmail.com",
        subject: emailSubject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const resendData = await resendResponse.json();
    console.log("Email sent successfully via Resend:", resendData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order notification sent successfully",
        orderId: orderData.orderId,
        emailId: resendData.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending order notification:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
