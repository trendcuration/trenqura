"use client";

import {
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  categories,
  getCategory,
  type ContentKind,
  type Post,
  type Status,
} from "../data";
import {
  createDraft,
  fetchAdminPosts,
  type PostInput,
  removePost,
  savePost,
  uploadCoverImage,
} from "../lib/cms";
import { revalidatePublicContent } from "../lib/actions";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Notice, Tag } from "./layout";

const kinds: ContentKind[] = ["현장 기록", "일반 가이드", "검증 메모"];
const toLines = (items: string[]) => items.join("\n");
const fromLines = (text: string) =>
  text.split("\n").filter((item) => item.trim());
const bodyToText = (body: Post["body"]) =>
  body
    .map((section) =>
      [section.heading, section.paragraphs.join("\n\n")]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n---\n\n");
const textToBody = (text: string): Post["body"] =>
  text.split(/\n\s*---\s*\n/).flatMap((block) => {
    const [heading, ...rest] = block.trim().split("\n");
    if (!heading?.trim()) return [];
    return [
      {
        heading: heading.trim(),
        paragraphs: rest
          .join("\n")
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
      },
    ];
  });
const todayIso = () => new Date().toISOString();

function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setPending(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);
    if (signInError)
      setError(
        "이메일 또는 비밀번호를 확인해 주세요. 관리자 계정은 Supabase에서 미리 만들어야 합니다.",
      );
    else onSignedIn();
  };
  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6">
        <Link
          href="/"
          className="brand-mark text-lg font-bold text-[hsl(var(--primary))]"
        >
          AI<span>기획자</span>로 살아남기
        </Link>
        <div className="mt-10 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7">
          <LockKeyhole className="text-[hsl(var(--accent))]" size={22} />
          <h1 className="font-display mt-5 text-3xl font-bold text-[hsl(var(--primary))]">
            편집실 로그인
          </h1>
          <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Supabase에 미리 등록한 관리자 계정만 로그인할 수 있습니다.
          </p>
          <form className="mt-7 space-y-4" onSubmit={submit}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일"
              className="w-full border border-[hsl(var(--input))] p-3 text-sm"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full border border-[hsl(var(--input))] p-3 text-sm"
            />
            {error && (
              <p className="text-xs text-[hsl(var(--destructive))]">{error}</p>
            )}
            <button
              disabled={pending}
              className="button-primary w-full rounded-sm py-3 text-sm font-semibold"
            >
              {pending ? "로그인 중…" : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PostEditor({
  post,
  onSaved,
}: {
  post: Post;
  onSaved: (post: Post) => Promise<void>;
}) {
  const [draft, setDraft] = useState(post);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setDraft(post), [post]);
  const field =
    <K extends keyof Post>(key: K) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setDraft(
        (current) => ({ ...current, [key]: event.target.value }) as Post,
      );
  const save = async (status: Status) => {
    if (!draft.title.trim() || !draft.slug.trim()) {
      setError("제목과 주소(slug)는 필수입니다.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const input: PostInput = {
        slug: draft.slug,
        title: draft.title,
        excerpt: draft.excerpt,
        category: draft.category,
        kind: draft.kind,
        status,
        readingTime: draft.readingTime,
        tags: draft.tags,
        summary: draft.summary,
        toc: draft.toc,
        body: draft.body,
        bodyMarkdown: draft.bodyMarkdown,
        mistakes: draft.mistakes,
        checklist: draft.checklist,
        related: draft.related,
        featured: draft.featured,
        coverImageUrl: draft.coverImageUrl,
      };
      const when =
        status === "published" ? (draft.publishedAtIso ?? todayIso()) : null;
      const result = await savePost(draft.id, input, status, when);
      await onSaved(result);
    } catch {
      setError("저장하지 못했습니다. slug 중복 또는 권한을 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  };
  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const coverImageUrl = await uploadCoverImage(file);
      setDraft((current) => ({ ...current, coverImageUrl }));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "이미지를 업로드하지 못했습니다.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <Tag>{draft.status}</Tag>
          <h2 className="font-display mt-2 text-2xl font-bold text-[hsl(var(--primary))]">
            글 편집
          </h2>
        </div>
        <label className="text-sm">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                featured: e.target.checked,
              }))
            }
          />{" "}
          대표 글
        </label>
      </div>
      <div className="mt-6 grid gap-5">
        <label className="text-sm font-semibold">
          제목
          <input
            value={draft.title}
            onChange={field("title")}
            className="mt-2 w-full border p-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          주소(slug)
          <input
            value={draft.slug}
            onChange={field("slug")}
            className="mt-2 w-full border p-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          요약
          <textarea
            value={draft.excerpt}
            onChange={field("excerpt")}
            rows={3}
            className="mt-2 w-full border p-3 font-normal"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="text-sm font-semibold">
            카테고리
            <select
              value={draft.category}
              onChange={field("category")}
              className="mt-2 w-full border p-3 font-normal"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            글 유형
            <select
              value={draft.kind}
              onChange={field("kind")}
              className="mt-2 w-full border p-3 font-normal"
            >
              {kinds.map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            읽는 시간
            <input
              value={draft.readingTime}
              onChange={field("readingTime")}
              className="mt-2 w-full border p-3 font-normal"
            />
          </label>
        </div>
        <label className="text-sm font-semibold">
          태그{" "}
          <span className="font-normal text-[hsl(var(--muted-foreground))]">
            (쉼표로 구분)
          </span>
          <input
            value={draft.tags.join(", ")}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                tags: e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              }))
            }
            className="mt-2 w-full border p-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          핵심 요약{" "}
          <span className="font-normal text-[hsl(var(--muted-foreground))]">
            (한 줄에 하나)
          </span>
          <textarea
            value={toLines(draft.summary)}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                summary: fromLines(e.target.value),
              }))
            }
            rows={4}
            className="mt-2 w-full border p-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          본문{" "}
          <span className="font-normal text-[hsl(var(--muted-foreground))]">
            (Markdown 지원 · ## 소제목, **강조**, 목록, 링크, 인용문)
          </span>
          <textarea
            value={draft.bodyMarkdown ?? bodyToText(draft.body)}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                bodyMarkdown: e.target.value,
                body: textToBody(e.target.value),
                toc: textToBody(e.target.value).map(
                  (section) => section.heading,
                ),
              }))
            }
            rows={18}
            className="mt-2 w-full border p-3 font-normal leading-7"
          />
        </label>
        <details className="border border-[hsl(var(--border))] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[hsl(var(--primary))]">
            Markdown 미리보기
          </summary>
          <div className="prose-editorial markdown-body mt-4 border-t border-[hsl(var(--border))] pt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {draft.bodyMarkdown ?? bodyToText(draft.body)}
            </ReactMarkdown>
          </div>
        </details>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Know-how{" "}
            <span className="font-normal text-[hsl(var(--muted-foreground))]">
              (한 줄에 하나)
            </span>
            <textarea
              value={toLines(draft.mistakes)}
              onChange={(e) =>
                setDraft((current) => ({
                  ...current,
                  mistakes: fromLines(e.target.value),
                }))
              }
              rows={5}
              className="mt-2 w-full border p-3 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            체크리스트{" "}
            <span className="font-normal text-[hsl(var(--muted-foreground))]">
              (한 줄에 하나)
            </span>
            <textarea
              value={toLines(draft.checklist)}
              onChange={(e) =>
                setDraft((current) => ({
                  ...current,
                  checklist: fromLines(e.target.value),
                }))
              }
              rows={5}
              className="mt-2 w-full border p-3 font-normal"
            />
          </label>
        </div>
        <div className="border border-dashed border-[hsl(var(--border))] p-4">
          <p className="text-sm font-semibold">대표 이미지</p>
          <p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
            JPG, PNG, WebP · 최대 5MB · 가로형 1600 × 900px 권장
          </p>
          {draft.coverImageUrl && (
            <img
              src={draft.coverImageUrl}
              alt="업로드한 대표 이미지 미리보기"
              className="mt-4 aspect-[16/9] w-full max-w-xl object-cover"
            />
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="button-outline cursor-pointer rounded-sm px-4 py-3 text-sm">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={(e) => void uploadImage(e.target.files?.[0])}
              />
              {busy ? "업로드 중…" : "이미지 선택"}
            </label>
            {draft.coverImageUrl && (
              <button
                type="button"
                className="text-sm text-[hsl(var(--muted-foreground))] underline"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    coverImageUrl: undefined,
                  }))
                }
              >
                이미지 제외
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
            업로드 후에는 임시저장 또는 공개하기를 눌러 글에 반영하세요.
          </p>
        </div>
        <label className="text-sm font-semibold">
          관련 글 slug{" "}
          <span className="font-normal text-[hsl(var(--muted-foreground))]">
            (쉼표로 구분)
          </span>
          <input
            value={draft.related.join(", ")}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                related: e.target.value
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean),
              }))
            }
            className="mt-2 w-full border p-3 font-normal"
          />
        </label>
      </div>
      {error && (
        <p className="mt-4 text-sm text-[hsl(var(--destructive))]">{error}</p>
      )}
      <div className="mt-7 flex flex-wrap gap-3">
        <button
          disabled={busy}
          onClick={() => void save("draft")}
          className="button-outline rounded-sm px-4 py-3 text-sm"
        >
          <Save className="mr-1 inline" size={15} />
          임시저장
        </button>
        <button
          disabled={busy}
          onClick={() => void save("published")}
          className="button-primary rounded-sm px-4 py-3 text-sm"
        >
          {busy ? "저장 중…" : "공개하기"}
        </button>
        {draft.status === "published" && (
          <button
            disabled={busy}
            onClick={() => void save("draft")}
            className="button-outline rounded-sm px-4 py-3 text-sm"
          >
            공개 취소
          </button>
        )}
      </div>
    </div>
  );
}

function AdminDesk() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    try {
      setPosts(await fetchAdminPosts());
    } catch {
      setNotice("글 목록을 불러오지 못했습니다. 로그인 권한을 확인해 주세요.");
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const reloadPublic = async () => {
    await revalidatePublicContent();
  };
  const create = async () => {
    setBusy(true);
    try {
      const item = await createDraft(newTitle);
      setPosts((items) => [item, ...items]);
      setEditing(item);
      setNewTitle("");
      setNotice("새 초안을 만들었습니다.");
    } catch {
      setNotice("초안을 만들지 못했습니다. 권한을 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  };
  const remove = async (post: Post) => {
    if (!window.confirm(`"${post.title}" 글을 삭제할까요?`)) return;
    setBusy(true);
    try {
      await removePost(post.id);
      setPosts((items) => items.filter((item) => item.id !== post.id));
      setEditing(null);
      await reloadPublic();
      setNotice("글을 삭제했습니다.");
    } catch {
      setNotice("삭제하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
      <header className="border-b bg-[hsl(var(--card))]">
        <div className="container-editorial flex items-center justify-between py-4">
          <div>
            <p className="rule-label">EDITORIAL DESK</p>
            <h1 className="font-display mt-1 text-xl font-bold text-[hsl(var(--primary))]">
              글 관리
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="button-outline rounded-sm px-3 py-2 text-xs"
            >
              사이트 보기
            </Link>
            <button
              className="button-outline rounded-sm px-3 py-2 text-xs"
              onClick={() => void supabase?.auth.signOut()}
            >
              <LogOut className="mr-1 inline" size={14} />
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main className="container-editorial grid gap-8 py-8 lg:grid-cols-[.8fr_1.2fr]">
        <section>
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="새 초안 제목"
              className="min-w-0 flex-1 border p-3 text-sm"
            />
            <button
              disabled={busy}
              onClick={() => void create()}
              className="button-primary rounded-sm px-3 text-sm"
            >
              <Plus className="mr-1 inline" size={15} />
              추가
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {posts.map((post) => (
              <div
                className={`border bg-[hsl(var(--card))] p-4 ${editing?.id === post.id ? "border-[hsl(var(--accent))]" : "border-[hsl(var(--border))]"}`}
                key={post.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="min-w-0 text-left"
                    onClick={() => setEditing(post)}
                  >
                    <Tag>{post.status}</Tag>
                    <p className="mt-2 truncate font-semibold text-[hsl(var(--primary))]">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                      {getCategory(post.category)?.name}
                    </p>
                  </button>
                  <button
                    onClick={() => void remove(post)}
                    className="p-1 text-[hsl(var(--muted-foreground))]"
                    aria-label="글 삭제"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          {notice && (
            <div className="mb-4">
              <Notice text={notice} />
            </div>
          )}
          {editing ? (
            <PostEditor
              post={editing}
              onSaved={async (next) => {
                setPosts((items) =>
                  items.map((item) => (item.id === next.id ? next : item)),
                );
                setEditing(next);
                await reloadPublic();
                setNotice(
                  next.status === "published"
                    ? "글을 공개했습니다."
                    : "초안을 저장했습니다.",
                );
              }}
            />
          ) : (
            <Notice text="왼쪽에서 글을 선택하거나 새 초안을 만드세요." />
          )}
          <div className="mt-8 border border-dashed p-5 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            <strong>칼럼 관리</strong>
            <br />
            칼럼의 실제 작성·편집 기능은 다음 단계에서 연결합니다. 현재 공개
            칼럼은 Supabase에서 읽기만 합니다.
          </div>
        </section>
      </main>
    </div>
  );
}

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(Boolean(session));
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="container-editorial py-24">
        <Notice text="Vercel 환경변수 설정 후 다시 배포해 주세요. NEXT_PUBLIC_SUPABASE_URL 및 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY가 필요합니다." />
      </div>
    );
  }
  if (!ready)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  if (!signedIn) return <AdminLogin onSignedIn={() => setSignedIn(true)} />;
  return <AdminDesk />;
}
