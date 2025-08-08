
import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5000/api' : 'https://foodiespicy00.onrender.com/api';

// Enable credentials (cookies) for cross-origin requests
axios.defaults.withCredentials = true;
