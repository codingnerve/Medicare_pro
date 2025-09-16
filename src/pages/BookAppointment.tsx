import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import {
  Calendar,
  Clock,
  Stethoscope,
  TestTube,
  User,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  consultationFee: number;
  rating: number;
  availableSlots: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
}

interface AppointmentForm {
  appointmentType: "consultation" | "test";
  doctorId?: string;
  testId?: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName?: string;
  symptoms?: string;
  notes?: string;
  totalAmount?: number;
}

export function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [selectedType, setSelectedType] = useState<"consultation" | "test">(
    "consultation"
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentForm>();

  const watchedDate = watch("appointmentDate");

  // Handle navigation state
  useEffect(() => {
    if (location.state) {
      const {
        selectedType: navType,
        selectedDoctor: navDoctor,
        selectedTest: navTest,
      } = location.state as any;

      if (navType) {
        setSelectedType(navType);
      }

      if (navDoctor) {
        setSelectedDoctor(navDoctor);
        setValue("doctorId", navDoctor.id);
      }

      if (navTest) {
        setSelectedTest(navTest);
        setValue("testId", navTest.id);
      }
    }
  }, [location.state, setValue]);

  // Fetch doctors
  const { data: doctorsData } = useQuery("doctors", async () => {
    const response = await api.get("/doctors");
    return response.data.data;
  });

  // Fetch tests
  const { data: testsData } = useQuery("tests", async () => {
    const response = await api.get("/tests");
    return response.data.data;
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation(
    async (appointmentData: AppointmentForm) => {
      const response = await api.post("/appointments", appointmentData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Appointment booked successfully!");
        navigate("/appointments");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to book appointment"
        );
      },
    }
  );

  const doctors: Doctor[] = doctorsData || [];
  const tests: Test[] = testsData || [];

  // Debug logging
  console.log("Doctors data:", doctors);
  console.log("Tests data:", tests);

  const onSubmit = (data: AppointmentForm) => {
    // Debug user information
    console.log("Current user:", user);
    console.log("User ID:", user?.id);
    console.log("User object keys:", user ? Object.keys(user) : "No user");

    // Check if user is logged in (this should not happen due to ProtectedRoute, but safety check)
    if (!user?.id) {
      toast.error("Please log in to book an appointment");
      navigate("/login");
      return;
    }

    // Set appointment type based on selectedType state
    const appointmentType = selectedType;

    // Validate required fields based on appointment type
    if (appointmentType === "consultation" && !data.doctorId) {
      toast.error("Please select a doctor for consultation");
      return;
    }

    if (appointmentType === "test" && !data.testId) {
      toast.error("Please select a test");
      return;
    }

    // Calculate total amount based on appointment type
    let totalAmount = 0;
    if (appointmentType === "consultation" && data.doctorId) {
      const selectedDoctor = doctors.find((d) => d.id === data.doctorId);
      totalAmount = selectedDoctor?.consultationFee || 0;
    } else if (appointmentType === "test" && data.testId) {
      const selectedTest = tests.find((t) => t.id === data.testId);
      totalAmount = selectedTest?.price || 0;
    }

    // Prepare appointment data with correct type and required fields
    const appointmentData = {
      appointmentType: appointmentType,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      patientName: data.patientName,
      symptoms: data.symptoms,
      notes: data.notes,
      totalAmount: totalAmount,
      // Only include doctorId for consultation appointments
      ...(appointmentType === "consultation" && { doctorId: data.doctorId }),
      // Only include testId for test appointments
      ...(appointmentType === "test" && { testId: data.testId }),
    };

    console.log("Form data:", data);
    console.log("Submitting appointment data:", appointmentData);
    console.log("User from auth store:", user);
    console.log("Auth token being sent:", localStorage.getItem("auth-storage"));

    createAppointmentMutation.mutate(appointmentData);
  };

  const getAvailableTimeSlots = (selectedDoctor?: Doctor) => {
    if (!selectedDoctor || !watchedDate) return [];

    // If doctor has availableSlots, use them
    if (
      selectedDoctor.availableSlots &&
      selectedDoctor.availableSlots.length > 0
    ) {
      const selectedDay = new Date(watchedDate).toLocaleDateString("en-US", {
        weekday: "long",
      });

      const daySlot = selectedDoctor.availableSlots.find(
        (slot) => slot.day === selectedDay && slot.isAvailable
      );

      if (!daySlot) return [];

      const startTime = parseInt(daySlot.startTime.split(":")[0]);
      const endTime = parseInt(daySlot.endTime.split(":")[0]);
      const slots = [];

      // Get current time if today is selected
      const today = new Date().toISOString().split("T")[0];
      const isToday = watchedDate === today;
      const currentHour = isToday ? new Date().getHours() : 0;

      for (let hour = startTime; hour < endTime; hour++) {
        // Skip past hours if today is selected
        if (isToday && hour <= currentHour) {
          continue;
        }
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }

      return slots;
    }

    // Fallback: Generate default time slots (9 AM to 8 PM) if no availableSlots
    const slots = [];
    const today = new Date().toISOString().split("T")[0];
    const isToday = watchedDate === today;
    const currentHour = isToday ? new Date().getHours() : 0;

    for (let hour = 9; hour <= 20; hour++) {
      // Skip past hours if today is selected
      if (isToday && hour <= currentHour) {
        continue;
      }
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    return slots;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Book Appointment
        </h1>
        <p className="text-lg text-gray-600">
          Schedule your consultation or medical test
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Appointment Type */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Select Appointment Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedType("consultation")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedType === "consultation"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Stethoscope className="h-8 w-8 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900">
                    Doctor Consultation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Consult with a specialist doctor
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType("test")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedType === "test"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <TestTube className="h-8 w-8 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Medical Test</h4>
                  <p className="text-sm text-gray-600">
                    Schedule a medical test or lab work
                  </p>
                </button>
              </div>
            </div>

            {/* Doctor/Test Selection */}
            {selectedType === "consultation" && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Doctor
                </h3>
                <select {...register("doctorId")} className="input">
                  <option value="">Choose a doctor</option>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization} (₹
                        {doctor.consultationFee})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No doctors available
                    </option>
                  )}
                </select>
                {errors.doctorId && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.doctorId.message}
                  </p>
                )}
              </div>
            )}

            {selectedType === "test" && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Test
                </h3>
                <select {...register("testId")} className="input">
                  <option value="">Choose a test</option>
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.name} - {test.category} (₹{test.price})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No tests available
                    </option>
                  )}
                </select>
                {errors.testId && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.testId.message}
                  </p>
                )}
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Date
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Only future dates are allowed for appointments
                </p>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("appointmentDate", {
                    required: "Please select a date",
                  })}
                  className="input"
                />
                {errors.appointmentDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Time
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {watchedDate === new Date().toISOString().split("T")[0]
                    ? "Only future times are available for today"
                    : "Available time slots based on your selection"}
                </p>
                {selectedType === "consultation" && watchedDate ? (
                  <select
                    {...register("appointmentTime", {
                      required: "Please select a time",
                    })}
                    className="input"
                  >
                    <option value="">Choose time</option>
                    {getAvailableTimeSlots(
                      doctors.find((d) => d.id === watch("doctorId"))
                    ).length > 0 ? (
                      getAvailableTimeSlots(
                        doctors.find((d) => d.id === watch("doctorId"))
                      ).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No time slots available for this date
                      </option>
                    )}
                  </select>
                ) : (
                  <select
                    {...register("appointmentTime", {
                      required: "Please select a time",
                    })}
                    className="input"
                  >
                    <option value="">Choose time</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = 9 + i;

                      // Skip past hours if today is selected
                      const today = new Date().toISOString().split("T")[0];
                      const isToday = watchedDate === today;
                      const currentHour = isToday ? new Date().getHours() : 0;

                      if (isToday && hour <= currentHour) {
                        return null;
                      }

                      return (
                        <option
                          key={hour}
                          value={`${hour.toString().padStart(2, "0")}:00`}
                        >
                          {hour.toString().padStart(2, "0")}:00
                        </option>
                      );
                    })}
                  </select>
                )}
                {errors.appointmentTime && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Patient Information */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Patient Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name (Optional)
                  </label>
                  <input
                    {...register("patientName")}
                    type="text"
                    placeholder="Enter patient name if different from your account"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms and Notes */}
            {selectedType === "consultation" && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Symptoms & Information
                </h3>
                <textarea
                  {...register("symptoms")}
                  placeholder="Describe your symptoms or concerns..."
                  className="input h-32 resize-none"
                />
              </div>
            )}

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Notes
              </h3>
              <textarea
                {...register("notes")}
                placeholder="Any additional information or special requests..."
                className="input h-24 resize-none"
              />
            </div>

            {/* Hidden fields */}
            <input
              type="hidden"
              {...register("appointmentType")}
              value={selectedType}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createAppointmentMutation.isLoading}
                className="btn btn-primary flex items-center space-x-2"
              >
                {createAppointmentMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Appointment Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Patient: {user?.username}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {selectedType === "consultation" ? (
                  <Stethoscope className="h-5 w-5 text-gray-400" />
                ) : (
                  <TestTube className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                  Type:{" "}
                  {selectedType === "consultation"
                    ? "Consultation"
                    : "Medical Test"}
                </span>
              </div>

              {selectedType === "consultation" && watch("doctorId") && (
                <div className="text-sm">
                  <p className="text-gray-600">Doctor:</p>
                  <p className="font-medium text-gray-900">
                    {doctors.find((d) => d.id === watch("doctorId"))?.name}
                  </p>
                  <p className="text-gray-600">
                    {
                      doctors.find((d) => d.id === watch("doctorId"))
                        ?.specialization
                    }
                  </p>
                </div>
              )}

              {selectedType === "test" && watch("testId") && (
                <div className="text-sm">
                  <p className="text-gray-600">Test:</p>
                  <p className="font-medium text-gray-900">
                    {tests.find((t) => t.id === watch("testId"))?.name}
                  </p>
                  <p className="text-gray-600">
                    {tests.find((t) => t.id === watch("testId"))?.category}
                  </p>
                </div>
              )}

              {watch("appointmentDate") && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(watch("appointmentDate")).toLocaleDateString()}
                  </span>
                </div>
              )}

              {watch("appointmentTime") && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Time: {watch("appointmentTime")}
                  </span>
                </div>
              )}

              {(watch("doctorId") || watch("testId")) && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Total Amount:
                    </span>
                    <span className="font-bold text-lg text-green-600">
                      ₹
                      {selectedType === "consultation"
                        ? doctors.find((d) => d.id === watch("doctorId"))
                            ?.consultationFee || 0
                        : tests.find((t) => t.id === watch("testId"))?.price ||
                          0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment will be processed after confirmation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
