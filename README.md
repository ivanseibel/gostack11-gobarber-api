🚧 **UNDER CONSTRUCTION** 🚧

# Description

This API is part of the GoBarber project that implements a fictitious service, in which people can find barbers and make appointments to take care of their hair and shave.

GoBarber project is one of the several that are implemented during Rocketset GoStack bootcamp.

# Requirements

## Password Recovery

**Functional Requirements**

- As an Any User, I want to request to recover my password using my email account;
- As an Any User, I want to receive password recovery instructions in my email;
- As an Any User, I want to reset my password;

**Non Functional Requirements**

- Use Mailtrap service to test email sending in development environment;
- Use Amazon SES to email senging in production environment;
- Use queue management to serialize email sending in background;

**Business Requirements**

- The password recovery link must be invalidated 2 hours after sending;
- The user must re-type his new password to confirm before save it;

## Profile Update

**Functional Requirements**

- As an Any User, I want to update my personal information: name, email and password;

**Business Requirements**

- The user cannot change his email to an email that already exists;
- The user must type his old password before to update to a new password;
- The user must re-type his new password to confirm before save it;

## Service Provider Panel

**Functional Requirements**

- As a Provider User, I want to see all my appointments for a specific day;
- As a Provider User, I want to receive a notification always a new appointment is created for me;
- As a Provider User, I want to distinguish read and unread notifications;

**Non Functional Requirements**

- Provider appointments of the today must be persisted in cache to improve requests performance.
- Notifications will be persisted on MongoDB database;
- Notifications are going to be send in real-time using Socket.io;

**Business Requirements**

- Notifications must show read and unread status to Provider can control.

## Services Appointment

**Functional Requirements**
- As a Customer User, I want to get a list of all available service providers;
- As a Customer User, I want to see every day of a month that has at least one available time;
- As a Customer User, I want to see available times from a specific service provider;
- As a Customer User, I want to create a new appointment to a specific service provider in an available time;

**Non Functional Requirements**

- Providers list must be persisted in cache to improve requests performance;

**Business Requirements**

- Each appointment will spend 1h exactly;
- First time available is 8am and last time available is 5pm.
- The user cannot create an appointment for an specific service provider in a time that is already busy;
- The user cannot choose past times to create appointments;
- The user cannot create appointments to a provider that is himself;
