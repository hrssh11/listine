import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListineVirtualScrollComponent } from "../../../listine/src/public-api";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ListineVirtualScrollComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "listine-demo";

  COLLECTION_MODES = Array.from({ length: 1000000 }, (_, index) => {
    const cities = [
      "Chicago",
      "Houston",
      "New York",
      "San Francisco",
      "Los Angeles",
    ];
    const cityIndex = index % cities.length;
    return {
      label: cities[cityIndex],
      value: index.toString(),
    };
  });
  selectedValue: string = "";

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedValue = target.value;
  }
}
