"use strict";

// input testo
const input = document.getElementById("input-text");
// select
const select = document.getElementById("select-type");
// button ricerca
const button = document.getElementById("button-search");
// console.log({ input, select, button });

// url base api github
const baseUrl = "https://api.github.com";

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
      const ul = document.getElementById("list");
      ul.innerHTML = "";
      results.forEach((element) => {
        const li = document.createElement("li");
        li.innerText = element.name;
        ul.append(li);
      });
    });
});
