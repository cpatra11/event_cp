// app/api/webhooks/razorpay/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import { createOrder } from "@/lib/actions/order.actions";

const endpointSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("x-razorpay-signature") as string;

  let event;

  try {
    // Verify the webhook signature
    const hmac = crypto.createHmac("sha256", endpointSecret);
    hmac.update(body);
    const digest = hmac.digest("hex");

    if (digest !== sig) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    event = JSON.parse(body);

    // Handle the event based on its type
    if (event.event === "order.paid") {
      const { id, amount, notes } = event.payload.payment.entity;
      const order = {
        razorpayId: id,
        eventId: notes.eventId,
        buyerId: notes.buyerId,
        totalAmount: (amount / 100).toString(), // Convert paise to rupees and convert to string
        createdAt: new Date(),
      };

      await createOrder(order);
      return NextResponse.json({ message: "Order created" });
    }

    return NextResponse.json({ message: "Event not handled" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook error", error },
      { status: 500 }
    );
  }
}
