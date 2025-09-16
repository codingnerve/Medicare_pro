import { useState } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { initializeRazorpayPayment, formatAmount } from "@/lib/razorpay";
import { toast } from "react-hot-toast";
import { RazorpayTest } from "@/components/RazorpayTest";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: string;
  appointmentId: {
    id: string;
    appointmentType: "consultation" | "test";
    appointmentDate: string;
    appointmentTime: string;
    status: string;
  };
}

export function Payments() {
  const [statusFilter, setStatusFilter] = useState("");
  const { user } = useAuthStore();

  // Demo payments data
  const demoPayments: Payment[] = [
    {
      id: "1",
      amount: 150,
      currency: "INR",
      paymentMethod: "razorpay",
      paymentStatus: "completed",
      transactionId: "TXN_1757748239_abc123def",
      createdAt: "2025-09-13T07:12:24.564Z",
      appointmentId: {
        id: "appt1",
        appointmentType: "consultation",
        appointmentDate: "2025-09-15T10:00:00Z",
        appointmentTime: "10:00",
        status: "confirmed",
      },
    },
    {
      id: "2",
      amount: 45,
      currency: "INR",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      transactionId: "TXN_1757748240_xyz789ghi",
      createdAt: "2025-09-13T07:15:30.123Z",
      appointmentId: {
        id: "appt2",
        appointmentType: "test",
        appointmentDate: "2025-09-16T09:00:00Z",
        appointmentTime: "09:00",
        status: "pending",
      },
    },
    {
      id: "3",
      amount: 180,
      currency: "INR",
      paymentMethod: "razorpay",
      paymentStatus: "completed",
      transactionId: "TXN_1757748241_mno456pqr",
      createdAt: "2025-09-13T07:20:15.456Z",
      appointmentId: {
        id: "appt3",
        appointmentType: "consultation",
        appointmentDate: "2025-09-20T14:00:00Z",
        appointmentTime: "14:00",
        status: "completed",
      },
    },
    {
      id: "4",
      amount: 800,
      currency: "INR",
      paymentMethod: "razorpay",
      paymentStatus: "refunded",
      transactionId: "TXN_1757748242_stu789vwx",
      createdAt: "2025-09-13T07:25:45.789Z",
      appointmentId: {
        id: "appt4",
        appointmentType: "test",
        appointmentDate: "2025-09-18T11:00:00Z",
        appointmentTime: "11:00",
        status: "cancelled",
      },
    },
  ];

  // Filter demo data based on selected filters
  const filteredPayments = demoPayments.filter((payment) => {
    const statusMatch = !statusFilter || payment.paymentStatus === statusFilter;
    return statusMatch;
  });

  const isLoading = false;
  const error = null;
  const refetch = () => console.log("Demo payments refreshed");

  // Razorpay payment integration
  const handleRazorpayPayment = async (paymentId: string, amount: number) => {
    try {
      // For demo purposes, we'll use test mode
      // In a real app, you'd get the actual appointment ID from the payment record
      const mockAppointmentId = `appt_${paymentId}`;

      await initializeRazorpayPayment(
        mockAppointmentId,
        (response) => {
          toast.success("Payment completed successfully!");
          console.log("Payment successful:", response);
          // Refresh payments list or update UI
          refetch();
        },
        (error) => {
          toast.error(`Payment failed: ${error.message}`);
          console.error("Payment failed:", error);
        },
        true // Enable test mode for demo
      );
    } catch (error) {
      toast.error("Failed to initialize payment");
      console.error("Error initializing payment:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "status-badge status-paid";
      case "pending":
        return "status-badge status-pending";
      case "failed":
        return "status-badge status-cancelled";
      case "refunded":
        return "status-badge status-refunded";
      default:
        return "status-badge bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="h-4 w-4" />;
      case "razorpay":
        return <Zap className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load payments</p>
      </div>
    );
  }

  const payments: Payment[] = filteredPayments;

  return (
    <div className="mobile-spacing">
      <div className="text-center py-2 sm:py-4">
        <h1 className="mobile-title font-bold text-gray-900 mb-2 sm:mb-3">
          Payment History
        </h1>
        <p className="mobile-text text-gray-600">
          View and manage your payment transactions
        </p>
      </div>

      {/* Razorpay Test Component */}
      <div className="mb-6">
        <RazorpayTest />
      </div>

      {/* Filters */}
      <div className="card mobile-card">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <button onClick={() => refetch()} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4 sm:space-y-6">
        {payments.map((payment) => (
          <div key={payment.id} className="card mobile-card">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getPaymentMethodIcon(payment.paymentMethod)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {payment.appointmentId.appointmentType === "consultation"
                        ? "Doctor Consultation"
                        : "Medical Test"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Appointment on{" "}
                      {new Date(
                        payment.appointmentId.appointmentDate
                      ).toLocaleDateString()}{" "}
                      at {payment.appointmentId.appointmentTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Transaction ID:</span>
                    <span className="font-mono text-xs">
                      {payment.transactionId}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Payment Method:</span>
                    <span className="capitalize">
                      {payment.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Payment Date:</span>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end space-y-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    payment.paymentStatus
                  )}`}
                >
                  {getStatusIcon(payment.paymentStatus)}
                  <span className="capitalize">{payment.paymentStatus}</span>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {payment.paymentStatus === "completed" && (
                    <button className="btn btn-secondary btn-sm mobile-button">
                      Download Receipt
                    </button>
                  )}
                  {payment.paymentStatus === "pending" && (
                    <button
                      onClick={() =>
                        handleRazorpayPayment(
                          payment.transactionId || payment.id,
                          payment.amount
                        )
                      }
                      className="btn btn-razorpay btn-sm mobile-button flex items-center space-x-1"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Pay with Razorpay</span>
                    </button>
                  )}
                  {payment.paymentStatus === "failed" && (
                    <button
                      onClick={() =>
                        handleRazorpayPayment(
                          payment.transactionId || payment.id,
                          payment.amount
                        )
                      }
                      className="btn btn-razorpay btn-sm mobile-button flex items-center space-x-1"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Retry with Razorpay</span>
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No payments found</p>
          <p className="text-gray-400">Your payment history will appear here</p>
        </div>
      )}
    </div>
  );
}
