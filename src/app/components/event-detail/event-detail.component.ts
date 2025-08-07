import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MeetupService } from '../../services/meetup.service';
import { Meetup } from '../../models/meetup.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  meetup: Meetup | null = null;
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private meetupService: MeetupService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMeetup(id);
    } else {
      this.loading = false;
      this.notFound = true;
    }
  }

  loadMeetup(id: string) {
    this.meetupService.getMeetupById(id).subscribe({
      next: (meetup) => {
        if (meetup) {
          this.meetup = meetup;
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meetup:', error);
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}