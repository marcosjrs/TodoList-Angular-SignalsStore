import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private defaultCategories = ['Compras', 'Educación', 'Personal', 'Salud', 'Trabajo'];
  categories = signal<string[]>([]);

  constructor() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories.set(JSON.parse(storedCategories));
    } else {
      this.categories.set(this.defaultCategories);
    }
  }

  addCategory(category: string) {
    this.categories.update(categories => [...categories, category]);
    this.updateLocalStorage();
  }

  removeCategory(category: string) {
    this.categories.update(categories => categories.filter(c => c !== category));
    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(this.categories()));
  }
}
