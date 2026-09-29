const images = import.meta.glob('../../content/images/**/*.{png,jpg,jpeg,webp,svg,gif,avif,bmp}', {
  eager: true,
  query: '?url',
  import: 'default'
});

export function contentImageUrl(src) {
  if (!src?.startsWith('/images/')) return src;
  const image = images[`../../content/images/${src.slice('/images/'.length)}`];
  if (!image) throw new Error(`Missing image in content/images: ${src}`);
  return image;
}
