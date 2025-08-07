import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MeetupService } from '../../services/meetup.service';
import { MeetupListItem } from '../../models/meetup.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  meetups: MeetupListItem[] = [];
  loading = true;

  constructor(private meetupService: MeetupService) {}

  ngOnInit() {
    this.loadMeetups();
  }

  loadMeetups() {
    this.meetupService.getAllMeetups().subscribe({
      next: (meetups) => {
        this.meetups = meetups.sort((a, b) => a.date.getTime() - b.date.getTime());
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meetups:', error);
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

  getGradientClass(index: number): string {
    const gradients = [
      'gradient-purple',
      'gradient-blue',
      'gradient-green',
      'gradient-orange',
      'gradient-card'
    ];
    return gradients[index % gradients.length];
  }
}