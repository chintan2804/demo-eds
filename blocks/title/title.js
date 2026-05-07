export default function decorate(block) {
  // The block will have two rows: first is the block name, second is the title text
  const titleRow = block.children[1]; // 0 is block name, 1 is the title
  if (titleRow) {
    const titleText = titleRow.textContent.trim();
    block.innerHTML = ''; // Clear block
    const h1 = document.createElement('h1');
    h1.className = 'title-block-title';
    h1.textContent = titleText;
    block.appendChild(h1);
  }
}