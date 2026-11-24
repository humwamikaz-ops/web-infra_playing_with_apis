var LookForInput = document.getElementById("search");
var SpecificSearch = document.querySelector(".nav input");
var Region = document.getElementById("region");
var Sorting = document.getElementById("sort");
var ElementStatus = document.getElementById("status");
const countrygrid = document.getElementById("countries");
let allCountries = [];

async function fetchAllCountries() {
    const fields = "names.common,region,population,area.kilometers,capitals,flag.url_png,flag.description";
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
        allCountries = await fetchAllCountries();
        console.log("Countries fetched", allCountries.length);
        updateDisplay();
    }
    catch (error) {
        console.log("Error:", error);
        ElementStatus.textContent = "Could not fetch countries.  Try again later😓🙇🙏";
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
        const name = (country.name?.common || "Unknown").toLowerCase;
        const region = (country.region || "N/A").toLowerCase;
        const population = typeof country.population === "number" ? country.population.toLocaleString() : "N/A";
        const areaValue = country.area?.kilometers === "number"
        ? `${country.area.toLocaleString()} km2`
        :"N/A";
        const flagURL = country.flag?.url_png || "";
        const flagAlt = country.flag?.description || `Flag of ${name}`;
        const card = document.createElement("div");
        card.className = "country-card";

        card.innerHTML = ` 
        ${flagURL ? `<img src="${flagURL}" alt="${flagAlt}" loading="lazy">` : ""}
        <div class="country-card-body" style="padding: 14px;">
            <h3 style="margin: 0 0 8px;">${name}</h3>
            <p style="margin: 4px 0;"><strong>Region:</strong> ${region}</p>
            <p style="margin: 4px 0;"><strong>Population:</strong> ${population}</p>
            <p style="margin: 4px 0;"><strong>Area:</strong> ${area}</p>

        </div>
        `;
        countrygrid.appendChild(card);

    });
}
function updateDisplay() {
    const query = (LookForInput?.value || "").trim().toLowerCase();
    const selectedRegion = (Region?.value || "").toLowerCase();
    const sortBy = Sorting?.value || "name";
    const filtered = allCountries.filter((country) => {
        const name = (country.name?.common || "");
        const region = (country.region || "");
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