"use strict";

/*
 *
 *
 * ELEMENTI USATI IN TUTTO LO SCRIPT
 *
 *
 */
// input testo
const input = document.getElementById("input-text");
// select
const select = document.getElementById("select-type");
// button ricerca
const button = document.getElementById("button-search");
// contenitore card
const cards = document.querySelector(".cards");
// loader
const loader = document.getElementById("loader");
// contenitore paginazione
const pagination = document.getElementById("pagination");
// next button paginazione
const next_btn = document.getElementById("next");
// prev button paginazione
const prev_btn = document.getElementById("prev");
// url base api github
const baseUrl = "https://api.github.com";
// pagina corrente
let currentPage = 1;
// numero di pagine
let totalPages = 1;

/*
 *
 *
 * FUNZIONI PER LA LOGICA
 *
 *
 */
// creazione card per repositories
function createCardRepo(repo) {
  // col bootstrap
  const col = document.createElement("div");
  col.classList = "col-12 col-sm-6 col-md-4 col-xl-3 col-xxl-2 mb-3";
  // card
  const card = document.createElement("div");
  card.classList =
    "h-100 bg-light border border-primary rounded-3 pt-3 d-flex flex-column";
  // immagine
  const img = document.createElement("img");
  img.src = repo.owner.avatar_url;
  img.classList =
    "img-fluid rounded-circle w-50 border border-2 border-primary mb-3 align-self-center";
  card.append(img);
  //   titolo repo
  const h6 = document.createElement("h6");
  h6.innerText = repo.full_name;
  h6.classList = "px-3 align-self-center";
  card.append(h6);
  //   descrizione
  const description = document.createElement("p");
  description.innerText =
    (repo.description?.substring(0, 60) ?? "No description available") + "...";
  description.classList = "px-3 align-self-center";
  card.append(description);
  // stars
  const stars = document.createElement("p");
  stars.innerHTML =
    '<i class="fa-solid fa-star text-warning"></i> ' + repo.stargazers_count;
  stars.classList = "text-start ps-4 mb-1";
  card.append(stars);
  // issues
  const issues = document.createElement("p");
  issues.innerHTML =
    '<i class="fa-solid fa-circle-exclamation text-danger"></i> ' +
    repo.open_issues_count;
  issues.classList = "text-start ps-4";
  card.append(issues);
  //   link alla repo
  const link_repo = document.createElement("a");
  link_repo.href = repo.html_url;
  link_repo.innerHTML =
    "Go to the repo " +
    '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
  link_repo.classList = "btn btn-primary d-block rounded-top-0 mt-auto py-3";
  link_repo.target = "_blank";
  card.append(link_repo);
  col.append(card);
  return col;
}
// creazione card per user e organizzazioni
function createCardUser(user) {
  // col bootstrap
  const col = document.createElement("div");
  col.classList = "col-12 col-sm-6 col-md-4 col-xl-3 col-xxl-2 mb-3";
  // card
  const card = document.createElement("div");
  card.classList = "h-100 bg-light border rounded-3 pt-3 d-flex flex-column";
  card.classList.add(
    `${user.type === "User" ? "border-success" : "border-danger"}`
  );
  // immagine
  const img = document.createElement("img");
  img.src = user.avatar_url;
  img.classList =
    "img-fluid rounded-circle w-50 border border-2 mb-3 align-self-center";
  img.classList.add(
    `${user.type === "User" ? "border-success" : "border-danger"}`
  );
  card.append(img);
  //   titolo user/organizzazione
  const h6 = document.createElement("h6");
  h6.innerText = user.login;
  h6.classList = "px-3 align-self-center";
  card.append(h6);
  //   user o organizzazione
  const userOrganizzaztion = document.createElement("p");
  userOrganizzaztion.innerText = "Profile: " + `${user.type}`;
  userOrganizzaztion.classList = "px-3 align-self-center";
  card.append(userOrganizzaztion);
  //   link alla user
  const link_user = document.createElement("a");
  link_user.href = user.html_url;
  link_user.innerHTML =
    "Go to the profile " +
    '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
  link_user.classList = "btn d-block rounded-top-0 mt-auto py-3";
  link_user.classList.add(
    `${user.type === "User" ? "btn-success" : "btn-danger"}`
  );
  link_user.target = "_blank";
  card.append(link_user);
  col.append(card);
  return col;
}
// creazione messaggio no risultati ricerca
function noResults() {
  const message = document.createElement("p");
  message.innerHTML =
    "Sorry, your research has produced no results " +
    '<i class="fa-solid fa-face-sad-cry"></i>';
  message.classList = "text-center fs-2";
  cards.append(message);
}
// creazione messaggio avviso utente che deve inserire almeno tre caratteri di input
function noValidInput() {
  const message = document.createElement("p");
  message.innerHTML =
    "Sorry, your input should be 3 characters long at minimun " +
    '<i class="fa-solid fa-triangle-exclamation"></i>';
  message.classList = "text-center fs-2";
  cards.append(message);
}
// ricerca più rendering dati in pagina
function searchCall() {
  if (input.value.trim().length < 3) {
    pagination.classList.add("d-none");
    cards.innerHTML = "";
    noValidInput();
    // input.value = "";
    return;
  }
  pagination.classList.add("d-none");
  cards.innerHTML = "";
  // mostro loader
  loader.classList.remove("d-none");
  axios
    .get(`${baseUrl}/search/${select.value}`, {
      params: {
        q: input.value,
      },
      headers: config,
    })
    .then((response) => {
      const results = response.data.items;
      if (results.length > 0) {
        // calcolo pagine totali per la ricerca corrente
        totalPages = setPages(response.data.total_count);
        // setto la pagina corrente a 1
        currentPage = 1;
        results.forEach((element) => {
          if (select.value === "repositories") {
            cards.append(createCardRepo(element));
          } else {
            cards.append(createCardUser(element));
          }
        });
      } else {
        noResults();
        totalPages = 0;
      }
      // mostro bottoni più o meno solo se ho almeno due pagine
      if (totalPages > 1) pagination.classList.remove("d-none");
      // nascondo loader
      loader.classList.add("d-none");
    });
}
// debouncer function
function debounce(delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(searchCall, delay);
  };
}
// prima call al load per non avere pagina vuota
function callOnLoad() {
  loader.classList.remove("d-none");
  axios
    .get(`${baseUrl}/search/${select.value}`, {
      params: {
        q: "framework",
        sort: "stars",
        order: "desc",
      },
      headers: config,
    })
    .then((response) => {
      const results = response.data.items;
      results.forEach((element) => {
        cards.append(createCardRepo(element));
        loader.classList.add("d-none");
      });
    });
}
// calcolo numero pagine totali
function setPages(items) {
  return Math.ceil(items / 30);
}
// cambio pagina
function changePage(plusMinus, limit) {
  if (currentPage === limit) return;
  currentPage = currentPage + plusMinus;
  cards.innerHTML = "";
  loader.classList.remove("d-none");
  axios
    .get(`${baseUrl}/search/${select.value}`, {
      params: {
        q: input.value,
        page: currentPage,
      },
      headers: config,
    })
    .then((response) => {
      const results = response.data.items;
      results.forEach((element) => {
        if (select.value === "repositories") {
          cards.append(createCardRepo(element));
        } else {
          cards.append(createCardUser(element));
        }
      });
      loader.classList.add("d-none");
    });
}
/*
 *
 *
 * ESECUZIONE LOGICA DEFINITA SOPRA
 *
 *
 */
// chiamata al load della pagina
callOnLoad();
// ricerca al click sul button
button.addEventListener("click", searchCall);
// debouncer su input testo
input.addEventListener("input", debounce(700));
// prossima pagina
next_btn.addEventListener("click", () => {
  changePage(1, totalPages);
});
// pagina precedente
prev_btn.addEventListener("click", () => {
  changePage(-1, 1);
});
