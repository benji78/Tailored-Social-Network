# Tailored Social Network

The project aims to design and develop a TSN (Tailored Social Network) platform that offers advanced functionalities beyond traditional social media platforms. This TSN is based on a graph structure, inspired by the FOAF (Friend of a Friend) Ontology, enabling users to connect, interact, and share content in a more personalized and intuitive manner.

This TSN platform is composed of a React frontend and a Supabase backend. The frontend is built using Vite, React, and Tailwind CSS, while the backend is built using Supabase, a cloud-based service that provides a set of tools to build and manage a database, authentication, and storage.

## Features

[//]: # (The TSN platform can take into consideration, and not limited to, the following features:)
[//]: # (Graph-Based Networking: Implement a graph-based data structure to represent user connections, interests ... and relationships,)
[//]: # (Recommendation: Develop an intelligent recommendation procedure based on user interactions, interests ... and preferences,)
[//]: # (Privacy Controls: Provide users with fine-grained privacy settings to control the visibility of their posts and personal information,)
[//]: # (Customizable User Profiles: Allow users to create rich, customizable profiles with multimedia content and detailed information,)
[//]: # (Intuitive User Interface: Design an intuitive user interface for seamless navigation and interaction,)
[//]: # (Messaging and Notifications: Implement real-time messaging and notification features to keep users updated on their network activities,)
[//]: # (Content Sharing and Collaboration: Enable users to share various types of content &#40;text, images, videos&#41; and collaborate on projects or events,)

- **Authentication**: Users can use the app anonymously or sign up and log in
- **Connections**: Users can connect with other users
- **Posts**: Users can create and share posts
- **Comments**: Users can comment on posts
- **Likes**: Users can like posts
- **Search**: Users can search for other users
- **Messaging**: Users can send messages to other users in real-time
- **Notifications**: Users can receive notifications
- 

## Install dependencies

```shell
pnpm install
```

## Developing

```shell
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```
## Building

To create a production version of the app:

```shell
pnpm build
```

You can preview the production build with `pnpm run preview`.
