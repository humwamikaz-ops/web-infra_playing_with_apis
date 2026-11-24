var LookForInput = document.getElementById("search");
var SpecificSearch = document.querySelector(".nav input");
var Region = document.getElementById("region");
var Sorting = document.getElementById("sort");
var ElementStatus = document.getElementById("countries");
const countrygrid = document.getElementById("countries");
let allCountries = [];


async function fetchCountries() {
    ElementStatus.textContent = "Loading";
    countrygrid.innerHTML = "";
    try {
        const url = "https://api.restcountries.com/countries/v5?limit=3&pretty=1";
        const response = await fetch(url, {
            headers: {Authorization: `Bearer ${API_KEY` }

        });
        if (!response.ok) {
            throw new Error("request failed with status" + response.status);

        }
        const data = await response.json();
        console.log("Countries fetched", data);
        allCountries = Array.isArray(data) ? data : [];
        updateDisplay();
    }
    catch (error) {
        console.log("Error:", error);
        ElementStatus.textContent = "Could not fetch countries.  Try again later";
    }
}
function renderCountries(countries) { 
    countrygrid.innerHTML = "";
    if (countries.length === 0) {
        ElementStatus.textcontent = "no matches found";
        return;
    }
    ElementStatus.textContent = `Showing ${countries.length} ${countries.length === 1 ? "country" : "countries"}.`;
    countries.forEach((country) => {
        const name = country.name?.common || "Unknown";
        const region = country.region || "N/A";
        const population = typeof country.population === "number" ? country.population.toLocaleString()
        : "N/A";
        const area = typeof country.area === "number"
        ? `${country.area.toLocaleString()} km2`
        :"N/A";
        const flagURL =country.flags?.png || country.flags?.svg || "";
        const flagAlt = country.flags?.alt || 'Flag of ${name}';
        const card = document.createElement("div");
        card.className = "country-card";

        card.innerHTML = ` 
        ${flagURL ? `<img src="${flagURL}" alt="${flagAlt}" loading="lazy">` : ""}
        <div class="country-card-body" style="padding: 14px;">
            <h3 style="margin: 0 0 8px;">${name}</h3>
            <p style="margin: 4px 0;"><strong>Region:</strong></p>
            <p style="margin: 4px 0;"><strong>Population:</strong></p>
            <p style="margin: 4px 0;"><strong>Area:</strong></p>

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
        const name = (country.name?.common || "").toLowerCase();
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
            return (b.area || 0) - (a.area || 0);

        }
        const nameA = a.name?.common || "";
        const nameB = b.name?.common || "";
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