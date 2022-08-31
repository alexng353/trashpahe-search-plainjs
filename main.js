// ==UserScript==
// @name         TrashPahe SearchBar
// @namespace    https://ayo.icu
// @version      1.0
// @description  Add a search bar to trashpahe!
// @author       You
// @match        https://trash.animepahe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const Logo = document.getElementsByClassName("logo")[0];

  const inputNode = document.createElement("input");
  inputNode.setAttribute("type", "text");
  inputNode.setAttribute("placeholder", "Search");
  inputNode.setAttribute("id", "search");
  inputNode.setAttribute("class", "bar");
  inputNode.addEventListener("change", (event) => {
    sigh();
  });

  const style = document.createElement("style");
  const resetCss = `
.results span {
  margin: 0px;
}

.results div {
  margin: 0px;
}
`;
  style.innerHTML = `
${resetCss}
.bar {
  width: 200px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  text-indent: 10px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.bar:focus {
  width: 400px;
  border: 1px solid #000;
}

.results {
  z-index: 100;
  position: absolute;
  width: 400px;
  background-color: #000;
  right: 10%;
  //box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
}

.logo {
  display: flex;
}

.results-list {
  // margin: 10px;
  background-color: #171717;

}

.episodes {
  font-size: 12px;
  font-weight: normal;
}

.title {
  font-size: 18px;
  white-space: nowrap;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  /* bold */
  font-weight: bold;
  margin: 0px;
}

.results-list a {
  text-decoration: none;
  color: white;
}


.season {
  font-size: 12px;
  font-weight: normal;
  margin: 0px;
}

.result-link {
  display: flex;
  // top and bottom margin
  margin-top: 1px;
  margin-bottom: 1px;
  height: 67px;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  animate: all 0.3s;
  // gap between elements 10 px
  gap: 10px;
}

.result-link:hover {
  background-color: #d5015b;
}


.text {
  display: flex;
  flex-direction: column;
  line-height: 1;
  width: 100%;
  position: relative;
  padding-left: 10px;
}

.poster {
  width: 100%;
  height: auto;
}

.imgwrapper {
  margin-left: 10px;
  margin-right: 10px;
  width: 50px;
  min-width: 50px;
  height: 50px;
  // min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
}

.imgwrapper img {
  height: auto;
}

.hide-button {
  position: absolute;
  top: 10px;
  right: 30px;
  width: auto;
  height: 40px;
  border-radius: 10px;
  background-color: #d5015b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  border: none;
}

.hide-button:active {
  background-color: #aa0149;
}


`;

  const results = document.createElement("div");
  results.setAttribute("id", "results");
  results.setAttribute("class", "results");
  Logo.appendChild(results);

  const hideButton = document.createElement("button");

  hideButton.setAttribute("class", "hide-button");
  hideButton.appendChild(document.createTextNode("Clear"));
  Logo.appendChild(hideButton);

  hideButton.addEventListener("click", (event) => {
    hideResults();
  });

  function hideResults() {
    const searchbar = document.getElementById("search");
    // set searchbar value to empty string
    searchbar.value = "";

    const results = document.getElementById("results-list");
    results.replaceChildren();
  }

  const body = document.getElementsByTagName("body")[0];
  body.appendChild(style);

  results.appendChild(inputNode);

  const results_list = document.createElement("div");
  results_list.setAttribute("id", "results-list");
  results_list.setAttribute("class", "results-list");
  results.appendChild(results_list);

  inputNode.addEventListener("focus", function (event) {
    console.log("focus");
  });

  results_list.addEventListener("focus", function (event) {
    console.log("focused on results");
  });

  results_list.addEventListener("blur", function (event) {
    console.log("blurred on results");
    results_list.style.display = "none";
  });

  // inputNode.addEventListener("blur", function (event) {
  //   console.log("blur");
  //   results.style.display = "none";
  //   console.log("hidden");
  // });

  function sigh() {
    const search = document.getElementById("search").value;
    fetch("https://apapi.ayo.icu/api?m=search&q=" + search)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        results_list.replaceChildren();

        data.data.forEach((thing) => {
          // console.log(element.title);
          const tmpdiv = document.createElement("div");
          tmpdiv.setAttribute("class", "text");

          // TITLE
          const title = document.createElement("h1");
          title.setAttribute("class", "title");
          title.appendChild(document.createTextNode(thing.title));
          tmpdiv.appendChild(title);

          // TYPE
          const type = document.createElement("b");
          type.appendChild(document.createTextNode(thing.type));

          // EPISODES
          const episodes = document.createElement("span");
          episodes.appendChild(type);
          episodes.appendChild(document.createTextNode(" - "));
          episodes.appendChild(
            document.createTextNode(
              `${thing.episodes} Episodes (${thing.status})`
            )
          );
          episodes.setAttribute("class", "episodes");

          tmpdiv.appendChild(episodes);

          // SEASON
          const season = document.createElement("h1");
          season.setAttribute("class", "season");
          season.appendChild(
            document.createTextNode(`${thing.season} ${thing.year}`)
          );
          tmpdiv.appendChild(season);

          const tmpA = document.createElement("a");
          tmpA.setAttribute("href", `/anime/${thing.session}`);
          // tmpA.setAttribute("target", "_blank");
          // tmpA.setAttribute("rel", "noopener noreferrer");
          tmpA.setAttribute("class", "result-link");

          const imgwrapper = document.createElement("div");
          imgwrapper.setAttribute("class", "imgwrapper");

          const img = document.createElement("img");
          img.setAttribute("src", thing.poster);
          img.setAttribute("alt", thing.title);
          img.setAttribute("class", "poster");

          imgwrapper.appendChild(img);
          tmpA.appendChild(imgwrapper);

          tmpA.appendChild(tmpdiv);
          results_list.appendChild(tmpA);
        });
      });
  }
})();
