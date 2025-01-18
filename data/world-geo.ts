export const worldGeoData = {
  "type": "Topology",
  "objects": {
    "countries": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "MultiPolygon",
          "properties": { "name": "United States" },
          "arcs": [[[0, 0], [0, 50], [50, 50], [50, 0], [0, 0]]]
        },
        {
          "type": "MultiPolygon",
          "properties": { "name": "China" },
          "arcs": [[[100, 20], [100, 50], [140, 50], [140, 20], [100, 20]]]
        },
        {
          "type": "MultiPolygon",
          "properties": { "name": "Germany" },
          "arcs": [[[5, 47], [5, 55], [15, 55], [15, 47], [5, 47]]]
        },
        {
          "type": "MultiPolygon",
          "properties": { "name": "France" },
          "arcs": [[[-5, 42], [-5, 51], [8, 51], [8, 42], [-5, 42]]]
        },
        {
          "type": "MultiPolygon",
          "properties": { "name": "United Kingdom" },
          "arcs": [[[-8, 50], [-8, 59], [2, 59], [2, 50], [-8, 50]]]
        }
        // Add more countries as needed
      ]
    }
  },
  "arcs": [],
  "transform": {
    "scale": [1, 1],
    "translate": [0, 0]
  }
}

