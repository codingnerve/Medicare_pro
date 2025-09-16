import { useState } from "react";
import {
  initializeRazorpayPayment,
  testRazorpayIntegration,
} from "@/lib/razorpay";
import { toast } from "react-hot-toast";

export function RazorpayTest() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestPayment = async () => {
    setIsLoading(true);

    try {
      // Test if Razorpay is loaded
      if (!testRazorpayIntegration()) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      // Test payment with test mode enabled
      await initializeRazorpayPayment(
        "test_appointment_123", // This will be ignored in test mode
        (response) => {
          toast.success("Test payment successful!");
          console.log("Test payment response:", response);
          setIsLoading(false);
        },
        (error) => {
          toast.error(`Test payment failed: ${error.message}`);
          console.error("Test payment error:", error);
          setIsLoading(false);
        },
        true // Enable test mode
      );
    } catch (error) {
      toast.error("Failed to initialize test payment");
      console.error("Test payment initialization error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Razorpay Integration Test</h3>
      <p className="text-gray-600 mb-4">
        Click the button below to test the Razorpay payment integration. This
        will open the Razorpay payment modal with demo/test data.
      </p>

      <button
        onClick={handleTestPayment}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
      >
        {isLoading ? "Processing..." : "Test Razorpay Payment"}
      </button>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          <strong>Test Card Details:</strong>
        </p>
        <p>Card: 4111 1111 1111 1111</p>
        <p>CVV: 123</p>
        <p>Expiry: Any future date</p>
      </div>
    </div>
  );
}
