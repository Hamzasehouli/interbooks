const browseCategories = document.getElementById('browse-category');
const sectionCategory = document.getElementById('section-categories');

export default browseCategories?.addEventListener('click', (e) => {
  sectionCategory?.scrollIntoView({ behavior: 'smooth' });
});
