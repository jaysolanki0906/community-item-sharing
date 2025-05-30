import { Component, Inject, NgZone, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-map-dialog',
  template: `
    <h2 mat-dialog-title>Select Location</h2>
    <mat-dialog-content style="padding:0;">
      <div id="map" style="width:100%;height:350px"></div>
      <div *ngIf="selectedLat !== null && selectedLng !== null" style="padding:8px;">
        <b>Selected:</b> {{selectedLat}}, {{selectedLng}}
        <a [href]="googleMapsLink" target="_blank" style="margin-left:12px;text-decoration:underline; color:#0b57d0;">
          Open in Google Maps
        </a>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="selectedLat===null" (click)="choose()">Choose</button>
    </mat-dialog-actions>
  `,
  styles: [`
    #map { border-radius: 6px; border: 1px solid #ccc; }
    a { font-size: 14px; }
  `],
  standalone: false,
})
export class MapDialogComponent implements AfterViewInit {
  selectedLat: number | null = null;
  selectedLng: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lat?: number, lng?: number },
    private zone: NgZone
  ) {}

  get googleMapsLink(): string {
    if (this.selectedLat !== null && this.selectedLng !== null) {
      return `https://maps.google.com/?q=${this.selectedLat},${this.selectedLng}`;
    }
    return '#';
  }

  ngAfterViewInit() {
    import('leaflet').then(L => {
      const map = L.map('map').setView([this.data.lat || 20, this.data.lng || 78], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      let marker: any = null;
      if (this.data.lat && this.data.lng) {
        marker = L.marker([this.data.lat, this.data.lng], { draggable: true }).addTo(map);
        this.selectedLat = this.data.lat;
        this.selectedLng = this.data.lng;
        marker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          this.zone.run(() => {
            this.selectedLat = lat;
            this.selectedLng = lng;
          });
        });
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.zone.run(() => {
          this.selectedLat = lat;
          this.selectedLng = lng;
        });
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng], { draggable: true }).addTo(map);
          marker.on('dragend', (ev: any) => {
            const { lat: dlat, lng: dlng } = ev.target.getLatLng();
            this.zone.run(() => {
              this.selectedLat = dlat;
              this.selectedLng = dlng;
            });
          });
        }
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  choose() {
    if (this.selectedLat !== null && this.selectedLng !== null) {
      this.dialogRef.close(`${this.selectedLat},${this.selectedLng}`);
    } else {
      this.dialogRef.close();
    }
  }
}