import React, { useState, useEffect } from "react";
import  Grid  from "@mui/material/Grid";
import {
  ComposableMap,
  Geography,
  Annotation,
  Geographies,
  ZoomableGroup,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const colorScale = scaleLinear()
  .domain([0, 6300000])
  .range(["#a72bb5", "#0376db"]);

const Map = () => {
  const [countries, setCountries] = useState([]);
  const [continent, setContinent] = useState([]);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleMoveEnd = (position) => {
    setPosition(position);
  };
  const getData = () => {
    fetch(" http://localhost:3000/countries", {
      headers: {
        "Content-Type": "application/json",
        "Accept": " application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });
  };

  const getContinentData = () => {
    fetch("http://localhost:3000/continent", {
      headers: {
        "Content-Type": "application/json",
        "Accept": " application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContinent(data);
      });
  };

  
  useEffect(() => {
    getData();
    getContinentData();
  }, []);



  return (
    <>
      <div className="App-header">
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="geo_map"
        >
          <ComposableMap
            width={900}
            height={400}
            projectionConfig={{ rotate: [-5, 0, 0], scale: 140 }}
          >
            {countries.length > 0 ? (
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
              >
                <Sphere stroke="aqua" strokeWidth={0.3} /> 
                <Graticule stroke="aqua" strokeWidth={0.3}/>
                <Geographies geography={geoUrl} >
                  {({geographies})=>
                  geographies.map((geo, index)=>{
                    const isos = countries.find((s)=> s.ISO3)
                    console.log("country res::", countries);
                    return(
                      <>
                      <Geography 
                      key={index}
                      geography={geo}
                      style={{
                        hover: { fill: "rgb(54, 16, 170)"  },
                      }}
                      fill={ isos ? colorScale(isos["population_density"]) : "rgb(54, 16, 170)" } />
                      <Annotation
                      subject={[-100.4173, 38.9071]}
                      dx={70}
                      dy={40}
                      connectorProps={{
                        stroke:"#999",
                        strokeWidth:1
                      }}>
                          <text x="8" textAncor="start"  alignmentBaseline="middle" style={{x:2, y:-17, fontSize:"10px", background:"rgb(0,0,0)",  strokeWidth:1, strokeOpacity:0.03}}>
                          {continent[0].name}, {`${continent[0].average}`} </text>
                      </Annotation>
                      </>
                    )
                  })}
                </Geographies>
              </ZoomableGroup>
            ) : (
              <p> Loading...</p>
            )}
          </ComposableMap>
        </Grid>
       
      </div>
    </>
  );
};

export default Map;
