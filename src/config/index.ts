interface Config {
  api: {
    baseURL: string;
    timeout: number;
  };
}

const config: Config = {
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
  },
};

export default config; 