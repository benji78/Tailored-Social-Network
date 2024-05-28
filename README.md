# Tailored Social Network

The project aims to design and develop a TSN (Tailored Social Network) platform that offers advanced functionalities beyond traditional social media platforms. This TSN is based on a graph structure, inspired by the FOAF (Friend of a Friend) Ontology, enabling users to connect, interact, and share content in a more personalized and intuitive manner.

This TSN platform is composed of a React frontend and a Supabase backend. The frontend is built using Vite, React, and Tailwind CSS, while the backend is built using Supabase, a cloud-based service that provides a set of tools to build and manage a database, authentication, and storage.

## Features

[//]: # 'The TSN platform can take into consideration, and not limited to, the following features:'
[//]: # 'Graph-Based Networking: Implement a graph-based data structure to represent user connections, interests ... and relationships,'
[//]: # 'Recommendation: Develop an intelligent recommendation procedure based on user interactions, interests ... and preferences,'
[//]: # 'Privacy Controls: Provide users with fine-grained privacy settings to control the visibility of their posts and personal information,'
[//]: # 'Customizable User Profiles: Allow users to create rich, customizable profiles with multimedia content and detailed information,'
[//]: # 'Intuitive User Interface: Design an intuitive user interface for seamless navigation and interaction,'
[//]: # 'Messaging and Notifications: Implement real-time messaging and notification features to keep users updated on their network activities,'
[//]: # 'Content Sharing and Collaboration: Enable users to share various types of content (text, images, videos) and collaborate on projects or events,'

- **Authentication**: Users can use the app anonymously or sign up and log in
- **Connections**: Users can connect with other users
- **Projects**: Users can create and share projects
- **Updates**: Users can create and share updates on projects
- **Messaging**: Users can send messages to other users in real-time
- **Notifications**: Users can receive notifications
- **Recommendations**: Users can receive recommendations
- **Graph**: Users can see the graph of the network

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

## Report

The report is also available in pdf format [here](report.pdf)

### Project Report: Developing a Social Network with React, TypeScript, and Supabase

Date: May 28, 2024

### Introduction:

This report summarizes the work completed by our team in developing an innovative social network. Our project aims to provide a user-friendly platform where users can share projects, updates, and interact with other community members. To achieve this, we utilized modern technologies, including React with TypeScript for the frontend and Supabase for the backend.

### Project Overview:

The site we have developed offers a plethora of features to encourage user interaction and facilitate project sharing. Among the key features, we can highlight:

- User Authentication: Benjamin Bordes handled the initial setup of the solution, including user authentication. This step is crucial to ensure the security and confidentiality of user data.

- User Profile and Project Publication: Benjamin Brehier Cardoso was responsible for developing the user profile, project publication, and project updates. He also implemented the display of the leaderboard for the most active projects, providing increased visibility to member contributions.

- Instant Messaging: Benjamin Brehier Cardoso also implemented instant messaging functionality, allowing users to interact more directly. This feature promotes exchanges and strengthens community ties.
- Friend Recommendation: Corentin Campano developed a friend recommendation system based on existing relationships between users and published projects (FOAF). This feature encourages the expansion of the social network by suggesting relevant connections. It highlights the algorithm behind powering the site and enhancing user interaction.

- Directed Graph Modeling: Corentin Campano also worked on modeling a directed graph representing project tags and connected users. This approach provides a clear visualization of interactions within the platform.
- Automatic deployment: Benjamin Bordes also handled the CI and automatic deployment to a Vercel server.

### Conclusion:

In summary, our team has accomplished remarkable work in developing this social network. Through the use of advanced technologies such as React, TypeScript, and Supabase, we have been able to offer a feature-rich user experience. Each member of the team has made a significant contribution, resulting in a dynamic and engaging platform. We are confident that our project will be successful and contribute to strengthening community bonds.

Development Team:

- Benjamin Bordes
- Benjamin Brehier Cardoso
- Corentin Campano
