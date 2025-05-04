var containerBody = document.querySelector(".body");
var timeWindow = document.querySelector(".time-window");
var filterCategory = document.querySelectorAll(".api-key-input button");
var filterCategoryParent = document.querySelector(".api-key-input");
var filterValues = {
    category: "all",
    timeWindow: "day"
};
var searchInput = document.querySelector(".search-input input");
var cardPreviewAndDisplay = document.querySelector(".card-preview");
var searchList;
var searchListArg;
var currentIndex = 0;

const constURL = `https://image.tmdb.org/t/p/w500`;

function apiReturn(timeWindowValue, filterCategoryValue) {
    return new Promise((resolve) => {
        var api = new XMLHttpRequest();
        api.open("GET", `https://api.themoviedb.org/3/trending/${filterCategoryValue}/${timeWindowValue}`, true);
        api.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM');
        api.send();
        api.addEventListener('readystatechange', function (e) {
            if (api.readyState == 4) {
                var res = JSON.parse(api.responseText).results;
                searchList = res;
                searchListArg = res;
                console.log(res);

                resolve(res);
            }
        });
    });
}

// Event Delegation
filterCategoryParent.addEventListener("click", eventDelegation);

function eventDelegation(e) {
    e.stopPropagation();
    e.preventDefault();
    filterCategory.forEach(i => {
        i.classList.remove("btn-select");
    });
    containerBody.innerHTML = "";
    switch (e.target.getAttribute("attr-select")) {
        case "All":
            filterValues.category = "all";
            break;
        case "Movies":
            filterValues.category = "movie";
            break;
        case "People":
            filterValues.category = "person";
            break;
        case "TV":
            filterValues.category = "tv";
            break;
    }
    apiReturn(filterValues.timeWindow, filterValues.category).then(allDisplayToWindow);
    e.target.classList.add("btn-select");
    searchInput.value = "";
}

function allDisplayToWindow(showsList) {
    showsList.forEach(element => {
        var imgUrl = document.createElement("img");
        imgUrl.src = `${constURL}` + `${element.poster_path || element.profile_path}`;

        if (!imgUrl.src.includes("null")) {
            var cardContainer = document.createElement("div");
            cardContainer.classList.add("card-container");

            imgUrl.alt = element.title;
            imgUrl.setAttribute("id", element.id);
            cardContainer.appendChild(imgUrl || "No image available");

            var cardText = document.createElement("div");
            cardText.classList.add("card-text");

            var nameOrTitle = document.createElement("h2");
            nameOrTitle.innerHTML = element.name || element.title;
            cardText.appendChild(nameOrTitle);

            if (element.overview) {
                var overview = document.createElement("p");
                var trimmedOverview = element.overview.slice(0, 100);
                overview.innerHTML = trimmedOverview + "...";
                cardText.appendChild(overview);
            }
            cardContainer.appendChild(cardText);
            containerBody.appendChild(cardContainer);
        }
    });
}

window.addEventListener("load", function (e) {
    e.stopPropagation();
    e.preventDefault();
    filterValues.category = "all";
    filterValues.timeWindow = "day";
    apiReturn(filterValues.timeWindow, filterValues.category).then(allDisplayToWindow);
});

timeWindow.addEventListener("change", function (e) {
    e.stopPropagation();
    e.preventDefault();
    filterValues.timeWindow = e.target.value;
    containerBody.innerHTML = "";
    apiReturn(filterValues.timeWindow, filterValues.category).then(allDisplayToWindow);
    searchInput.value = "";
});

searchInput.addEventListener("input", function (e) {
    e.stopPropagation();
    e.preventDefault();
    containerBody.innerHTML = "";
    if (e.target.value == "") {
        allDisplayToWindow(searchList);
        searchListArg = searchList;
    }
    else {
        searchListArg = searchList.filter(x =>
            (x.title || x.name).toLowerCase().includes(e.target.value.toLowerCase()));;
        allDisplayToWindow(searchListArg);
    }
})

containerBody.addEventListener("click", cardPreview);
function cardPreview(e) {
    cardPreviewAndDisplay.innerHTML = "";
    if (e.target.getAttribute("id")) {
        cardPreviewAndDisplay.classList.remove("hidden");
        searchListArg.forEach(element => {
            if (element.id == e.target.getAttribute("id")) {
                currentIndex = searchListArg.indexOf(element);
                cardDisplay(element);
                cardPreviewAndDisplay.addEventListener("click", (e) => {
                    e.stopPropagation();
                    exitPreviewFunction(e.target);
                });
                window.addEventListener("keydown", function (e) {
                    e.stopPropagation();
                    if (e.key == "ArrowLeft") {
                        prevFunction();
                    }
                    else if (e.key == "ArrowRight") {
                        nextFunction();
                    }
                    else if (e.key == "Escape") {
                        exitPreviewFunction(e.target);
                    }
                })
            }
        });
    }
}

function cardDisplay(cardObj) {
    cardPreviewAndDisplay.innerHTML = `
        <div class="card-preview-container">
            <img src="${(constURL + (cardObj.poster_path || cardObj.profile_path))}" class= "img-preview-selected">
            <div class="card-preview-container-buttons">
            </div>
        </div>`;

    let prevButton = document.createElement("button");
    prevButton.setAttribute("class", "prev-btn");
    prevButton.addEventListener("click", function (e) {
        e.stopPropagation();
        prevFunction();
    });
    prevButton.innerHTML = `<i class="material-icons">&#xe5c4;</i>`;

    let dataButton = document.createElement("button");
    dataButton.setAttribute("class", "data-btn");
    dataButton.addEventListener("click", function (e) {
        e.stopPropagation();
        dataFunction();
    });
    dataButton.innerHTML = `<i class="material-icons">&#xe5d2;</i>`;

    let nextButton = document.createElement("button");
    nextButton.setAttribute("class", "next-btn");
    nextButton.addEventListener("click", function (e) {
        e.stopPropagation();
        nextFunction();
    });
    nextButton.innerHTML = `<i class="material-icons">&#xe5c8;</i>`;

    document.querySelector(".card-preview-container-buttons").appendChild(prevButton);
    document.querySelector(".card-preview-container-buttons").appendChild(dataButton);
    document.querySelector(".card-preview-container-buttons").appendChild(nextButton);

    let dataPreview = document.createElement("div");
    dataPreview.classList.add("data-preview");
    dataPreview.classList.add("hidden");
    document.querySelector(".card-preview-container").appendChild(dataPreview);
    previewDataWillNavigation(currentIndex);
}

function prevFunction() {
    var prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = searchListArg.length - 1
        currentIndex = prevIndex;
        document.querySelector(".img-preview-selected")
            .setAttribute("src", (constURL + (searchListArg[prevIndex].poster_path || searchListArg[prevIndex].profile_path)));
    }
    else {
        document.querySelector(".img-preview-selected")
            .setAttribute("src", (constURL + (searchListArg[prevIndex].poster_path || searchListArg[prevIndex].profile_path)));
        currentIndex--;
    }

    if (!document.querySelector(".data-preview").classList.contains("hidden")) {
        document.querySelector(".data-preview").classList.add("hidden");
    }
    previewDataWillNavigation(prevIndex)
}

function dataFunction() {
    document.querySelector(".data-preview").classList.toggle("hidden");

}

function nextFunction() {
    var nextIndex = currentIndex + 1;

    if (nextIndex > searchListArg.length - 1) {
        nextIndex = 0;
        currentIndex = nextIndex;
        document.querySelector(".img-preview-selected")
            .setAttribute("src", (constURL + (searchListArg[nextIndex].poster_path || searchListArg[nextIndex].profile_path)));
    }
    else {
        document.querySelector(".img-preview-selected")
            .setAttribute("src", (constURL + (searchListArg[nextIndex].poster_path || searchListArg[nextIndex].profile_path)));
        currentIndex++;
    }
    if (!document.querySelector(".data-preview").classList.contains("hidden")) {
        document.querySelector(".data-preview").classList.add("hidden");
    }
    previewDataWillNavigation(nextIndex)
}

function exitPreviewFunction(target) {
    if (target != document.querySelector(".img-preview-selected") &
        target != document.querySelector(".data-preview") &
        target != document.querySelector(".data-preview h2") &
        target != document.querySelector(".data-preview p")) {
        cardPreviewAndDisplay.classList.add("hidden");
        cardPreviewAndDisplay.classList.remove("card-preview-container");
        cardPreviewAndDisplay.classList.remove("card-preview-container-buttons");
        cardPreviewAndDisplay.classList.remove("img-preview-selected");
    }
}

function previewDataWillNavigation(i) {
    document.querySelector(".data-preview").innerHTML = `
            <h2>${searchListArg[i].name || searchListArg[i].title}</h2>
            <hr>
            <h4>Overview:</h4>
            <p>${searchListArg[i].overview}</p>
            <div class="vote">
            <div>
            <h4>Vote Rate</h4> 
            <p>${searchListArg[i].vote_average}</p>
            </div>
            <div>
            <h4>Vote Count</h4> 
            <p>${searchListArg[i].vote_count}</p>
            </div>
            </div>
            `;
}