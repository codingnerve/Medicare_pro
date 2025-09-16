// Razorpay payment integration service
import { api } from './api';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
      key: string;
    };
    paymentId: string;
    key: string;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
  data: any;
}

// Create Razorpay order
export const createRazorpayOrder = async (appointmentId: string, isTest: boolean = false): Promise<RazorpayOrderResponse> => {
  try {
    const response = await api.post('/payments/razorpay/order', {
      appointmentId,
      isTest,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (
  paymentId: string,
  razorpayResponse: RazorpayPaymentResponse,
  isTest: boolean = false
): Promise<RazorpayVerifyResponse> => {
  try {
    const response = await api.post('/payments/razorpay/verify', {
      paymentId,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
      isTest,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    throw error;
  }
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (
  appointmentId: string,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  isTest: boolean = false
) => {
  try {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    // Create order
    const orderResponse = await createRazorpayOrder(appointmentId, isTest);
    
    if (!orderResponse.success) {
      throw new Error(orderResponse.message);
    }

    const { order, paymentId, key } = orderResponse.data;
    const razorpayKey = key || order.key;

    if (!razorpayKey) {
      throw new Error('Razorpay key not found in response');
    }

    // Razorpay options
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'MediCare Pro',
      description: 'Medical Appointment Payment',
      order_id: order.id,
      handler: async function (response: RazorpayPaymentResponse) {
        try {
          // Verify payment
          const verifyResponse = await verifyRazorpayPayment(paymentId, response, isTest);
          
          if (verifyResponse.success) {
            onSuccess(verifyResponse.data);
          } else {
            onError(new Error(verifyResponse.message));
          }
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: 'Patient Name',
        email: 'patient@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Medical Center Address',
        appointmentId: appointmentId,
      },
      theme: {
        color: '#4F46E5',
      },
      modal: {
        ondismiss: function() {
          onError(new Error('Payment cancelled by user'));
        }
      }
    };

    // Open Razorpay modal
    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    onError(error);
  }
};

// Utility function to format amount for display
export const formatAmount = (amount: number): string => {
  return `₹${amount}`;
};

// Utility function to format amount for Razorpay (in paise)
export const formatAmountForRazorpay = (amount: number): number => {
  return amount * 100;
};

// Test Razorpay integration
export const testRazorpayIntegration = () => {
  if (!window.Razorpay) {
    console.error('Razorpay SDK not loaded');
    return false;
  }
  
  console.log('Razorpay SDK loaded successfully');
  return true;
};
