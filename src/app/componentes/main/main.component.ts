import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../servicios/banner.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  generarPadding: boolean;

  constructor(private bannerService: BannerService) { }

  ngOnInit(): void {
    this.bannerService.bannerSubject.subscribe(data => {
      setTimeout(() => {
        this.generarPadding = data;
      }, 0);
    });
  }

}
