import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Papa } from 'ngx-papaparse';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  url = "/assets/test.csv";
  loaded = false;
  csvFullData: [];
  objCsv = new Object()
  coordinateArr = [];
  markerArr: any;
  options: Leaflet.MapOptions = {};
  constructor(private papa: Papa, public ref: ChangeDetectorRef) {}
  ngOnInit(): void {
    let optionsCsv = {
      download: true,
      complete: (parsedData) => {
        this.setParsedData(parsedData);
      }
    };
    this.papa.parse(this.url, optionsCsv);
  }
  public setParsedData(parsedData: any) {
    this.csvFullData = parsedData.data;
    for (let i = 999; i <= 1019; i++) {
      this.objCsv[i] = {
        routeNumber: this.csvFullData[i][0],
        numberPP: this.csvFullData[i][1],
        routeName: this.csvFullData[i][2],
        kindOfTransport: this.csvFullData[i][3],
        stopName: this.csvFullData[i][4],
        stopOfficialName: this.csvFullData[i][5],
        latitude: this.csvFullData[i][6],
        longitude: this.csvFullData[i][7],
        location: this.csvFullData[i][8],
      };

    }
    this.coordinateArr = Object.values(this.objCsv).map((item: any) => new Leaflet.LatLng(item.longitude, item.latitude));
    this.markerArr = Object.values(this.objCsv).map((item: any) => new Leaflet.Marker(
      new Leaflet.LatLng(item.longitude, item.latitude), {
      icon: new Leaflet.Icon({
        iconSize: [24, 24],
        iconAnchor: [24, 24],
        iconUrl: '/assets/icon.svg',
      })
    }
    ).bindPopup(item.stopName));

    this.options = {
      layers: this.getLayers(),
      zoom: 12,
      center: new Leaflet.LatLng(59.931212, 30.362391)
    };
    this.loaded = true;
    this.ref.detectChanges();
  }
  public getRoutes(): Leaflet.Layer[] {
    return [
      new Leaflet.Polyline(
        this.coordinateArr as Leaflet.LatLng[], {
          color: '#121212'
        } as Leaflet.PolylineOptions)
    ] as Leaflet.Polyline[];
  }
  public getLayers(): Leaflet.Layer[] {
    return [
      new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      } as Leaflet.TileLayerOptions),
      ...this.getRoutes(),
      ...this.getMarkers(),
    ] as Leaflet.Layer[];
  };
  public getMarkers(): Leaflet.Marker[] {
    return this.markerArr;
  };
}

