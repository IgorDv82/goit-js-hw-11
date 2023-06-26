import { getPictures, PER_PAGE } from './pixabay-api';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './CSS/style.css';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const endOfSearch = document.querySelector('.theEnd');

let query = '';
let page = 1;
console.log(PER_PAGE);
formEl.addEventListener('submit', hendlerSubmit);
loadMore.addEventListener('click', hendlerClick);

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
  if (page <= 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`, {
      position: 'center-top',
      timeout: 1000,
    });
  }
  loadedPhoto = page * PER_PAGE;

  if (loadedPhoto <= totalHits) {
    makeMarkup(hits);
    lightbox.refresh();
    loadMore.classList.remove('is-hidden');
  } else {
    makeMarkup(hits);
    lightbox.refresh();
    loadMore.classList.add('is-hidden');
    endOfSearch.classList.remove('is-hidden');
  }
}

function hendlerSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value;
  if (query.trim() === '') {
    formEl.reset();
    gallery.innerHTML = '';
    page = 1;
    loadMore.classList.add('is-hidden');
    endOfSearch.classList.add('is-hidden');
    Notify.info('Please, fill in key-word for searching.', {
      position: 'center-center',
      timeout: 1000,
    });
    return;
  }
  gallery.innerHTML = '';
  page = 1;
  getPictures(query, page)
    .then(data => renderMarkup(data))
    .catch(e => Report.failure('Sorry...', 'Please try again.'));
  formEl.reset();
  loadMore.classList.add('is-hidden');
  endOfSearch.classList.add('is-hidden');
}

function hendlerClick(e) {
  page += 1;
  getPictures(query, page)
    .then(data => renderMarkup(data))
    .catch(err => Report.failure('Sorry...', 'Please try again.'));
}

function makeMarkup(arr) {
  const markup = arr
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
}
