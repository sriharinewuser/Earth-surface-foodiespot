import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : 'https://earth-surface-foodiespot.vercel.app';

// Enable credentials (cookies) for cross-origin requests
