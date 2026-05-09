export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initRazorpayPayment(amountInPaise: number, userId: string, purpose: string, onSuccess: () => void) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Failed to load Razorpay SDK. Check your connection.");
    return;
  }

  // NOTE: Razorpay mock integration for preview. 
  // In a real app, you would create an order on your server securely.
  const options = {
    key: import.meta.env.VITE_RAZORPAY_TEST_KEY || "rzp_test_YOUR_TEST_KEY", // Replace with your Test Key
    amount: amountInPaise, 
    currency: "INR",
    name: "Citizen CSC",
    description: purpose,
    image: "/logo.png", // Replace
    handler: function (response: any) {
      console.log('Payment success:', response.razorpay_payment_id);
      onSuccess();
    },
    prefill: {
      name: "CSC User",
      email: "user@example.com",
      contact: "9999999999"
    },
    theme: {
      color: "#1A73E8"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', function (response: any){
    alert("Payment Failed: " + response.error.description);
  });
  rzp.open();
}
