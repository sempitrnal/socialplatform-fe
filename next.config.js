/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		API_BASE_URL: process.env.API_BASE_URL,
		BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
	},
	images: {
		domains: ["localhost"],
	},
};

module.exports = nextConfig;
