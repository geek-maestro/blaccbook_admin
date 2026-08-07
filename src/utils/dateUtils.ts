export const formatDate = (dateVal: any, fallback = 'N/A'): string => {
  if (!dateVal) return fallback;

  try {
    // Handle Firestore Timestamp object with toDate()
    if (typeof dateVal === 'object' && typeof dateVal.toDate === 'function') {
      return dateVal.toDate().toLocaleDateString();
    }

    // Handle Firestore Timestamp object with seconds / _seconds
    if (typeof dateVal === 'object') {
      const seconds = dateVal.seconds ?? dateVal._seconds;
      if (typeof seconds === 'number') {
        return new Date(seconds * 1000).toLocaleDateString();
      }
    }

    // Handle number timestamp
    if (typeof dateVal === 'number') {
      return new Date(dateVal).toLocaleDateString();
    }

    // Handle string dates including "July 25, 2026 at 1:40:16 PM UTC"
    if (typeof dateVal === 'string') {
      const cleaned = dateVal.replace(/\s+at\s+/gi, ' ').replace(/\u202f/g, ' ').trim();
      const parsed = new Date(cleaned);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString();
      }

      const direct = new Date(dateVal);
      if (!isNaN(direct.getTime())) {
        return direct.toLocaleDateString();
      }

      return dateVal;
    }

    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString();
    }
  } catch (err) {
    console.warn("Date formatting error:", err);
  }

  return typeof dateVal === 'string' ? dateVal : fallback;
};
