import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates the social links table inside the footer fragment.
 * Row format (authored in DA):
 * - col 1: dragged/dropped icon image
 * - col 2: destination URL
 * - col 3: accessible label (optional)
 * @param {Element} socialTable the raw social-links div block inside footer
 */
function decorateSocialLinks(socialTable) {
  const rows = [...socialTable.querySelectorAll(':scope > div')];
  const list = document.createElement('div');
  list.className = 'footer-social-list';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const iconCell = cols[0];
    const linkCell = cols[1];
    const labelCell = cols[2];

    const href = (
      linkCell.querySelector('a')?.getAttribute('href')
      || linkCell.textContent
      || ''
    ).trim();
    if (!href) return;

    const label = (labelCell?.textContent || '').trim();

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (label) link.setAttribute('aria-label', label);

    // Use dragged/dropped picture or img from DA column 1
    const picture = iconCell.querySelector('picture');
    const authoredImg = iconCell.querySelector('img');

    if (picture) {
      const cloned = picture.cloneNode(true);
      const img = cloned.querySelector('img');
      if (img && label) img.alt = label;
      link.append(cloned);
    } else if (authoredImg) {
      const img = authoredImg.cloneNode(true);
      img.alt = label || img.alt || '';
      img.loading = 'lazy';
      link.append(img);
    } else {
      // Fallback: text icon name e.g. "facebook"
      const iconName = iconCell.textContent.trim().toLowerCase();
      if (!iconName) return;
      const img = document.createElement('img');
      img.src = `/icons/${iconName}.svg`;
      img.alt = label || iconName;
      img.loading = 'lazy';
      img.width = 20;
      img.height = 20;
      link.append(img);
    }

    list.append(link);
  });

  socialTable.replaceChildren(list);
  socialTable.classList.add('footer-social');
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  // Find and decorate the social-links table authored inside the footer fragment
  const socialTable = footer.querySelector('.social-links');
  if (socialTable) decorateSocialLinks(socialTable);

  block.append(footer);
}