import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37473288-0ea8494b0f878a1b6134977d3';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const PER_PAGE = 40;

export async function getPictures(request = '', loadPage = 1) {
  return await axios
    .get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: request,
        image_type: IMAGE_TYPE,
        orientation: ORIENTATION,
        safesearch: true,
        per_page: PER_PAGE,
        page: loadPage,
      },
      headers: {},
    })
    .then(resp => resp.data);
}
