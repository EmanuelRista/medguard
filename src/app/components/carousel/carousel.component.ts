import { Component } from '@angular/core';  // Importa il decoratore Component da Angular

// Decoratore Component che definisce il componente, il suo selector, template e stile
@Component({
  selector: 'app-carousel',  // Il tag HTML del componente
  templateUrl: './carousel.component.html',  // Il template associato al componente
  styleUrl: './carousel.component.scss'  // Il foglio di stile associato al componente
})
export class CarouselComponent {
  // Array di oggetti che definisce le diapositive da visualizzare nel carosello
  slides = [
    { text: 'Efficienza nel monitoraggio, cura nella gestione.', backgroundColor: '#3f51b5' },  // Prima diapositiva
    { text: 'Supportiamo il tuo lavoro, per una gestione pazienti più semplice.', backgroundColor: '#e91e63' },  // Seconda diapositiva
    { text: 'Monitorare con precisione, per una cura sempre migliore', backgroundColor: '#4caf50' }  // Terza diapositiva
  ];
  currentSlide = 0;  // Indice della diapositiva attualmente visibile (inizialmente la prima)

  // Funzione per passare alla diapositiva successiva
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;  // Incrementa l'indice e ritorna al primo slide quando arriva alla fine
  }

  // Funzione per passare alla diapositiva precedente
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;  // Decrementa l'indice e torna all'ultimo slide se si va oltre il primo
  }
}
