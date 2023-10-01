/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@lifi/widget", "@lifi/wallet-management"],
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     use: [
  //       {
  //         loader: "@svgr/webpack",
  //         options: {
  //           svgoConfig: {
  //             plugins: [
  //               {
  //                 name: "preset-default",
  //                 params: {
  //                   overrides: {
  //                     removeViewBox: false,
  //                     cleanupIds: {
  //                       minify: false,
  //                     },
  //                   },
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       },
  //     ],
  //   });
  //   return config;
  // },
};

module.exports = nextConfig;
