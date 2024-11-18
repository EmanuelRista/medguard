import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent {
  slides = [
    { text: 'Efficienza nel monitoraggio, cura nella gestione.', backgroundColor: '#3f51b5' },
    { text: 'Supportiamo il tuo lavoro, per una gestione pazienti più semplice.', backgroundColor: '#e91e63' },
    { text: 'Monitorare con precisione, per una cura sempre migliore', backgroundColor: '#4caf50' }
  ];
  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}
