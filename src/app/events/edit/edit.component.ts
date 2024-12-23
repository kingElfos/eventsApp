import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { EventUseCases } from '@application/events/use-cases/event.usecases';
import { ActivatedRoute, Router } from '@angular/router';
import { parseDateToISO, formatDate } from '@shared/helpers/parseDateToISO';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  public eventForm: FormGroup;
  private readonly messageService = inject(MessageService);
  private readonly events = inject(EventUseCases);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private id = '';

  constructor(private readonly fb: FormBuilder) {
    this.eventForm = this.fb.group({
      type: ['', Validators.required],
      responsible: this.fb.group({
        id: 1,
        name: ['John Doe', Validators.required],
        role: ['facilitator', Validators.required],
        email: ['john@example.com', [Validators.required, Validators.email]],
      }),
      date: ['', Validators.required],
      location: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.id = id;
      this.events.getById(id).subscribe((event) => {
        const formattedDate = formatDate(event.date);
        this.eventForm.patchValue({ ...event, date: formattedDate });
      });
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const selectedDate = this.eventForm.value.date;
      const formattedDate = parseDateToISO(selectedDate);

      const event = this.eventForm.value;
      event.date = formattedDate;

      if (this.id) {
        this.events.put(this.id, event).subscribe({
          next: () => {
            this.router.navigate(['/events/list']);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an issue editing the event, please try again.',
              life: 5000,
            });
            console.error(err);
          },
        });
      }
    }
  }
}
