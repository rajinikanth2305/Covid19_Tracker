import "./App.css";
import Table from "./Table";
import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Select,
} from "@material-ui/core";
import LineGraph from "./LineGraph";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import { sortData, prittyPrintStat } from "./util";
function App() {
  const [countires, setCountries] = useState(["UK", "USA", "INDIA"]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapcenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  // STATE=HOW to write  a variable in a react
  //"https://disease.sh/v3/covid-19/countries"
  //useeffect=Runs a piece of code
  //based on given condition
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //aysnc => apiece of code,send a request and wait for something

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
      //"https://disease.sh/v3/covid-19/countries[COUNTRY_CODE]"
    };
    getCountriesData();
    //the code inside here will run once
    //when the component loads and not again
  }, []);
  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    //curl -X GET "https://disease.sh/v3/covid-19/all" -H "accept: application/json"
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    //"https://disease.sh/v3/covid-19/countries[COUNTRY_CODE]"
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapcenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log(countryInfo);
  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* loop throguh all countiries and show all */}
              <MenuItem value="worldwide">worldwide</MenuItem>

              {countires.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          {/*coronavirus cases */}
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Cornavirus Cases"
            cases={prittyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prittyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prittyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />

          {/*recovery cases */}
          {/*death cases */}
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />

          <h3 className="app__graphTitle">World wide new {casesType}</h3>

          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

      {/* Table */}
      {/* Graph */}
      {/* map */}
    </div>
  );
}

export default App;
