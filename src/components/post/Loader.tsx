import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#e5e7eb"
    foregroundColor="#ecebeb"
  >
    <rect x="84" y="16" rx="3" ry="3" width="88" height="12" />
    <rect x="180" y="16" rx="3" ry="3" width="12" height="12" />
    <rect x="200" y="16" rx="3" ry="3" width="88" height="12" />
    <rect x="84" y="35" rx="3" ry="3" width="300" height="12" />
    <rect x="17" y="10" rx="16" ry="16" width="50" height="50" />
    <rect x="84" y="64" rx="6" ry="6" width="130" height="32" />
  </ContentLoader>
);

export default Loader;
