import { refs } from './refs';
import { getPictures, PER_PAGE } from './pixabay-api';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { makeMarkup } from './makeMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './CSS/style.css';

const { formEl, gallery, loadMore, endOfSearch } = refs;

let query = '';
let page = 1;

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
  let loadedPhoto = page * PER_PAGE;
  if (loadedPhoto <= totalHits) {
    gallery.insertAdjacentHTML('beforeend', makeMarkup(hits));
    lightbox.refresh();
    loadMore.classList.remove('is-hidden');
  } else {
    gallery.insertAdjacentHTML('beforeend', makeMarkup(hits));
    lightbox.refresh();
    loadMore.classList.add('is-hidden');
    endOfSearch.classList.remove('is-hidden');
  }
}

function hendlerSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value;
  if (query.trim() === '') {
    resetAll();
    Notify.info('Please, fill in key-word for searching.', {
      position: 'center-center',
      timeout: 1000,
    });
    return;
  }
  resetAll();
  getPictures(query, page)
    .then(data => renderMarkup(data))
    .catch(e => Report.failure('Sorry...', 'Please try again.'));
}

function hendlerClick(e) {
  page += 1;
  getPictures(query, page)
    .then(data => renderMarkup(data))
    .catch(err => Report.failure('Sorry...', 'Please try again.'));
}

function resetAll() {
  formEl.reset();
  gallery.innerHTML = '';
  page = 1;
  loadMore.classList.add('is-hidden');
  endOfSearch.classList.add('is-hidden');
}
