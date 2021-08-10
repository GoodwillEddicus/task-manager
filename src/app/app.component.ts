import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TodoItem } from './models/task';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isEditing = false;
  task?: TodoItem; // task item being edited

  tasks: TodoItem[] = [];
  title = 'todo';
  descControl: FormControl = new FormControl('', [Validators.required]);
  titleControl: FormControl = new FormControl('', [Validators.required]);

  constructor(private todoService: TodoService) {
    todoService.todo$.subscribe((items) => {
      this.tasks = items;
    });
  }

  submit() {
    this.titleControl.markAsTouched();
    this.descControl.markAsTouched();
    if (this.titleControl.valid && this.descControl.valid) {
      // define new task
      let newTask: TodoItem = {
        title: this.titleControl.value,
        desc: this.descControl.value,
      };

      if (this.isEditing) {
        this.todoService.updateTask(this.task!.id!, newTask).then((ref) => {
          this.titleControl.reset();
          this.descControl.reset();

          // reset update variables
          this.task = undefined;
          this.isEditing = false;
        });
      } else {
        // append date variable
        newTask.createdAt = new Date();
        newTask.completed = false;

        this.todoService.createTask(newTask).then((ref) => {
          this.titleControl.reset();
          this.descControl.reset();
        });
      }
    } else {
    }
  }

  delete(id: string) {
    this.todoService.deleteTask(id);
  }

  onTaskStatusChange(event: MatCheckboxChange, id: string) {
    this.todoService.updateTask(id, {
      completed: event.checked,
    });
  }

  edit(task: TodoItem) {
    this.titleControl.setValue(task.title);
    this.descControl.setValue(task.desc);
    this.isEditing = true;
    this.task = task;
  }
}
