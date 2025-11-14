import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function FoodWastageTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wasteEntries, setWasteEntries] = useState([]);
  const [statistics, setStatistics] = useState({
    totalWaste: 0,
    totalEntries: 0,
    avgWaste: 0,
    carbonImpact: 0,
    byCategory: {},
    byReason: {}
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    foodItem: '',
    category: '',
    quantity: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchEntries();
    fetchStatistics();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/waste-entries`);
      const data = await response.json();
      if (data.success) {
        setWasteEntries(data.data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_URL}/statistics`);
      const data = await response.json();
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.foodItem || !formData.category || !formData.quantity || !formData.reason) {
      alert('❌ Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/waste-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity)
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Waste entry logged successfully!');
        setFormData({
          foodItem: '',
          category: '',
          quantity: '',
          reason: '',
          notes: ''
        });
        fetchEntries();
        fetchStatistics();
        setActiveTab('dashboard');
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('❌ Error submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`${API_URL}/waste-entries/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Entry deleted successfully!');
        fetchEntries();
        fetchStatistics();
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('❌ Error deleting entry. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderCategoryChart = () => {
    const categories = Object.entries(statistics.byCategory || {});
    if (categories.length === 0) {
      return <p className="text-gray-500 text-center py-4">No data yet</p>;
    }

    const maxValue = Math.max(...categories.map(([, val]) => val));

    return categories
      .sort((a, b) => b[1] - a[1])
      .map(([category, value]) => {
        const width = (value / maxValue) * 100;
        return (
          <div key={category} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">{category}</span>
              <span className="text-gray-600">{value.toFixed(2)} kg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full flex items-center px-3 text-white text-sm font-semibold transition-all duration-500"
                style={{ width: `${width}%` }}
              >
                {width > 20 && `${width.toFixed(0)}%`}
              </div>
            </div>
          </div>
        );
      });
  };

  const renderReasonChart = () => {
    const reasons = Object.entries(statistics.byReason || {});
    if (reasons.length === 0) {
      return <p className="text-gray-500 text-center py-4">No data yet</p>;
    }

    const maxValue = Math.max(...reasons.map(([, val]) => val));

    return reasons
      .sort((a, b) => b[1] - a[1])
      .map(([reason, value]) => {
        const width = (value / maxValue) * 100;
        return (
          <div key={reason} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">{reason}</span>
              <span className="text-gray-600">{value.toFixed(2)} kg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-8 rounded-full flex items-center px-3 text-white text-sm font-semibold transition-all duration-500"
                style={{ width: `${width}%` }}
              >
                {width > 20 && `${width.toFixed(0)}%`}
              </div>
            </div>
          </div>
        );
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">🌍 Food Wastage Tracker</h1>
          <p className="text-lg md:text-xl opacity-90 mb-4">Track, Reduce, and Make a Difference</p>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-semibold">
            SDG 12: Responsible Consumption
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-gray-50 border-b-4 border-gray-200">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'track', label: '➕ Track Waste' },
            { id: 'history', label: '📜 History' },
            { id: 'analytics', label: '📈 Analytics' },
            { id: 'tips', label: '💡 Tips' },
            { id: 'about', label: 'ℹ️ About' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] py-4 px-6 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 border-b-4 border-green-600 -mb-1'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">📊 Your Impact Dashboard</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-4xl font-bold mb-2">{statistics.totalWaste}</h3>
                  <p className="text-lg opacity-90">Total Waste (kg)</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-4xl font-bold mb-2">{statistics.totalEntries}</h3>
                  <p className="text-lg opacity-90">Entries Logged</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-4xl font-bold mb-2">{statistics.avgWaste}</h3>
                  <p className="text-lg opacity-90">Average per Entry (kg)</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-4xl font-bold mb-2">{statistics.carbonImpact}</h3>
                  <p className="text-lg opacity-90">CO₂ Awareness (kg)</p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Waste by Category</h3>
                {renderCategoryChart()}
              </div>
            </div>
          )}

          {/* Track Waste Tab */}
          {activeTab === 'track' && (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">➕ Log Food Waste</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Food Item *
                  </label>
                  <input
                    type="text"
                    name="foodItem"
                    value={formData.foodItem}
                    onChange={handleInputChange}
                    placeholder="e.g., Rice, Bread, Vegetables"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                  >
                    <option value="">Select Category</option>
                    <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                    <option value="Grains & Bakery">Grains & Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat & Fish">Meat & Fish</option>
                    <option value="Prepared Food">Prepared Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    placeholder="0.0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Waste *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                  >
                    <option value="">Select Reason</option>
                    <option value="Spoiled">Spoiled/Expired</option>
                    <option value="Overcooked">Overcooked</option>
                    <option value="Excess">Excess Preparation</option>
                    <option value="Disliked">Taste/Disliked</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Additional details..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Log Waste Entry'}
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">📜 Waste History</h2>

              {wasteEntries.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No entries yet. Start tracking your food waste!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {wasteEntries.map(entry => (
                    <div
                      key={entry._id}
                      className="bg-gray-50 p-6 rounded-xl border-l-4 border-green-500 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">{entry.foodItem}</h3>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                        <p><strong>Category:</strong> {entry.category}</p>
                        <p><strong>Quantity:</strong> {entry.quantity} kg</p>
                        <p><strong>Reason:</strong> {entry.reason}</p>
                        <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleDateString()}</p>
                      </div>

                      {entry.notes && (
                        <p className="mt-3 text-gray-600"><strong>Notes:</strong> {entry.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">📈 Detailed Analytics</h2>

              <div className="bg-gray-50 p-8 rounded-2xl mb-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Waste by Reason</h3>
                {renderReasonChart()}
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Progress</h3>
                <p className="text-gray-700 text-lg mb-2">
                  Total waste tracked: <strong>{statistics.totalWaste} kg</strong>
                </p>
                <p className="text-gray-600">
                  Keep logging entries to see your monthly trends and reduction progress!
                </p>
              </div>
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">💡 Waste Reduction Tips</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: '🥗', title: 'Plan Your Meals', text: 'Create a weekly meal plan and shopping list to buy only what you need.' },
                  { icon: '🧊', title: 'Store Properly', text: 'Learn proper storage techniques for different foods to extend shelf life.' },
                  { icon: '👁️', title: 'First In, First Out', text: 'Use older items before newer ones. Check expiration dates regularly.' },
                  { icon: '🍲', title: 'Get Creative', text: 'Transform leftovers into new meals. Soup, smoothies, and stir-fries work great!' },
                  { icon: '📏', title: 'Portion Control', text: 'Start with smaller portions. You can always get more if needed.' },
                  { icon: '🌱', title: 'Compost', text: 'Turn unavoidable waste into nutrient-rich compost for plants.' }
                ].map((tip, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition"
                  >
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                    <p className="opacity-90">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Tab (If needed) */}
          {activeTab === 'about' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">ℹ️ About This Project</h2>
              <p className="text-gray-700 leading-relaxed">
                This Food Wastage Tracker helps you log, visualize, and analyze your food waste habits to promote sustainable living.
                It aligns with **SDG 12: Responsible Consumption and Production**, empowering individuals to reduce waste and environmental impact.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
