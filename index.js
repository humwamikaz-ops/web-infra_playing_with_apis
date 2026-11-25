var LookForInput = document.getElementById("search");
var SpecificSearch = document.querySelector(".nav input");
var Region = document.getElementById("region");
var Sorting = document.getElementById("sort");
var ElementStatus = document.getElementById("status");
const countrygrid = document.getElementById("countries");
const detail =document.getElementById("detail");
const detailBody = document.getElementById("detail-body");
const CACHE_KEY = "countries_cache_v2";
const CACHE_MS = 24 * 60 * 60 * 1000;
let allCountries = [];

function listText(list) {
    return Array.isArray(list) && list.length ? list.join(", ") : "N/A";
}
function openDetail(country) {
    const name = country.names?.common || "Unknown";
    detailBody.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Capital:</strong> ${country.capitals?.[0]?.name || "N/A"}</p>
    <p><strong>Regoin:</strong> ${country.region || "N/A"} (${country.subregion || "N/A"})</p>
    <p><strong>Continent:</strong> ${listText(country.continents)}</p>
    <p><strong>Population:</strong> ${typeof country.population === "number" ? country.population.toLocaleString() : "N/A"}</P>
    <p><strong>Landlocked:</strong> ${country.landlocked === true ? "Yes" : country.landlocked === false ? "No" : "N/A"}</p>
    <p><strong>Calling code:</strong> ${listText(country.calling_codes)}</p>
    <p><strong>Timezones:</strong> ${listText(country.timezones)}</p>
    `;
    detail.showModal();
}
document.getElementById("detail-close").addEventListener("click", () => detail.closest());
async function getCountries () {
    try {
        const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (saved && Date.now() - saved.time < CACHE_MS) return saved.list;
    }
    catch (e) {}
    const list = await fetchAllCountries();
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), list }));
    }
    catch(e) {}
    return list;
}
async function fetchAllCountries() {
    const fields = "names.common,region,population,area.kilometers,capitals,continents,timezones,calling_codes,landlocked,flag.url_png,flag.description";
    let offset = 0;
    let all = [];
    let more = true;
    while (more && offset < 500) {
        const url = `https://api.restcountries.com/countries/v5?limit=100&offset=${offset}&response_fields=${fields}`;
        const response = await fetch(url, {headers: {Authorization: `Bearer ${API_KEY}`}});
        if (!response.ok) throw new Error("Request failed with status " + response.status);
        const json = await response.json();
        all = all.concat(json.data.objects);
        more = json.data.meta.more;
        offset += 100;
    }
    return all;
}
async function fetchCountries() {
    ElementStatus.textContent = "Loading";
    countrygrid.innerHTML = "";
    try {
        allCountries = await getCountries();
        console.log("Countries fetched", allCountries.length);
        updateDisplay();
    }
    catch (error) {
        console.log("Error:", error);
        ElementStatus.innerHTML = `${describeError(error)} <button id="retry">Try again later 😕🙇🙏</button>`;
        document.getElementById("retry").addEventListener("click", fetchCountries);
    }
}

function renderCountries(countries) { 
    countrygrid.innerHTML = "";
    if (countries.length === 0) {
        ElementStatus.textContent = "no matches found";
        return;
    }
    ElementStatus.textContent = `Showing ${countries.length} ${countries.length === 1 ? "country" : "countries"}.`;
    countries.forEach((country) => {
        const name = country.names?.common || "Unknown";
        const region = country.region || "N/A";
        const population = typeof country.population === "number" ? country.population.toLocaleString() : "N/A";
        const areaKilometers = country.area?.kilometers;
        const area = typeof areaKilometers === "number"
        ? `${areaKilometers.toLocaleString()} km²`
        :"N/A";
        const flagURL = country.flag?.url_png || "";
        const flagAlt = country.flag?.description || `Flag of ${name}`;
        const card = document.createElement("div");
        card.className = "country-card";

        card.innerHTML = ` 
        ${flagURL ? `<img src="${flagURL}" alt="${flagAlt}" loading="lazy">` : ""}
        <div class="country-card-body">
            <h3>${name}</h3>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Area:</strong> ${area}</p>

        </div>
        `;
        card.addEventListener("click", () => openDetail(country));
        countrygrid.appendChild(card);

    });
}
function describeError(error) {
    const msg = String(error.message || "");
    if (msg.includes("401")) return "API key rejected";
    if (msg.includes("403")) return "access blocked: monthly limit may have reached";
    if (msg.includes("429")) return "A lot of requests. Please bear with us a feww seconds and try again🙇";
    if (error instanceof TypeError) return "Could not reach the Api.  check connection";
    return "could not load countries";
}
function updateDisplay() {
    const query = (LookForInput?.value || "").trim().toLowerCase();
    const selectedRegion = (Region?.value || "").toLowerCase();
    const sortBy = Sorting?.value || "name";
    const filtered = allCountries.filter((country) => {
        const name = (country.names?.common || "").toLowerCase();
        const region = (country.region || "").toLowerCase();
        const matchesSearch = name.includes(query);
        const matchesRegion = !selectedRegion || region === selectedRegion || region.includes(selectedRegion);
        return matchesSearch && matchesRegion;

    });
    const sorted = [...filtered].sort((a,b) => {
        if (sortBy === "population") {
            return (b.population || 0) - (a.population || 0);

        }
        if (sortBy === "area") {
            return (b.area?.kilometers || 0) - (a.area?.kilometers || 0);

        }
        const nameA = a.names?.common || "";
        const nameB = b.names?.common || "";
        return nameA.localeCompare(nameB);

    });
    renderCountries(sorted);
}
if (LookForInput) {
    LookForInput.addEventListener("input", () => {
        if (SpecificSearch && SpecificSearch.value !== LookForInput.value) {
            SpecificSearch.value = LookForInput.value;
        }
        updateDisplay();

    });

}
if (SpecificSearch) {
    SpecificSearch.addEventListener("input", () => {
        if (LookForInput && LookForInput.value !== SpecificSearch.value) {
            LookForInput.value = SpecificSearch.value;

        }
        updateDisplay();
    });
}
if (Region) {
    Region.addEventListener("change", updateDisplay);
}

if (Sorting) {
    Sorting.addEventListener("change", updateDisplay);

}
fetchCountries();