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
        cardPreviewAndDisplay.style.display = "block";
        searchListArg.forEach(element => {
            if (element.id == e.target.getAttribute("id")) {
                currentIndex = searchListArg.indexOf(element);
                cardDisplay(element);
                prevFunction();
                dataFunction();
                nextFunction();
                existPeviewFunction();
            }
        });
    }
}

function cardDisplay(cardObj) {
    var carPreviewContainer = document.createElement("div");
    carPreviewContainer.classList.add("card-preview-container");
    cardPreviewAndDisplay.appendChild(carPreviewContainer);

    var imgPreview = document.createElement("img");
    imgPreview.setAttribute("src", (constURL + (cardObj.poster_path || cardObj.profile_path)));
    imgPreview.classList.add("img-preview-selected");
    carPreviewContainer.appendChild(imgPreview);

    var cardPreviewContainerButton = document.createElement("div");
    cardPreviewContainerButton.classList.add("card-preview-container-buttons");
    cardPreviewAndDisplay.appendChild(cardPreviewContainerButton);

    cardPreviewContainerButton.innerHTML = `<button class="prev-btn"><i class="material-icons">&#xe5c4;</i></button>
                                            <button class="data-btn"><i class="material-icons">&#xe5d2;</i></button>
                                            <button class="next-btn"><i class="material-icons">&#xe5c8;</i></button>`;
}


function prevFunction() {
    document.querySelector(".prev-btn").addEventListener("click", (e) => {
        prevIndex = currentIndex - 1;
        dataPreviewFunction();
        e.stopPropagation();
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
    });
}

function dataFunction() {
    document.querySelector(".data-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        // preview data
        var dataPreview = document.createElement("div");
        dataPreview.classList.add("data-preview");
        document.querySelector(".card-preview-container").appendChild(dataPreview);
        dataPreview.innerHTML = `
        <h2>${searchListArg[currentIndex].name || searchListArg[currentIndex].title}</h2>
        <p>${searchListArg[currentIndex].overview}</p>
        `;
        document.querySelector(".data-btn").disabled = true;
    });
}

function nextFunction() {
    document.querySelector(".next-btn").addEventListener("click", (e) => {
        nextIndex = currentIndex + 1;
        dataPreviewFunction();
        e.stopPropagation();
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
    });
}

function existPeviewFunction() {
    dataPreviewFunction();
    cardPreviewAndDisplay.addEventListener("click", (e) => {
        e.stopPropagation();
        cardPreviewAndDisplay.style.display = "none";
        cardPreviewAndDisplay.classList.remove("card-preview-container");
        cardPreviewAndDisplay.classList.remove("card-preview-container-buttons");
        cardPreviewAndDisplay.classList.remove("img-preview-selected");
    });
}

function dataPreviewFunction() {
    if (document.querySelector(".data-preview")) {
        document.querySelector(".card-preview-container").removeChild(document.querySelector(".data-preview"));
        document.querySelector(".data-btn").disabled = false;
    }
}

