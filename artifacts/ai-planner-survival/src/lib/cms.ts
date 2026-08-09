import { cache } from "react";

import type { ContentKind, Post, Status } from "../data";
import { supabase } from "./supabase";

type JsonRecord = Record<string, unknown>;

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  kind: string;
  status: Status;
  published_at: string | null;
  reading_time: string;
  tags: string[] | null;
  summary: unknown;
  toc: unknown;
  body: unknown;
  mistakes: unknown;
  checklist: unknown;
  related_slugs: string[] | null;
  featured: boolean | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
const sections = (value: unknown): Post["body"] =>
  Array.isArray(value)
    ? value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const record = item as JsonRecord;
        return typeof record.heading === "string"
          ? [
              {
                heading: record.heading,
                paragraphs: strings(record.paragraphs),
              },
            ]
          : [];
      })
    : [];
const markdown = (value: unknown) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  typeof (value as { markdown?: unknown }).markdown === "string"
    ? (value as { markdown: string }).markdown
    : undefined;
const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date(value))
        .replace(/ /g, "")
        .replace(/\.$/, "")
    : "";

export const toPost = (row: PostRow): Post => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  category: row.category,
  kind: (row.kind || "현장 기록") as ContentKind,
  status: row.status,
  publishedAt: formatDate(row.published_at),
  publishedAtIso: row.published_at ?? undefined,
  revisedAt: formatDate(row.updated_at),
  updatedAtIso: row.updated_at ?? undefined,
  coverImageUrl: row.cover_image_url ?? undefined,
  readingTime: row.reading_time || "5분",
  tags: row.tags ?? [],
  summary: strings(row.summary),
  toc: strings(row.toc),
  body: sections(row.body),
  bodyMarkdown: markdown(row.body),
  mistakes: strings(row.mistakes),
  checklist: strings(row.checklist),
  related: row.related_slugs ?? [],
  featured: Boolean(row.featured),
});

export type PostInput = Omit<Post, "id" | "publishedAt" | "revisedAt">;
export const toPostRow = (
  post: PostInput,
  status: Status,
  publishedAt: string | null,
): Omit<PostRow, "id" | "created_at" | "updated_at"> => ({
  slug: post.slug.trim(),
  title: post.title.trim(),
  excerpt: post.excerpt.trim(),
  category: post.category,
  kind: post.kind,
  status,
  published_at: publishedAt,
  reading_time: post.readingTime.trim() || "5분",
  tags: post.tags.filter(Boolean),
  summary: post.summary.filter(Boolean),
  toc: post.toc.filter(Boolean),
  body: post.bodyMarkdown?.trim()
    ? { markdown: post.bodyMarkdown }
    : post.body.filter((section) => section.heading.trim()),
  mistakes: post.mistakes.filter(Boolean),
  checklist: post.checklist.filter(Boolean),
  related_slugs: post.related.filter(Boolean),
  featured: Boolean(post.featured),
  cover_image_url: post.coverImageUrl?.trim() || null,
});

async function requireClient() {
  if (!supabase) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return supabase;
}

export async function fetchPublishedContent() {
  const client = await requireClient();
  const result = await client
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (result.error) throw result.error;
  return { posts: (result.data as PostRow[]).map(toPost) };
}

export const fetchPublishedPostBySlug = cache(
  async (slug: string): Promise<Post | null> => {
    if (!supabase) return null;
    const result = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();
    if (result.error) throw result.error;
    return result.data ? toPost(result.data as PostRow) : null;
  },
);

export const fetchPublishedContentCached = cache(fetchPublishedContent);

export async function fetchAdminPosts() {
  const client = await requireClient();
  const result = await client
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (result.error) throw result.error;
  return (result.data as PostRow[]).map(toPost);
}

export async function createDraft(title: string) {
  const client = await requireClient();
  const stamp = Date.now();
  const result = await client
    .from("posts")
    .insert(
      toPostRow(
        {
          slug: `draft-${stamp}`,
          title: title.trim() || "제목 없는 초안",
          excerpt: "",
          category: "planning-note",
          kind: "현장 기록",
          status: "draft",
          readingTime: "5분",
          tags: [],
          summary: [],
          toc: [],
          body: [],
          mistakes: [],
          checklist: [],
          related: [],
          featured: false,
        },
        "draft",
        null,
      ),
    )
    .select()
    .single();
  if (result.error) throw result.error;
  return toPost(result.data as PostRow);
}

export async function savePost(
  id: string,
  post: PostInput,
  status: Status,
  publishedAt: string | null,
) {
  const client = await requireClient();
  const result = await client
    .from("posts")
    .update(toPostRow(post, status, publishedAt))
    .eq("id", id)
    .select()
    .single();
  if (result.error) throw result.error;
  return toPost(result.data as PostRow);
}

export async function uploadCoverImage(file: File) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type))
    throw new Error("JPG, PNG, WebP 파일만 업로드할 수 있습니다.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("이미지는 5MB 이하여야 합니다.");
  const client = await requireClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("이미지 업로드를 위해 다시 로그인해 주세요.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const upload = await client.storage.from("post-images").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (upload.error) throw upload.error;
  return client.storage.from("post-images").getPublicUrl(upload.data.path).data
    .publicUrl;
}

export async function removePost(id: string) {
  const client = await requireClient();
  const result = await client.from("posts").delete().eq("id", id);
  if (result.error) throw result.error;
}
