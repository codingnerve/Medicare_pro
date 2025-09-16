import { useState } from "react";
import { useQuery } from "react-query";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import {
  Users,
  Stethoscope,
  TestTube,
  Calendar,
  CreditCard,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Shield,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  totalTests: number;
  totalAppointments: number;
  totalPayments: number;
  monthlyRevenue: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  consultationFee: number;
  rating: number;
  bio: string;
  qualifications: string[];
  createdAt: string;
}

interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
  preparationInstructions?: string;
  normalRange?: string;
  isAvailable?: boolean;
}

interface Appointment {
  id: string;
  userId: string;
  doctorId?: string;
  testId?: string;
  appointmentType: "consultation" | "test";
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  patientName?: string;
  symptoms?: string;
  notes?: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  user?: {
    username: string;
    email: string;
  };
  doctor?: {
    name: string;
    specialization: string;
  };
  test?: {
    name: string;
    category: string;
  };
}

interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

interface CreateDoctorForm {
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  consultationFee: number;
  bio?: string;
  qualifications: string[];
}

interface CreateTestForm {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  preparationInstructions?: string;
  normalRange?: string;
  isAvailable: boolean;
}

interface CreateAppointmentForm {
  userId: string;
  doctorId?: string;
  testId?: string;
  appointmentType: "consultation" | "test";
  appointmentDate: string;
  appointmentTime: string;
  patientName?: string;
  symptoms?: string;
  notes?: string;
  totalAmount: number;
}

export function Admin() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormType, setCreateFormType] = useState<
    "user" | "doctor" | "test" | "appointment"
  >("user");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [, setFormData] = useState<any>({});

  // Form data states
  const [userForm, setUserForm] = useState<CreateUserForm>({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [doctorForm, setDoctorForm] = useState<CreateDoctorForm>({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: 0,
    consultationFee: 0,
    bio: "",
    qualifications: [],
  });

  const [testForm, setTestForm] = useState<CreateTestForm>({
    name: "",
    description: "",
    category: "General",
    price: 0,
    duration: 30,
    preparationInstructions: "",
    normalRange: "",
    isAvailable: true,
  });

  const [appointmentForm, setAppointmentForm] = useState<CreateAppointmentForm>(
    {
      userId: "",
      doctorId: "",
      testId: "",
      appointmentType: "consultation",
      appointmentDate: "",
      appointmentTime: "",
      patientName: "",
      symptoms: "",
      notes: "",
      totalAmount: 0,
    }
  );

  // Fetch admin dashboard stats
  const { data: statsData } = useQuery("admin-stats", async () => {
    const response = await api.get("/admin/dashboard");
    return response.data.data;
  });

  // Fetch users
  const { data: usersData, refetch: refetchUsers } = useQuery(
    "admin-users",
    async () => {
      const response = await api.get("/admin/users");
      return response.data.data;
    }
  );

  // Fetch doctors
  const { data: doctorsData, refetch: refetchDoctors } = useQuery(
    "admin-doctors",
    async () => {
      const response = await api.get("/admin/doctors");
      return response.data.data;
    }
  );

  // Fetch tests
  const { data: testsData, refetch: refetchTests } = useQuery(
    "admin-tests",
    async () => {
      const response = await api.get("/admin/tests");
      return response.data.data;
    }
  );

  // Fetch appointments
  const { data: appointmentsData, refetch: refetchAppointments } = useQuery(
    "admin-appointments",
    async () => {
      const response = await api.get("/admin/appointments");
      return response.data.data;
    }
  );

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const stats: AdminStats = statsData?.stats || {
    totalUsers: 0,
    totalDoctors: 0,
    totalTests: 0,
    totalAppointments: 0,
    totalPayments: 0,
    monthlyRevenue: 0,
  };

  const users: User[] = usersData?.users || [];
  const doctors: Doctor[] = doctorsData || [];
  const tests: Test[] = testsData || [];
  const appointments: Appointment[] = appointmentsData?.appointments || [];

  const handleCreateUser = async (userData: CreateUserForm) => {
    try {
      await api.post("/admin/users", userData);
      toast.success("User created successfully");
      refetchUsers();
      setShowCreateForm(false);
      setUserForm({ username: "", email: "", password: "", role: "USER" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleCreateDoctor = async (doctorData: CreateDoctorForm) => {
    try {
      await api.post("/admin/doctors", doctorData);
      toast.success("Doctor created successfully");
      refetchDoctors();
      setShowCreateForm(false);
      setDoctorForm({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        experience: 0,
        consultationFee: 0,
        bio: "",
        qualifications: [],
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create doctor");
    }
  };

  const handleCreateTest = async (testData: CreateTestForm) => {
    try {
      await api.post("/admin/tests", testData);
      toast.success("Test created successfully");
      refetchTests();
      setShowCreateForm(false);
      setTestForm({
        name: "",
        description: "",
        category: "General",
        price: 0,
        duration: 30,
        preparationInstructions: "",
        normalRange: "",
        isAvailable: true,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create test");
    }
  };

  const handleCreateAppointment = async (
    appointmentData: CreateAppointmentForm
  ) => {
    try {
      // Clean up the data before sending - remove empty strings for optional fields
      const cleanedData = {
        ...appointmentData,
        // Remove empty strings and set to undefined for optional fields
        doctorId:
          appointmentData.doctorId && appointmentData.doctorId.trim() !== ""
            ? appointmentData.doctorId
            : undefined,
        testId:
          appointmentData.testId && appointmentData.testId.trim() !== ""
            ? appointmentData.testId
            : undefined,
        patientName:
          appointmentData.patientName &&
          appointmentData.patientName.trim() !== ""
            ? appointmentData.patientName
            : undefined,
        symptoms:
          appointmentData.symptoms && appointmentData.symptoms.trim() !== ""
            ? appointmentData.symptoms
            : undefined,
        notes:
          appointmentData.notes && appointmentData.notes.trim() !== ""
            ? appointmentData.notes
            : undefined,
      };

      await api.post("/admin/appointments", cleanedData);
      toast.success("Appointment created successfully");
      refetchAppointments();
      setShowCreateForm(false);
      setAppointmentForm({
        userId: "",
        doctorId: "",
        testId: "",
        appointmentType: "consultation",
        appointmentDate: "",
        appointmentTime: "",
        patientName: "",
        symptoms: "",
        notes: "",
        totalAmount: 0,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        toast.success("Doctor deleted successfully");
        refetchDoctors();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete doctor");
      }
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    // Set the form data to the doctor being edited
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      bio: doctor.bio,
      qualifications: doctor.qualifications,
    });
    setEditingItem(doctor);
    setCreateFormType("doctor");
    setShowCreateForm(true);
  };

  const handleUpdateDoctor = async (doctorData: CreateDoctorForm) => {
    try {
      await api.put(`/admin/doctors/${editingItem.id}`, doctorData);
      toast.success("Doctor updated successfully");
      refetchDoctors();
      setShowCreateForm(false);
      setEditingItem(null);
      setDoctorForm({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        experience: 0,
        consultationFee: 0,
        bio: "",
        qualifications: [],
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        await api.delete(`/admin/tests/${id}`);
        toast.success("Test deleted successfully");
        refetchTests();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete test");
      }
    }
  };

  const handleEditTest = (test: Test) => {
    // Set the form data to the test being edited
    setTestForm({
      name: test.name,
      description: test.description || "",
      category: test.category,
      price: test.price,
      duration: test.duration,
      preparationInstructions: test.preparationInstructions,
      normalRange: test.normalRange,
      isAvailable: test.isAvailable || false,
    });
    setEditingItem(test);
    setCreateFormType("test");
    setShowCreateForm(true);
  };

  const handleUpdateTest = async (testData: CreateTestForm) => {
    try {
      await api.put(`/admin/tests/${editingItem.id}`, testData);
      toast.success("Test updated successfully");
      refetchTests();
      setShowCreateForm(false);
      setEditingItem(null);
      setTestForm({
        name: "",
        description: "",
        category: "General",
        price: 0,
        duration: 30,
        preparationInstructions: "",
        normalRange: "",
        isAvailable: true,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update test");
    }
  };

  const handleEditUser = (user: User) => {
    // Set the form data to the user being edited
    setUserForm({
      username: user.username,
      email: user.email,
      password: "", // Don't pre-fill password for security
      role: user.role as "USER" | "ADMIN",
    });
    setEditingItem(user);
    setCreateFormType("user");
    setShowCreateForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success("User deleted successfully");
        refetchUsers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleUpdateUser = async (userData: CreateUserForm) => {
    try {
      const updateData: any = {
        username: userData.username,
        email: userData.email,
        role: userData.role,
      };

      // Only include password if it's provided
      if (userData.password && userData.password.trim() !== "") {
        updateData.password = userData.password;
      }

      await api.put(`/admin/users/${editingItem.id}`, updateData);
      toast.success("User updated successfully");
      refetchUsers();
      setShowCreateForm(false);
      setEditingItem(null);
      setUserForm({ username: "", email: "", password: "", role: "USER" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Set the form data to the appointment being edited
    setAppointmentForm({
      userId: appointment.userId,
      doctorId: appointment.doctorId || "",
      testId: appointment.testId || "",
      appointmentType: appointment.appointmentType,
      appointmentDate: appointment.appointmentDate.split("T")[0], // Convert to date format
      appointmentTime: appointment.appointmentTime,
      patientName: appointment.patientName || "",
      symptoms: appointment.symptoms || "",
      notes: appointment.notes || "",
      totalAmount: appointment.totalAmount,
    });
    setEditingItem(appointment);
    setCreateFormType("appointment");
    setShowCreateForm(true);
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await api.delete(`/admin/appointments/${id}`);
        toast.success("Appointment deleted successfully");
        refetchAppointments();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete appointment"
        );
      }
    }
  };

  const handleUpdateAppointment = async (
    appointmentData: CreateAppointmentForm
  ) => {
    try {
      // Clean up the data before sending - remove empty strings for optional fields
      const cleanedData = {
        ...appointmentData,
        // Remove empty strings and set to undefined for optional fields
        doctorId:
          appointmentData.doctorId && appointmentData.doctorId.trim() !== ""
            ? appointmentData.doctorId
            : undefined,
        testId:
          appointmentData.testId && appointmentData.testId.trim() !== ""
            ? appointmentData.testId
            : undefined,
        patientName:
          appointmentData.patientName &&
          appointmentData.patientName.trim() !== ""
            ? appointmentData.patientName
            : undefined,
        symptoms:
          appointmentData.symptoms && appointmentData.symptoms.trim() !== ""
            ? appointmentData.symptoms
            : undefined,
        notes:
          appointmentData.notes && appointmentData.notes.trim() !== ""
            ? appointmentData.notes
            : undefined,
      };

      await api.put(`/admin/appointments/${editingItem.id}`, cleanedData);
      toast.success("Appointment updated successfully");
      refetchAppointments();
      setShowCreateForm(false);
      setEditingItem(null);
      setAppointmentForm({
        userId: "",
        doctorId: "",
        testId: "",
        appointmentType: "consultation",
        appointmentDate: "",
        appointmentTime: "",
        patientName: "",
        symptoms: "",
        notes: "",
        totalAmount: 0,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment"
      );
    }
  };

  const openCreateForm = (type: "user" | "doctor" | "test" | "appointment") => {
    setCreateFormType(type);
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (createFormType) {
      case "user":
        if (editingItem) {
          handleUpdateUser(userForm);
        } else {
          handleCreateUser(userForm);
        }
        break;
      case "doctor":
        if (editingItem) {
          handleUpdateDoctor(doctorForm);
        } else {
          handleCreateDoctor(doctorForm);
        }
        break;
      case "test":
        if (editingItem) {
          handleUpdateTest(testForm);
        } else {
          handleCreateTest(testForm);
        }
        break;
      case "appointment":
        if (editingItem) {
          handleUpdateAppointment(appointmentForm);
        } else {
          handleCreateAppointment(appointmentForm);
        }
        break;
    }
  };

  return (
    <div className="space-y-8 py-10 px-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-lg text-gray-600">Manage MediCare Pro system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDoctors}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TestTube className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTests}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalAppointments}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Payments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPayments}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.monthlyRevenue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "users", name: "Users", icon: Users },
            { id: "doctors", name: "Doctors", icon: Stethoscope },
            { id: "tests", name: "Tests", icon: TestTube },
            { id: "appointments", name: "Appointments", icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Users</h3>
            <button
              onClick={() => openCreateForm("user")}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No users found. Add your first user!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "doctors" && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Doctors</h3>
            <button
              onClick={() => openCreateForm("doctor")}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Doctor</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultation Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.experience} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ₹{doctor.consultationFee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {doctor.rating}/5
                        </div>
                        <div className="ml-1 text-xs text-gray-500">
                          ({doctor.rating || 0} reviews)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDoctor(doctor)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No doctors found. Add your first doctor!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "tests" && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Medical Tests</h3>
            <button
              onClick={() => openCreateForm("test")}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Test</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {test.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {test.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {test.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ₹{test.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {test.duration} minutes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          test.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {test.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTest(test)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tests.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No tests found. Add your first test!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
            <button
              onClick={() => openCreateForm("appointment")}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Appointment</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName ||
                            appointment.user?.username ||
                            "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.user?.email || "Unknown"}
                        </div>
                        {appointment.patientName && (
                          <div className="text-xs text-blue-600">
                            Patient: {appointment.patientName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {appointment.appointmentType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointmentType === "consultation"
                            ? appointment.doctor?.name || "No doctor"
                            : appointment.test?.name || "No test"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointmentTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{appointment.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No appointments found. Add your first appointment!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Forms Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? "Edit" : "Add"}{" "}
                {createFormType.charAt(0).toUpperCase() +
                  createFormType.slice(1)}
              </h3>
              <button
                onClick={closeCreateForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {createFormType === "user" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({ ...userForm, username: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          role: e.target.value as "USER" | "ADMIN",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </>
              )}

              {createFormType === "doctor" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={doctorForm.name}
                        onChange={(e) =>
                          setDoctorForm({ ...doctorForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={doctorForm.specialization}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            specialization: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={doctorForm.email}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={doctorForm.phone}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        value={doctorForm.experience}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            experience: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee
                      </label>
                      <input
                        type="number"
                        value={doctorForm.consultationFee}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            consultationFee: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={doctorForm.bio || ""}
                      onChange={(e) =>
                        setDoctorForm({ ...doctorForm, bio: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {createFormType === "test" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Name
                      </label>
                      <input
                        type="text"
                        value={testForm.name}
                        onChange={(e) =>
                          setTestForm({ ...testForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={testForm.category}
                        onChange={(e) =>
                          setTestForm({ ...testForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="General">General</option>
                        <option value="Blood Test">Blood Test</option>
                        <option value="Urine Test">Urine Test</option>
                        <option value="Imaging">Imaging</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Gynecology">Gynecology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={testForm.description}
                      onChange={(e) =>
                        setTestForm({
                          ...testForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={testForm.price}
                        onChange={(e) =>
                          setTestForm({
                            ...testForm,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={testForm.duration}
                        onChange={(e) =>
                          setTestForm({
                            ...testForm,
                            duration: parseInt(e.target.value) || 30,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Instructions
                    </label>
                    <textarea
                      value={testForm.preparationInstructions || ""}
                      onChange={(e) =>
                        setTestForm({
                          ...testForm,
                          preparationInstructions: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Normal Range
                    </label>
                    <input
                      type="text"
                      value={testForm.normalRange || ""}
                      onChange={(e) =>
                        setTestForm({
                          ...testForm,
                          normalRange: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={testForm.isAvailable}
                      onChange={(e) =>
                        setTestForm({
                          ...testForm,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Available for booking
                    </label>
                  </div>
                </>
              )}

              {createFormType === "appointment" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Type
                      </label>
                      <select
                        value={appointmentForm.appointmentType}
                        onChange={(e) => {
                          const newType = e.target.value as
                            | "consultation"
                            | "test";
                          setAppointmentForm({
                            ...appointmentForm,
                            appointmentType: newType,
                            doctorId:
                              newType === "consultation"
                                ? appointmentForm.doctorId
                                : "",
                            testId:
                              newType === "test" ? appointmentForm.testId : "",
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="consultation">Consultation</option>
                        <option value="test">Test</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select User
                      </label>
                      <select
                        value={appointmentForm.userId}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            userId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={appointmentForm.patientName || ""}
                      onChange={(e) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          patientName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter patient name if different from user"
                    />
                  </div>
                  {appointmentForm.appointmentType === "consultation" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Doctor
                      </label>
                      <select
                        value={appointmentForm.doctorId || ""}
                        onChange={(e) => {
                          setAppointmentForm({
                            ...appointmentForm,
                            doctorId: e.target.value,
                          });
                          // Update amount after state change
                          setTimeout(() => {
                            if (e.target.value) {
                              const selectedDoctor = doctors.find(
                                (d) => d.id === e.target.value
                              );
                              if (selectedDoctor) {
                                setAppointmentForm((prev) => ({
                                  ...prev,
                                  totalAmount: selectedDoctor.consultationFee,
                                }));
                              }
                            }
                          }, 0);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} ({doctor.specialization})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {appointmentForm.appointmentType === "test" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Test
                      </label>
                      <select
                        value={appointmentForm.testId || ""}
                        onChange={(e) => {
                          setAppointmentForm({
                            ...appointmentForm,
                            testId: e.target.value,
                          });
                          // Update amount after state change
                          setTimeout(() => {
                            if (e.target.value) {
                              const selectedTest = tests.find(
                                (t) => t.id === e.target.value
                              );
                              if (selectedTest) {
                                setAppointmentForm((prev) => ({
                                  ...prev,
                                  totalAmount: selectedTest.price,
                                }));
                              }
                            }
                          }, 0);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select a test</option>
                        {tests.map((test) => (
                          <option key={test.id} value={test.id}>
                            {test.name} ({test.category}) - ₹{test.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Date
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Only future dates are allowed
                      </p>
                      <input
                        type="date"
                        value={appointmentForm.appointmentDate}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          const today = new Date().toISOString().split("T")[0];
                          const currentTime = new Date()
                            .toTimeString()
                            .slice(0, 5);

                          setAppointmentForm({
                            ...appointmentForm,
                            appointmentDate: selectedDate,
                            // Reset time if selected date is today and current time is past the selected time
                            appointmentTime:
                              selectedDate === today &&
                              appointmentForm.appointmentTime &&
                              appointmentForm.appointmentTime < currentTime
                                ? ""
                                : appointmentForm.appointmentTime,
                          });
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Time
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        {appointmentForm.appointmentDate ===
                        new Date().toISOString().split("T")[0]
                          ? "Only future times are allowed for today"
                          : "Select any available time"}
                      </p>
                      <input
                        type="time"
                        value={appointmentForm.appointmentTime}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            appointmentTime: e.target.value,
                          })
                        }
                        min={
                          appointmentForm.appointmentDate ===
                          new Date().toISOString().split("T")[0]
                            ? new Date().toTimeString().slice(0, 5)
                            : "00:00"
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symptoms
                    </label>
                    <textarea
                      value={appointmentForm.symptoms || ""}
                      onChange={(e) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          symptoms: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={appointmentForm.notes || ""}
                      onChange={(e) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={appointmentForm.totalAmount}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Amount will be calculated automatically"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeCreateForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingItem ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
