import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { TodoItem } from './models/task';
import { todoTable } from './utilities/constants';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  _todos: TodoItem[] = [];

  todo$: BehaviorSubject<TodoItem[]> = new BehaviorSubject(
    new Array<TodoItem>()
  );

  constructor(private db: AngularFirestore) {
    db.collection(todoTable)
      .snapshotChanges()
      .subscribe((snapshot) => {
        this._todos = snapshot.map((element) => {
          let newTask: TodoItem = {
            ...(element.payload.doc.data() as any), // spread operator
            id: element.payload.doc.id,
            createdAt: (element.payload.doc.data() as any).createdAt.toDate(),
          };
          // old way
          // let newTask: TodoItem = {
          //   id: element.payload.doc.id,
          //   title: (element.payload.doc.data() as any).title,
          //   completed: (element.payload.doc.data() as any).completed,
          //   createdAt: (element.payload.doc.data() as any).createdAt.toDate(),
          // };
          return newTask;
          // end :: old way
        });
        this.todo$.next(this._todos);
      });
  }

  getTodos() {
    return this._todos;
  }

  createTask(task: TodoItem): Promise<DocumentReference<any>> {
    return this.db.collection(todoTable).add(task);
  }

  deleteTask(id: string): Promise<void> {
    return this.db.doc(`${todoTable}/${id}`).delete();
  }

  updateTask(id: string, data: TodoItem) {
    return this.db.doc(`${todoTable}/${id}`).update(data);
  }
}
