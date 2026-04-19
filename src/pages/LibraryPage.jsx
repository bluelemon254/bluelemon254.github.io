import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { postFolders } from '../data/posts';

export default function LibraryPage() {
  const [openedFolders, setOpenedFolders] = useState(() =>
    Object.fromEntries(postFolders.map((folder) => [folder.name, true]))
  );

  const folders = useMemo(
    () =>
      postFolders.map((folder) => ({
        ...folder,
        count: folder.posts.length
      })),
    []
  );

  const toggleFolder = (folderName) => {
    setOpenedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  return (
    <div className="container page-stack">
      <section className="hero-card">
        <p className="eyebrow">Library</p>
        <h1>폴더 라이브러리</h1>
        <p className="hero-copy">
          폴더를 열고 닫으며 글을 탐색해보세요. 
        </p>
      </section>

      <section className="folder-list" aria-label="폴더 라이브러리">
        {folders.map((folder) => (
          <article key={folder.name} className="folder-section">
            <button
              type="button"
              className="folder-header"
              onClick={() => toggleFolder(folder.name)}
              aria-expanded={openedFolders[folder.name]}
            >
              <span className="folder-title">
                <img className="folder-icon" src="/folder_icon.webp" alt="" aria-hidden="true" />
                {folder.name}
              </span>
              <span className="folder-state">
                <span aria-hidden="true">{openedFolders[folder.name] ? '▾' : '▸'}</span>
                <span>{openedFolders[folder.name] ? '열림' : '닫힘'}</span>
              </span>
              <span className="folder-count">{folder.count}개 글</span>
            </button>

            {openedFolders[folder.name] ? (
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
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
