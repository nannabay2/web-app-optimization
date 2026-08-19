import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(URL, { headers });
      const data = await response.json();
      setPosts(data);
    }

    getPosts();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!caption.trim()) {
      return;
    }

    setPosts((currentPosts) => [
      {
        id: crypto.randomUUID(),
        caption: caption.trim(),
        image: imageUrl.trim() || "https://picsum.photos/800/600",
        created_at: new Date().toISOString(),
      },
      ...currentPosts,
    ]);
    setCaption("");
    setImageUrl("");
    setIsComposerOpen(false);
  }

  return (
    <>
      <header>
        <h1>Posts</h1>
        <button
          className="page-cta"
          type="button"
          onClick={() => setIsComposerOpen((current) => !current)}
        >
          Post
        </button>
      </header>
      <main>
        {isComposerOpen ? (
          <form className="post-composer" onSubmit={handleSubmit}>
            <label className="post-composer-field">
              <span>Tekst</span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Skriv din post her"
                rows="4"
              />
            </label>
            <label className="post-composer-field">
              <span>Billede-URL</span>
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://..."
                type="url"
              />
            </label>
            <button className="post-composer-submit" type="submit">
              Gem post
            </button>
          </form>
        ) : null}
        <section className="posts-grid" aria-label="Supabase posts">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </main>
    </>
  );
}
