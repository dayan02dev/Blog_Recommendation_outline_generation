// Define the base URL for the backend API
// In a real application, this would likely come from an environment variable
const API_BASE_URL = 'http://localhost:5000';

// Interface for the expected successful response from /api/topics
export interface TopicSuggestionsResponse {
  generated_topics: string[];
}

// Interface for a potential error response from the API
export interface ApiErrorResponse {
  error: string;
  message?: string; // Optional more detailed message
}

/**
 * Fetches topic suggestions from the backend API.
 * @param theme The blog theme or topic area.
 * @param numTopics The number of topic suggestions desired.
 * @returns A promise that resolves to an array of topic strings.
 * @throws An error if the API request fails or returns an error.
 */
export async function fetchTopicSuggestions(
  theme: string,
  numTopics: number
): Promise<string[]> {
  const url = `${API_BASE_URL}/api/topics`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        theme: theme,
        num_topics: numTopics,
      }),
    });

    if (!response.ok) {
      // Attempt to parse error response from the body
      let errorData: ApiErrorResponse | null = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if error response is not valid JSON
      }

      const errorMessage =
        errorData?.error || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data: TopicSuggestionsResponse = await response.json();
    
    if (!data.generated_topics) {
        throw new Error("API Error: Response did not contain 'generated_topics'.");
    }
    
    return data.generated_topics;

  } catch (error) {
    if (error instanceof Error) {
      console.error('fetchTopicSuggestions error:', error.message);
      throw error; // Re-throw the error to be handled by the caller
    }
    // Fallback for non-Error objects thrown
    console.error('fetchTopicSuggestions unexpected error:', error);
    throw new Error('An unexpected error occurred while fetching topic suggestions.');
  }
}

// Interface for a single section in the blog outline
export interface OutlineSection {
  heading: string;
  key_points: string[];
}

// Interface for the overall blog outline structure
export interface BlogOutlineData {
  title_suggestion: string;
  introduction_hook: string;
  sections: OutlineSection[];
  conclusion_summary: string;
  call_to_action?: string; // Optional
}

// Interface for the expected successful response from /api/outline
export interface OutlineResponse {
  generated_outline: BlogOutlineData;
}

/**
 * Fetches a blog post outline from the backend API.
 * @param selectedTopic The topic for which to generate an outline.
 * @param targetAudience The target audience for the blog post.
 * @returns A promise that resolves to the blog outline data.
 * @throws An error if the API request fails or returns an error.
 */
export async function fetchBlogOutline(
  selectedTopic: string,
  targetAudience: string
): Promise<BlogOutlineData> {
  const url = `${API_BASE_URL}/api/outline`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selected_topic: selectedTopic,
        target_audience: targetAudience,
      }),
    });

    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if error response is not valid JSON
      }
      const errorMessage =
        errorData?.error || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data: OutlineResponse = await response.json();

    if (!data.generated_outline) {
      throw new Error("API Error: Response did not contain 'generated_outline'.");
    }

    return data.generated_outline;

  } catch (error) {
    if (error instanceof Error) {
      console.error('fetchBlogOutline error:', error.message);
      throw error;
    }
    console.error('fetchBlogOutline unexpected error:', error);
    throw new Error('An unexpected error occurred while fetching the blog outline.');
  }
}
