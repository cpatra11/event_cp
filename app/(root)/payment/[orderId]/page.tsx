// app/payment/[orderId]/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentPage = ({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { [key: string]: string };
}) => {
  const router = useRouter();
  const { orderId } = params;
  const { success_url, cancel_url } = searchParams;
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    // Function to load the Razorpay script
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error("Razorpay SDK failed to load");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, [orderId]);

  useEffect(() => {
    if (!razorpayLoaded) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: "100", // Example amount in paise, change to actual amount
      currency: "USD",
      name: "Evently",
      description: "Test Transaction",
      order_id: orderId,
      handler: function (response: any) {
        // Success handler
        window.location.href = success_url;
      },
      modal: {
        ondismiss: function () {
          // Cancel handler
          window.location.href = cancel_url;
        },
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response: any) {
      // Payment failed handler
      console.error(response.error);
      window.location.href = cancel_url;
    });
  }, [razorpayLoaded, orderId, success_url, cancel_url]);

  return <div>Redirecting to payment...</div>;
};

export default PaymentPage;
