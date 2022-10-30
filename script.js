
const date = document.querySelector("#date");
const today = new Date();
today.setDate(today.getDate() - 1);
date.value = today.toISOString().split("T")[0];
date.max = today.toISOString().split("T")[0];

const regions = document.querySelector("#regions");
const update = document.querySelector("#update");
const tableData = document.querySelector("#table-data");

const casesData = document.querySelector("#cases-data");
const casesDiff = document.querySelector("#cases-diff");
const casesImg = document.querySelector("#cases-img");

const recoveredData = document.querySelector("#recovered-data");
const recoveredDiff = document.querySelector("#recovered-diff");
const recoveredImg = document.querySelector("#recovered-img");

const deathData = document.querySelector("#death-data");
const deathDiff = document.querySelector("#death-diff");
const deathImg = document.querySelector("#death-img");

const activeData = document.querySelector("#active-data");
const activeDiff = document.querySelector("#active-diff");
const activeImg = document.querySelector("#active-img");


const region = document.querySelector("#region");
const totalCases = document.querySelector("#total-cases");
const newCases = document.querySelector("#new-cases");
const totalDeaths = document.querySelector("#total-deaths");
const deathRate = document.querySelector("#death-rate");
const newDeaths = document.querySelector("#new-deaths");
const totalRecovered = document.querySelector("#total-recovered");
const recovered = document.querySelector("#recovered");
const activeCases = document.querySelector("#active-cases");

class Covid {
	constructor() {
		this.options = {
			method: "GET",
			headers: {
				"X-RapidAPI-Key": "88b5ba66c6msh560cb7fd7581f65p13b5ebjsn14226aa2cc65",
				"X-RapidAPI-Host": "covid-19-statistics.p.rapidapi.com"
			}
		};
		this.getRegions();
		if(date.value) {
			this.getTotal(date.value);
		}
	}

	getRegions() {
		fetch('https://covid-19-statistics.p.rapidapi.com/regions', this.options)
		.then((response) => {
			return response.json();
		})
		.then((res) => {
			res.data.forEach((el) => {
				const opt = document.createElement("option");
				const text = document.createTextNode(el.name);
				opt.appendChild(text);
				opt.value = el.iso;
				regions.appendChild(opt);
			});
		})
		.catch((err) => {
			console.error(err);
		})
	}

	getTotal(date) {
		fetch(`https://covid-19-statistics.p.rapidapi.com/reports/total?date=${date}`, this.options)
		.then((response) => {
			return response.json();
		})
		.then((res) => {
			update.innerText = res.data.last_update;
			casesData.innerText = res.data.confirmed;
			casesDiff.innerText = `(${(res.data.confirmed_diff > 0 ? "+" : "") + res.data.confirmed_diff})`;
			casesImg.src = res.data.confirmed_diff < 0 ? "./assets/img/covid_ok.png" : "./assets/img/covid_ko.png";
			recoveredData.innerText = res.data.recovered;
			recoveredDiff.innerText = `(${(res.data.recovered_diff > 0 ? "+" : "") + res.data.recovered_diff})`;
			recoveredImg.src = res.data.recovered_diff > 0 ? "./assets/img/covid_ok.png" : "./assets/img/covid_ko.png";
			deathData.innerText = res.data.deaths;
			deathDiff.innerText = `(${(res.data.deaths_diff > 0 ? "+" : "") + res.data.deaths_diff})`;
			deathImg.src = res.data.deaths_diff < 0 ? "./assets/img/covid_ok.png" : "./assets/img/covid_ko.png";
			activeData.innerText = res.data.active;
			activeDiff.innerText = `(${(res.data.active_diff > 0 ? "+" : "") + res.data.active_diff})`;
			activeImg.src = res.data.active_diff < 0 ? "./assets/img/covid_ok.png" : "./assets/img/covid_ko.png";
		})
		.catch((err) => {
			console.error(err);
		})
	}


	getRegionReport(date, region) {
		fetch(`https://covid-19-statistics.p.rapidapi.com/reports?date=${date}&iso=${region}`, this.options)
		.then(response => {
			return response.json();
		})
		.then(res => {
			tableData.innerHTML = "";
			res.data.forEach((el) => {
				const tr = document.createElement("tr");
				const tdRegion = document.createElement("td");
				const tdCases = document.createElement("td");
				const tdNewCases = document.createElement("td");
				const tdDeaths = document.createElement("td");
				const tdDeathPerc = document.createElement("td");
				const tdNewDeaths = document.createElement("td");
				const tdRecovered = document.createElement("td");
				const tdRecoveredPerc = document.createElement("td");
				const tdActive = document.createElement("td");
				tdRegion.innerText = el.region.province;
				tdCases.innerText = el.confirmed;
				tdNewCases.innerText = el.confirmed_diff;
				tdDeaths.innerText = el.deaths;
				tdDeathPerc.innerText = el.fatality_rate;
				tdNewDeaths.innerText = el.deaths_diff;
				tdRecovered.innerText = el.recovered;
				tdRecoveredPerc.innerText = el.recovered_diff;
				tdActive.innerText = el.active;
				tr.appendChild(tdRegion);
				tr.appendChild(tdCases);
				tr.appendChild(tdNewCases);
				tr.appendChild(tdDeaths);
				tr.appendChild(tdDeathPerc);
				tr.appendChild(tdNewDeaths);
				tr.appendChild(tdRecovered);
				tr.appendChild(tdRecoveredPerc);
				tr.appendChild(tdActive);
				tableData.appendChild(tr);
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}


}

const covid = new Covid();


date.addEventListener("change", (e) => {
	covid.getTotal(e.target.value);
	if(tableData.innerHTML) {
		covid.getRegionReport(e.target.value, regions.value);
	}
});

regions.addEventListener("change", (e) => {
	covid.getRegionReport(date.value, e.target.value);
});
