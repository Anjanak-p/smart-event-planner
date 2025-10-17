import React, { useState } from 'react';
import { aiAPI } from '../../utils/api';
import { EVENT_TYPES } from '../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AISuggestions = () => {
  const [formData, setFormData] = useState({
    type: '',
    guests: '',
    budget: '',
    location: '',
    theme: ''
  });
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuggestion('');

    try {
      const response = await aiAPI.getSuggestion(formData);
      
      if (response.data.success) {
        setSuggestion(response.data.data.suggestion);
      } else {
        setError(response.data.message || 'Failed to get AI suggestions');
      }
    } catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.msg
        || error.message 
        || 'Failed to get AI suggestions';
      
      setError(errorMessage);
      console.error('AI Suggestion Error Details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test AI configuration
  const testAIConfig = async () => {
    try {
      const response = await aiAPI.get('/ai/test');
      console.log('AI Config Test:', response.data);
      alert(`AI Configuration Test:\nOpenAI Configured: ${response.data.data.openai_configured}\nHas API Key: ${response.data.data.has_api_key}`);
    } catch (error) {
      console.error('AI Config Test Failed:', error);
      alert('AI configuration test failed. Check console for details.');
    }
  };

  const examplePrompts = [
    {
      type: 'wedding',
      guests: '150',
      budget: '500000',
      location: 'Beach resort',
      theme: 'Tropical romance'
    },
    {
      type: 'birthday',
      guests: '50',
      budget: '50000',
      location: 'Backyard',
      theme: 'Vintage glam'
    },
    {
      type: 'corporate',
      guests: '100',
      budget: '200000',
      location: 'Conference center',
      theme: 'Modern professional'
    }
  ];

  const loadExample = (example) => {
    setFormData(example);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Event Suggestions</h1>
            <p className="text-gray-600 mt-2">
              Get personalized event planning suggestions powered by AI.
            </p>
          </div>
          <button
            onClick={testAIConfig}
            className="btn-secondary text-sm"
            type="button"
          >
            Test AI Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>This could be due to:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Missing OpenAI API key</li>
                        <li>Invalid API configuration</li>
                        <li>Network connectivity issues</li>
                        <li>Server configuration problems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  required
                  min="1"
                  value={formData.guests}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹) *
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  required
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Beach, Garden, Hotel"
              />
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Theme
              </label>
              <input
                type="text"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Rustic, Modern, Vintage"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="small" text="AI is thinking..." />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Get AI Suggestions</span>
                </>
              )}
            </button>
          </form>

          {/* Example Prompts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Try these examples:</h3>
            <div className="space-y-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {EVENT_TYPES.find(t => t.value === example.type)?.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {example.guests} guests • ₹{example.budget} • {example.location}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Suggestions</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner text="AI is thinking..." />
            </div>
          ) : suggestion ? (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {suggestion}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
              <p className="text-gray-600">
                {error ? 'Fix the error above and try again.' : 'Fill in your event details to get AI suggestions.'}
              </p>
              {error && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> The app will use mock AI responses if OpenAI is not configured.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;