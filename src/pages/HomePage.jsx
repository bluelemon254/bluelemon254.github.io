import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { postFolders } from '../data/posts';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const allPosts = useMemo(
    () =>
      postFolders.flatMap((folder) =>
        folder.posts.map((post) => ({
          ...post,
          folder: folder.name
        }))
      ),
    []
  );

  const tags = useMemo(() => {
    const allTags = new Set(allPosts.flatMap((post) => post.tags));
    return ['all', ...Array.from(allTags)];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allPosts.filter((post) => {
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const matchesSearch =
        query.length === 0 ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.folder.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesTag && matchesSearch;
    });
  }, [allPosts, search, selectedTag]);

  const groupedPosts = useMemo(() => {
    return postFolders
      .map((folder) => ({
        name: folder.name,
        totalCount: filteredPosts.filter((post) => post.folder === folder.name).length,
        posts: filteredPosts
          .filter((post) => post.folder === folder.name)
          .slice(0, 5)
      }))
      .filter((folder) => folder.posts.length > 0);
  }, [filteredPosts]);

  return (
    <div className="container page-stack">
      <section className="hero-card">
        <p className="eyebrow">Homepage</p>
        <h1>DK's Blog</h1>
        <p className="hero-copy">
          검색창과 태그 필터로 글을 찾아보세요.
        </p>
      </section>

      <section className="toolbar-card" aria-label="포스트 필터">
        <input
          className="search-input"
          type="text"
          placeholder="제목이나 태그 검색"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="filter-group">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`filter-chip${selectedTag === tag ? ' active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag === 'all' ? '전체' : `#${tag}`}
            </button>
          ))}
        </div>
      </section>

      <section className="folder-list">
        {groupedPosts.length > 0 ? (
          groupedPosts.map((folder) => (
            <article key={folder.name} className="folder-section">
              <div className="folder-header">
                <span className="folder-title">
                  <img className="folder-icon" src="/folder_icon.webp" alt="" aria-hidden="true" />
                  {folder.name}
                </span>
                <span className="folder-count">{folder.totalCount}개 글</span>
              </div>

              <div className="folder-post-wrap">
                <ul className="folder-post-list">
                  {folder.posts.map((post) => (
                    <li key={post.slug}>
                      <Link className="folder-post-link" to={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {folder.totalCount > 5 ? (
                  <p className="folder-more">+ {folder.totalCount - 5}개 글은 라이브러리에서 볼 수 있습니다.</p>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h2>검색 결과가 없습니다.</h2>
            <p>검색어를 바꾸거나 태그 필터를 해제해 보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}
