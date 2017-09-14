export default function getKeyandCertificates() {
    const env = process.env;
    return {
        private: env.WSFED_PRIVATE_KEY,
        public: env.WSFED_PUBLIC_KEY,
        cert: env.WSFED_CERTIFICATE
    };
}