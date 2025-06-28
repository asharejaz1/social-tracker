import React, { useState } from "react";

type Props = {
  dataByAccount: Record<string, any>;
};

const SocialTabs: React.FC<Props> = ({ dataByAccount }) => {
  const urls = Object.keys(dataByAccount);
  const [activeTab, setActiveTab] = useState(urls[0] || "");

  const renderInstagramPost = (post: any) => (
    <div
      key={post.shortCode}
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        maxWidth: 600,
      }}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "blue" }}
      >
        <h3>
          {post.ownerFullName} (@{post.ownerUsername})
        </h3>
      </a>

      <img
        src={post.displayUrl}
        alt={post.alt || "Instagram post image"}
        style={{ maxWidth: "100%", borderRadius: 6, margin: "8px 0" }}
      />

      <p>{post.caption}</p>

      <p>
        <strong>Likes:</strong> {post.likesCount} &nbsp;|&nbsp;{" "}
        <strong>Comments:</strong> {post.commentsCount}
      </p>

      <p>
        <small>{new Date(post.timestamp).toLocaleString()}</small>
      </p>

      {post.firstComment && (
        <blockquote
          style={{ marginTop: 8, fontStyle: "italic", color: "#555" }}
        >
          First comment: {post.firstComment}
        </blockquote>
      )}
    </div>
  );

  const renderTikTokPost = (post: any) => (
    <div
      key={post.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        maxWidth: 600,
      }}
    >
      <img src={post.videoMeta.coverUrl} className="h-60 w-auto" />

      <p>{post.text}</p>

      <p>
        <strong>Views:</strong> {post.playCount} &nbsp;|&nbsp;{" "}
        <strong>Comments:</strong> {post.commentCount} &nbsp;|&nbsp;{" "}
        <strong>Shares:</strong> {post.shareCount}
      </p>

      <p>
        <small>{new Date(post.createTime).toLocaleString()}</small>
      </p>
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
        {urls.map((url) => (
          <button
            key={url}
            onClick={() => setActiveTab(url)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              border: "none",
              borderBottom:
                activeTab === url ? "3px solid blue" : "3px solid transparent",
              backgroundColor: "transparent",
              fontWeight: activeTab === url ? "bold" : "normal",
            }}
          >
            {url
              .replace("https://www.instagram.com/", "")
              .replace("https://www.tiktok.com/", "")}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ padding: "16px" }}>
        {activeTab && dataByAccount[activeTab]?.posts.length === 0 && (
          <p>No posts found for this account.</p>
        )}

        {activeTab &&
          dataByAccount[activeTab].platform === "instagram" &&
          dataByAccount[activeTab].posts.map(renderInstagramPost)}

        {activeTab &&
          dataByAccount[activeTab].platform === "tiktok" &&
          dataByAccount[activeTab].posts.map(renderTikTokPost)}
      </div>
    </div>
  );
};

export default SocialTabs;
