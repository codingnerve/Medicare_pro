import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Search, Clock, DollarSign, TestTube } from "lucide-react";
import { api } from "@/lib/api";

interface Test {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  preparationInstructions?: string;
  normalRange?: string;
  isAvailable: boolean;
}

export function Tests() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleBookTest = (test: Test) => {
    // Navigate to appointment booking with test pre-selected
    navigate("/book-appointment", {
      state: {
        selectedType: "test",
        selectedTest: test,
      },
    });
  };

  const {
    data: testsData,
    isLoading,
    error,
  } = useQuery(
    ["tests", searchTerm, selectedCategory, minPrice, maxPrice],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const response = await api.get(`/tests?${params.toString()}`);
      return response.data;
    }
  );

  const { data: categoriesData } = useQuery("test-categories", async () => {
    const response = await api.get("/tests/categories");
    return response.data;
  });

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
        <p className="text-red-600">Failed to load tests</p>
      </div>
    );
  }

  const tests: Test[] = testsData?.data || [];

  return (
    <div className="space-y-6 py-10 px-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Tests</h1>
        <p className="text-gray-600">
          Browse and book diagnostic tests and health screenings
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {categoriesData?.data?.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input"
            min="0"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input"
            min="0"
          />
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <TestTube className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {test.name}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {test.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {test.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{test.duration} minutes</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>₹{test.price}</span>
              </div>
            </div>

            {test.preparationInstructions && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Preparation:
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {test.preparationInstructions}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleBookTest(test)}
                className="btn btn-primary flex-1"
              >
                Book Test
              </button>
              <button className="btn btn-secondary">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No tests found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
