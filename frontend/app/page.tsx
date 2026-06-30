"use client";

import { useEffect, useState } from "react";
import { createPost, deletePost, getPosts, type Post } from "./lib/api";

type FormState = { title: string; author: string; content: string };
const EMPTY_FORM: FormState = { title: "", author: "", content: "" };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      setPosts(await getPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      await createPost(form);
      setForm(EMPTY_FORM);
      await fetchPosts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">게시판</h1>

      {/* 글 작성 폼 */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-base font-semibold text-gray-700">새 글 작성</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="제목"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="작성자"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <textarea
            placeholder="내용"
            rows={4}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="self-end rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "등록 중…" : "등록"}
          </button>
        </div>
      </form>

      {/* 에러 */}
      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
          {error}
        </p>
      )}

      {/* 목록 */}
      {loading ? (
        <p className="text-center text-sm text-gray-400">불러오는 중…</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-sm text-gray-400">아직 게시글이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {post.author} ·{" "}
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                {post.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
