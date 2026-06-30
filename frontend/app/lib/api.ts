export type Post = {
  id: number;
  title: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API 오류 ${res.status}: ${text}`);
  }
  // 204 No Content 는 본문 없음
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function getPosts(): Promise<Post[]> {
  return request<Post[]>("/api/posts");
}

export function createPost(body: Pick<Post, "title" | "author" | "content">): Promise<Post> {
  return request<Post>("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deletePost(id: number): Promise<void> {
  return request<void>(`/api/posts/${id}`, { method: "DELETE" });
}
