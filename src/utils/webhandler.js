const BASE_URL = 'https://yoga-api-nzy4.onrender.com/v1';

export const getAllCategories = async () => {
  const response = await fetch(
    'https://yoga-api-nzy4.onrender.com/v1/categories',
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text(); // debug HTML error
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }

  return await response.json();
};

export const getCategoryById = async (id, level = 'beginner') => {
  try {
    const response = await fetch(
      `${BASE_URL}/categories?id=${id}&level=${level}`,
    );
    if (!response.ok) throw new Error('Failed to fetch category details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return {};
  }
};

export const getPosebyId = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/poses?id=${id}`,
    );
    if (!response.ok) throw new Error('Failed to fetch category details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return {};
  }
};

