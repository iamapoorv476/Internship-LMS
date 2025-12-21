Internship Learning Management System (LMS)

A role-based Internship LMS built with Node.js, Express, Supabase (PostgreSQL), and React, focusing on real-world RBAC enforcement, sequential learning flow, and certificate eligibility logic.

🚀 Features Overview

Authentication & Authorization (RBAC)

Roles: student, mentor, admin

JWT-based authentication

Route-level and service-level role enforcement

Mentor Capabilities

Create courses

Add chapters with enforced sequence order

Assign courses to students

Student Capabilities

View assigned courses

Complete chapters sequentially

Track progress per course

Download certificate upon full completion

Admin Capabilities

View mentor access requests

Approve mentor roles

Business Logic Enforcement

Chapters must be completed in sequence

Certificates are generated only after all chapters are completed

Duplicate progress and certificates are prevented at the database level

🧪 Test-Driven Development (TDD)

This project was developed following TDD principles wherever feasible:

Tests were written before implementing:

Authentication and RBAC enforcement

Sequential chapter unlocking logic

Certificate eligibility conditions

Followed the Red → Green → Refactor cycle

Business logic was validated both via tests and manual API testing

🧼 Clean Coding Practices

Modular folder structure (controllers, services, routes)

Clear separation of concerns

SOLID-oriented service design

Centralized error handling

Readable and maintainable code with meaningful naming

🧠 Database Choice: Supabase (PostgreSQL)

Supabase PostgreSQL was chosen because:

It provides a real production-grade relational database

Supports constraints, foreign keys, and unique indexes

Enables enforcing business rules at the database level, not just in code

Suitable for RBAC, progress tracking, and certificate uniqueness

This project does not use an in-memory database.

🤖 My AI Usage (Mandatory Disclosure)
AI Tools Used

ChatGPT (OpenAI)

How AI Was Used

Clarifying architectural decisions

Debugging complex backend issues

Improving code structure and readability

Assisting with edge-case handling (RBAC, certificates, progress tracking)

Writing clearer error messages and improving developer experience

Validation of AI-Generated Code

All AI-assisted code was:

Reviewed manually

Tested using API calls (Postman / browser)

Verified against business requirements

AI suggestions were adapted and rewritten where necessary

Reflection

AI significantly improved my productivity by:

Reducing debugging time

Helping reason through complex permission flows

Improving my understanding of backend system design

However, final responsibility for correctness, validation, and design decisions remained mine.

🧪 Test Coverage Summary

Authentication & authorization paths tested

Sequential chapter completion logic verified

Certificate eligibility validated both at API and database levels

Unique constraints used to prevent duplicate progress and certificates

🖼 Screenshots

Screenshots of:

Student dashboard

Mentor dashboard

Chapter completion flow

Certificate download flow
(available in the repository)

🌍 Deployment Status

The backend was prepared for deployment on Render and the frontend on Vercel.

Due to last-minute deployment issues related to port binding and environment configuration, the live deployment could not be finalized before submission.

All deployment configurations, environment variables, and build scripts are present in the repository.

Apologies for the inconvenience — the application runs correctly in local and staging environments.

🛠 Setup Instructions (Local)
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev


Ensure Supabase environment variables are configured.

📌 Final Notes

No plagiarism

AI usage transparently disclosed

Focused on business logic, RBAC enforcement, and real-world behavior

Built with production-grade tools and practices
