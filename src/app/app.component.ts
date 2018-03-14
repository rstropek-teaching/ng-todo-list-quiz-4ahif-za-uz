import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const host = 'http://localhost:8080';

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean;
}
interface IPerson {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: Observable<ITodoItem[]>;
  people: Observable<IPerson[]>;
  httpClient: HttpClient;

  name: string;
  hideDone: boolean;

  newDescription: string;
  newAssignedTo: string;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.fetchItems();
    this.fetchPeople();
    this.people.subscribe( res => {
      this.newAssignedTo = res[0].name;
      // start value for newAssignedTo is the first element in people
    });
  }
  fetchItems() {
    this.items = this.httpClient.get<ITodoItem[]>(host + '/api/todos');
  }
  fetchPeople() {
    this.people = this.httpClient.get<IPerson[]>(host + '/api/people');
  }
  doneClick(item: ITodoItem) {
    this.httpClient.patch(host + '/api/todos/' + item.id, {
      done: !item.done
      /*
      When clicking the checkbox, first
      this function gets called, then
      this.items is updated due to 2-way
      binding.
      */
    }).subscribe(res => { }, err => { });
    // why does it only work with subscribe()
    /*
      with .subscribe(...):
      - check a todo item
      - refresh the page
      - previously checked item is still checked

      without .subscribe(...):
      - check a todo item
      - refresh the page
      - previously checked item is unchecked again
    */
  }

  addItem() {
    this.httpClient.post(host + '/api/todos', {
      description: this.newDescription,
      assignedTo: this.newAssignedTo
    }).subscribe(res => {
      this.fetchItems();
    }, err => {
      console.log(err);
    });
  }

  deleteItem(id: number) {
    this.httpClient.delete(host + '/api/todos/' + id).subscribe(res => {
      this.fetchItems();
    }, err => {
      console.log(err);
    });
  }

  patchItem(id: number) {
    this.httpClient.patch(host + '/api/todos/' + id, {
      description: this.newDescription,
      assignedTo: this.newAssignedTo
    }).subscribe(res => {
      this.fetchItems();
    }, err => {
      console.log(err);
    });
  }
}
