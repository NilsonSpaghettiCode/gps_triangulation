import { Map } from "./src/MapController.js";
import { loadData } from "./src/DataController.js";
import { Satelite } from "./src/Model/Satelite.js";
import { Conexiones } from "./src/Model/Conexiones.js";
import { Triangulacion } from "./src/Triangulacion.js";

async function Main(params) {
  //Load Satelites
  let satelites = await getSatelites();
  //console.log(satelites)
  //let x = new Coordenada(33.189858, 43.965912)
  //let y = new Coordenada(33.192156, 43.967285)
  //console.log(geomath.haversine(x, y))
  //Load Map
  let mapa = new Map(satelites);
  mapa.startMap();

  //Aprox Localizacion
  let algoritm = new Triangulacion(satelites)
  algoritm.addSuscriber(mapa)
  algoritm.aprox()
  
}

async function getSatelites() {
  let satelites = [];
  let satelites_access = {};
  let result = await loadData("./data/data.json");
  let satelites_json = result.satelites;

  for (let i = 0; i < satelites_json.length; i++) {
    let data = satelites_json[i];
    let satelite = new Satelite(
      i + 1,
      data.distancia,
      data.lat,
      data.lon,
      data.px
    );
    satelites.push(satelite);
    satelites_access[i + 1] = satelite;
  }
  for (let x = 0; x < satelites.length; x++) {
    const satelite_i = satelites[x];

    for (let y = 0; y < satelites.length; y++) {
      const satelite_f = satelites[y];
      if (satelite_i != satelite_f) {
        const conexion_i = new Conexiones(satelite_i, satelite_f);
        satelite_i.agregarConexion(conexion_i);
      }
    }
  }

  return satelites;
}

Main();
