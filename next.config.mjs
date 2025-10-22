import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  }
};

export default withNextIntl(nextConfig);
