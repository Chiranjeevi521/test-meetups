export interface Meetup {
  id: string;
  title: string;
  date: Date;
  time: string;
  venue: string;
  shortDescription: string;
  fullDescription: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone?: string;
  mapPlaceholder: string;
}

export interface MeetupListItem {
  id: string;
  title: string;
  date: Date;
  time: string;
  venue: string;
  shortDescription: string;
}