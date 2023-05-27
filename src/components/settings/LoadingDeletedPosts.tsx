import React from "react";
import ContentLoader from "react-content-loader";

const LoadingDeletedPosts = () => (
  <div className="space-y-8">
    <ContentLoader
      speed={2}
      width={400}
      height={160}
      viewBox="0 0 400 160"
      backgroundColor="#e5e7eb"
      foregroundColor="#ecebeb"
    >
      <rect x="20" y="16" rx="3" ry="3" width="88" height="14" />
      <rect x="117" y="16" rx="3" ry="3" width="14" height="14" />
      <rect x="141" y="16" rx="3" ry="3" width="88" height="14" />
      <rect x="20" y="66" rx="3" ry="3" width="88" height="14" />
      <rect x="117" y="66" rx="3" ry="3" width="14" height="14" />
      <rect x="141" y="66" rx="3" ry="3" width="88" height="14" />
      <rect x="20" y="116" rx="3" ry="3" width="88" height="14" />
      <rect x="117" y="116" rx="3" ry="3" width="14" height="14" />
      <rect x="141" y="116" rx="3" ry="3" width="88" height="14" />
    </ContentLoader>
  </div>
);

export default LoadingDeletedPosts;
