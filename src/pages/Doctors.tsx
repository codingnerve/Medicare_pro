import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, DollarSign } from "lucide-react";
import { api } from "@/lib/api";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating: number;
  totalRatings: number;
  bio: string;
  qualifications: string[];
  availableSlots: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
}

export function Doctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxFee, setMaxFee] = useState("");

  const handleBookAppointment = (doctor: Doctor) => {
    // Navigate to appointment booking with doctor pre-selected
    navigate("/book-appointment", {
      state: {
        selectedType: "consultation",
        selectedDoctor: doctor,
      },
    });
  };

  const {
    data: doctorsData,
    isLoading,
    error,
  } = useQuery(
    ["doctors", searchTerm, selectedSpecialization, minRating, maxFee],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedSpecialization)
        params.append("specialization", selectedSpecialization);
      if (minRating) params.append("minRating", minRating);
      if (maxFee) params.append("maxFee", maxFee);

      const response = await api.get(`/doctors?${params.toString()}`);
      return response.data;
    }
  );

  const { data: specializationsData } = useQuery(
    "specializations",
    async () => {
      const response = await api.get("/doctors/specializations");
      return response.data;
    }
  );

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
        <p className="text-red-600">Failed to load doctors</p>
      </div>
    );
  }

  const doctors: Doctor[] = doctorsData?.data || [];

  return (
    <div className="space-y-6 py-10 px-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Doctor
        </h1>
        <p className="text-gray-600">
          Search and book appointments with qualified healthcare professionals
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="input"
          >
            <option value="">All Specializations</option>
            {specializationsData?.data?.map((spec: string) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Rating"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="input"
            min="0"
            max="5"
            step="0.1"
          />

          <input
            type="number"
            placeholder="Max Fee"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            className="input"
            min="0"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-primary-600 font-medium">
                  {doctor.specialization}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{doctor.rating}</span>
                <span className="text-sm text-gray-500">
                  ({doctor.totalRatings})
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {doctor.bio}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{doctor.experience} years experience</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>₹{doctor.consultationFee} consultation fee</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Available Days:
              </h4>
              <div className="flex flex-wrap gap-1">
                {doctor.availableSlots
                  .filter((slot) => slot.isAvailable)
                  .slice(0, 3)
                  .map((slot, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {slot.day.slice(0, 3)}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleBookAppointment(doctor)}
                className="btn btn-primary flex-1"
              >
                Book Appointment
              </button>
              <button className="btn btn-secondary">View Profile</button>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No doctors found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
