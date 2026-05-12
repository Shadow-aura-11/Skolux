/**
 * Skolux API Utility
 * Handles multi-tenant communication via path-based identification.
 */

const API_BASE = '/api/index.php';

export const getSchoolKey = () => {
  // Extract school key from path: /schoolId/erp/...
  const hashPath = window.location.hash.replace(/^#\/?/, ''); // removes # or #/
  const pathParts = hashPath.split('/').filter(p => p !== '');
  const key = pathParts[0];

  // If first part is a known route, check URL params or default
  if (!key || ['agency', 'erp', 'contact', 'services', 'demos'].includes(key)) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('school') || 'nms';
  }
  
  return key;
};

export const api = {
  async get(type, session = 'global') {
    const schoolId = getSchoolKey();
    try {
      const response = await fetch(`${API_BASE}?action=get&type=${type}&session=${session}&school_id=${schoolId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${type} for ${schoolId}:`, error);
      const local = localStorage.getItem(`erp_${schoolId}_${type}_${session}`);
      return local ? JSON.parse(local) : [];
    }
  },

  async save(type, data, session = 'global') {
    const schoolId = getSchoolKey();
    localStorage.setItem(`erp_${schoolId}_${type}_${session}`, JSON.stringify(data));

    try {
      const response = await fetch(`${API_BASE}?action=save&type=${type}&session=${session}&school_id=${schoolId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Error saving ${type} for ${schoolId}:`, error);
      return { error: error.message };
    }
  }
};
