import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";

function NewsItemLoader() {
  return (
    <ContentLoader
      width={400}
      height={80}
      backgroundColor="#d9d9d9"
      foregroundColor="#ededed"
      style={{ width: "100%" }}
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
}

export default NewsItemLoader;
