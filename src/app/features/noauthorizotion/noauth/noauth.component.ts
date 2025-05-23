import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noauth',
  standalone: false,
  templateUrl: './noauth.component.html',
  styleUrl: './noauth.component.scss'
})
export class NoauthComponent implements OnInit {
  ngOnInit() {
  console.log('NoauthComponent initialized');
  }
}
