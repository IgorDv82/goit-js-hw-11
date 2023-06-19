import { getPictures } from './pixabay-api';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './CSS/style.css';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let query = '';

formEl.addEventListener('submit', hendlerSubmit);

let lightbox = new SimpleLightbox('.gallery a');

function renderMarkup(data) {
  const { total, totalHits, hits } = data;
  if (total === 0) {
    Notify.info(
      'There are no images matching your search query. Please try again.',
      { position: 'center-center' }
    );
    return;
  }
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}" class="link">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function hendlerSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value;
  if (query.trim() === '') {
    Notify.info('Please, fill in key-word for searching.', {
      position: 'center-center',
    });
    return;
  }
  getPictures(query)
    .then(data => renderMarkup(data))
    .catch(e => Report.failure('Sorry...', 'Please try again.'));
  formEl.reset();
  gallery.innerHTML = '';
}
