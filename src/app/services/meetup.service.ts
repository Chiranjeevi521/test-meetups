import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Meetup, MeetupListItem } from '../models/meetup.model';

@Injectable({
  providedIn: 'root'
})
export class MeetupService {
  private mockMeetups: Meetup[] = [
    {
      id: '1',
      title: 'Test Automation with Selenium & Python',
      date: new Date('2024-09-15'),
      time: '18:00',
      venue: 'Tech Hub Downtown, Conference Room A',
      shortDescription: 'Learn advanced Selenium techniques and best practices for Python-based test automation.',
      fullDescription: 'Join us for an in-depth workshop on test automation using Selenium WebDriver with Python. We\'ll cover advanced techniques including page object model, data-driven testing, parallel execution, and CI/CD integration. Perfect for QA engineers looking to enhance their automation skills.',
      organizerName: 'Sarah Johnson',
      organizerEmail: 'sarah.johnson@testpro.com',
      organizerPhone: '+1-555-0123',
      mapPlaceholder: 'Map showing Tech Hub Downtown location at 123 Main St'
    },
    {
      id: '2',
      title: 'API Testing Workshop with Postman & Newman',
      date: new Date('2024-09-22'),
      time: '14:00',
      venue: 'Innovation Center, Room 305',
      shortDescription: 'Master API testing strategies using Postman collections and Newman automation.',
      fullDescription: 'Comprehensive workshop covering REST API testing methodologies. Learn how to create robust test suites in Postman, automate them with Newman, integrate with CI/CD pipelines, and implement effective API testing strategies for microservices architecture.',
      organizerName: 'Mike Chen',
      organizerEmail: 'mike.chen@apitest.org',
      organizerPhone: '+1-555-0456',
      mapPlaceholder: 'Map showing Innovation Center at 456 Oak Avenue'
    },
    {
      id: '3',
      title: 'Mobile Testing Strategies for iOS & Android',
      date: new Date('2024-09-29'),
      time: '19:00',
      venue: 'Digital Campus, Auditorium B',
      shortDescription: 'Explore mobile testing approaches, tools, and device cloud solutions.',
      fullDescription: 'Deep dive into mobile application testing covering native, hybrid, and web apps. We\'ll explore Appium, Espresso, XCUITest, device cloud solutions, and discuss challenges unique to mobile testing including device fragmentation, network conditions, and performance testing.',
      organizerName: 'Lisa Rodriguez',
      organizerEmail: 'lisa.rodriguez@mobileqa.com',
      organizerPhone: '+1-555-0789',
      mapPlaceholder: 'Map showing Digital Campus at 789 Pine Street'
    },
    {
      id: '4',
      title: 'Performance Testing with JMeter',
      date: new Date('2024-10-06'),
      time: '13:30',
      venue: 'Startup Incubator, Meeting Room 1',
      shortDescription: 'Learn load testing fundamentals and advanced JMeter scripting techniques.',
      fullDescription: 'Hands-on session covering performance testing fundamentals using Apache JMeter. Topics include test plan creation, load modeling, result analysis, distributed testing, and integration with monitoring tools. Bring your laptop for practical exercises.',
      organizerName: 'David Kumar',
      organizerEmail: 'david.kumar@perftest.net',
      mapPlaceholder: 'Map showing Startup Incubator at 321 Elm Drive'
    },
    {
      id: '5',
      title: 'Behavior Driven Development with Cucumber',
      date: new Date('2024-10-13'),
      time: '17:00',
      venue: 'Community College, Lab 204',
      shortDescription: 'Introduction to BDD principles and Cucumber framework implementation.',
      fullDescription: 'Learn Behavior Driven Development (BDD) principles and how to implement them using Cucumber. We\'ll cover Gherkin syntax, step definitions, scenario design, and collaboration between developers, testers, and business analysts for better software quality.',
      organizerName: 'Jennifer Thompson',
      organizerEmail: 'jennifer.thompson@bddworkshop.com',
      organizerPhone: '+1-555-0234',
      mapPlaceholder: 'Map showing Community College at 567 Maple Road'
    }
  ];

  getAllMeetups(): Observable<MeetupListItem[]> {
    const meetupListItems: MeetupListItem[] = this.mockMeetups.map(meetup => ({
      id: meetup.id,
      title: meetup.title,
      date: meetup.date,
      time: meetup.time,
      venue: meetup.venue,
      shortDescription: meetup.shortDescription
    }));
    return of(meetupListItems);
  }

  getMeetupById(id: string): Observable<Meetup | undefined> {
    const meetup = this.mockMeetups.find(m => m.id === id);
    return of(meetup);
  }
}