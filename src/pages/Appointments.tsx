import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Stethoscope,
  TestTube,
  CheckCircle,
  XCircle,
  Zap,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { initializeRazorpayPayment, formatAmount } from "@/lib/razorpay";
import { toast } from "react-hot-toast";

interface Appointment {
  id: string;
  appointmentType: "consultation" | "test";
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  symptoms?: string;
  notes?: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  doctorId?: {
    id: string;
    name: string;
    specialization: string;
    consultationFee: number;
  };
  testId?: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

export function Appointments() {
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { user } = useAuthStore();

  // Demo appointments data
  const demoAppointments: Appointment[] = [
    {
      id: "1",
      appointmentType: "consultation",
      appointmentDate: "2025-09-15T10:00:00Z",
      appointmentTime: "10:00",
      status: "confirmed",
      symptoms: "Chest pain and shortness of breath",
      notes: "Patient reports symptoms for the past 3 days",
      totalAmount: 150,
      paymentStatus: "paid",
      doctorId: {
        id: "doc1",
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        consultationFee: 150,
      },
    },
    {
      id: "2",
      appointmentType: "test",
      appointmentDate: "2025-09-16T09:00:00Z",
      appointmentTime: "09:00",
      status: "pending",
      notes: "Routine blood test as requested by doctor",
      totalAmount: 45,
      paymentStatus: "pending",
      testId: {
        id: "test1",
        name: "Complete Blood Count (CBC)",
        price: 45,
        duration: 30,
      },
    },
    {
      id: "3",
      appointmentType: "consultation",
      appointmentDate: "2025-09-20T14:00:00Z",
      appointmentTime: "14:00",
      status: "completed",
      symptoms: "Headaches and dizziness",
      notes: "Follow-up appointment after test results",
      totalAmount: 180,
      paymentStatus: "paid",
      doctorId: {
        id: "doc2",
        name: "Dr. Michael Chen",
        specialization: "Neurology",
        consultationFee: 180,
      },
    },
    {
      id: "4",
      appointmentType: "test",
      appointmentDate: "2025-09-18T11:00:00Z",
      appointmentTime: "11:00",
      status: "cancelled",
      notes: "MRI Brain Scan - Patient cancelled due to claustrophobia",
      totalAmount: 800,
      paymentStatus: "refunded",
      testId: {
        id: "test2",
        name: "MRI Brain Scan",
        price: 800,
        duration: 60,
      },
    },
  ];

  // Filter demo data based on selected filters
  const filteredAppointments = demoAppointments.filter((appointment) => {
    const statusMatch = !statusFilter || appointment.status === statusFilter;
    const typeMatch = !typeFilter || appointment.appointmentType === typeFilter;
    return statusMatch && typeMatch;
  });

  const isLoading = false;
  const error = null;
  const refetch = () => console.log("Demo data refreshed");

  // Razorpay payment integration
  const handleRazorpayPayment = async (
    appointmentId: string,
    amount: number
  ) => {
    try {
      await initializeRazorpayPayment(
        appointmentId,
        (response) => {
          toast.success("Payment completed successfully!");
          console.log("Payment successful:", response);
          // Refresh appointments list or update UI
          refetch();
        },
        (error) => {
          toast.error(`Payment failed: ${error.message}`);
          console.error("Payment failed:", error);
        },
        true // Enable test mode for demo appointments
      );
    } catch (error) {
      toast.error("Failed to initialize payment");
      console.error("Error initializing payment:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "status-badge status-confirmed";
      case "pending":
        return "status-badge status-pending";
      case "completed":
        return "status-badge status-completed";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "status-badge status-paid";
      case "pending":
        return "status-badge status-pending";
      case "refunded":
        return "status-badge status-refunded";
      default:
        return "status-badge bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <p className="text-red-600">Failed to load appointments</p>
      </div>
    );
  }

  const appointments: Appointment[] = filteredAppointments;

  return (
    <div className="mobile-spacing py-10 px-10">
      <div className="text-center py-2 sm:py-4">
        <h1 className="mobile-title font-bold text-gray-900 mb-2 sm:mb-3">
          My Appointments
        </h1>
        <p className="mobile-text text-gray-600">
          Manage your healthcare appointments and consultations
        </p>
        <div className="mt-4">
          <Link
            to="/book-appointment"
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card mobile-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="test">Test</option>
          </select>

          <button onClick={() => refetch()} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4 sm:space-y-6">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="card mobile-card">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {appointment.appointmentType === "consultation" ? (
                    <Stethoscope className="h-5 w-5 text-primary-600" />
                  ) : (
                    <TestTube className="h-5 w-5 text-primary-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.appointmentType === "consultation"
                        ? `Consultation with Dr. ${appointment.doctorId?.name}`
                        : appointment.testId?.name}
                    </h3>
                    {appointment.appointmentType === "consultation" && (
                      <p className="text-sm text-gray-600">
                        {appointment.doctorId?.specialization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{appointment.appointmentTime}</span>
                  </div>
                </div>

                {appointment.symptoms && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Symptoms:
                    </h4>
                    <p className="text-sm text-gray-600">
                      {appointment.symptoms}
                    </p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Notes:
                    </h4>
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600">Amount: </span>
                    <span className="font-medium text-gray-900 ml-1">
                      ₹{appointment.totalAmount}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">Payment: </span>
                    <span
                      className={`ml-1 ${getPaymentStatusColor(
                        appointment.paymentStatus
                      )}`}
                    >
                      {appointment.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end space-y-3">
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusIcon(appointment.status)}
                  <span className="capitalize">{appointment.status}</span>
                </div>

                <div className="flex space-x-2">
                  {appointment.status === "pending" && (
                    <button className="btn btn-danger btn-sm">Cancel</button>
                  )}
                  {appointment.paymentStatus === "pending" && (
                    <button
                      onClick={() =>
                        handleRazorpayPayment(
                          appointment.id,
                          appointment.totalAmount
                        )
                      }
                      className="btn btn-razorpay btn-sm mobile-button flex items-center space-x-1"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Pay with Razorpay</span>
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm mobile-button">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No appointments found</p>
          <p className="text-gray-400">
            Book your first appointment to get started
          </p>
        </div>
      )}
    </div>
  );
}
