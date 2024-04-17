"use strict";

// input testo
const input = document.getElementById("input-text");
// select
const select = document.getElementById("select-type");
// button ricerca
const button = document.getElementById("button-search");

// url base api github
const baseUrl = "https://api.github.com";

// contenitore card
const cards = document.querySelector(".cards");

// creazione card per repositories
function createCardRepo(repo) {
  // col bootstrap
  const col = document.createElement("div");
  col.classList = "col-12 col-sm-6 col-md-4 col-lg-3 mb-3";
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
  card.append(link_repo);
  col.append(card);
  return col;
}

// creazione card per user e organizzazioni
function createCardUser(user) {
  // col bootstrap
  const col = document.createElement("div");
  col.classList = "col-12 col-sm-6 col-md-4 col-lg-3 mb-3";
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
  card.append(link_user);
  col.append(card);
  return col;
}
// ricerca al click sul button
button.addEventListener("click", function () {
  axios
    .get(`${baseUrl}/search/${select.value}`, {
      params: {
        q: input.value,
      },
      headers: config,
    })
    .then((response) => {
      const results = response.data.items;
      cards.innerHTML = "";
      results.forEach((element) => {
        if (select.value === "repositories") {
          cards.append(createCardRepo(element));
        } else {
          cards.append(createCardUser(element));
        }
      });
    });
});
