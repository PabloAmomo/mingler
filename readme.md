# Mingler: WebRTC-based Omegle Clone

## Overview

This project is an exercise in developing a real-time peer-to-peer communication application using WebRTC. It is a clone of Omegle, meticulously crafted with vanilla JavaScript, and deliberately avoiding the use of any frameworks.\
This application serves as a mini-framework, incorporating several key features:

**WebRTC Implementation:** At its core, the project leverages WebRTC to enable direct, real-time communication between users. This technology is pivotal in facilitating seamless peer-to-peer connections.

**SPA (Single Page Application):** Designed as a Single Page Application, it ensures a fluid user experience. The URL changes as users navigate through the application, yet the page does not reload, maintaining a smooth and uninterrupted interaction.

**i18n Integration:** Internationalization (i18n) is built into the application, making it adaptable and accessible to a global audience. This feature allows for easy translation and localization.

**Basic HTML Template Model:** The application employs a simple yet effective HTML template model. This approach aids in maintaining a clean and manageable codebase, allowing for easy modifications and enhancements.

**Anonymous Connections:** Users can connect anonymously, fostering a platform where interactions are bound by privacy and discretion. The application supports both text and video chats, providing versatility in user communication.

## Purpose

The primary goal of this project is to demonstrate the practical implementation of WebRTC in a real-world application. It serves as a testament to the capabilities of vanilla JavaScript in creating complex, interactive web applications.\
This project is ideal for those interested in understanding the intricacies of peer-to-peer communication technologies and for developers seeking to delve into the realms of WebRTC and SPA without the overhead of extensive frameworks.

# Getting Started

This section provides detailed instructions on how to set up and run the project on your local environment. Whether you're a developer looking to contribute or just interested in exploring the project, follow these steps to get started.

## Clone the Repository

Begin by cloning the repository to your local machine:

```
git clone https://github.com/PabloAmomo/mingler.git
cd mingler\
```

## Install Dependencies

```
npm install
```

## Run with docker

To run the platform using Docker, execute the following command based on your operating system:

- For Windows

```
docker compose up -d
```

- For Linux

```
docker-compose up -d
```

After starting the Docker containers, access the application in your browser at **http://localhost:2100**. If you have configured a different HTTP server port, use that instead.

## Developer Mode

If you're a developer intending to work on the source code and require live updates with service restarts (both HTTP and WebSocket), follow these steps:

**1. Initialize the STUN (Session Traversal Utilities for NAT) Server:**

Navigate to the stun-server directory and start the server using Docker.

```
cd stun-server
docker compose --env-file ../.env up -d
```

**2. Start the HTTP and WebSocket Servers:**

You need to run both servers to initialize the application:

```
npm run start-http-dev
npm run start-ws-dev
```

Once the servers are up, visit **http://localhost:2100** in your browser. Again, if you've set a different port for the HTTP server in your configuration, use that port instead.

# Configuration Guide

This section details how to configure the application using the .env file, located in the root directory. The .env file allows you to set various environment variables to tailor the application to your needs.

## Environment Variables

**1. Development Context:**

- Determines if the application is running in development (DEV) mode.
- Default: true
- To set, use:

```
DEV=true
```

**2. HTTP Web Server Port:**

- Specifies the port for the HTTP web server.
- Default: 2100
- To set, use:

```
PORT_HTTP=2100
```

**3. WebSocket Service Port:**

- Defines the port for listening to the WebSocket service.
- Default: 2200
- To set, use:

```
PORT_WS=2200
```

**4. STUN (Session Traversal Utilities for NAT) Server Port:**

- Sets the port for the STUN (Signaling) server.
- Default: 2300
- To set, use:

```
PORT_STUN=2300
```

## Modifying Configuration

To change any of these settings, simply edit the corresponding line in the .env file. For instance, to change the HTTP server port to 3000, modify the line to PORT_HTTP=3000.

Remember to restart the application for any changes to take effect.

# STUN Server for WebRTC Signaling (TL;DR)

## Introduction

This repository contains the implementation of a STUN (Session Traversal Utilities for NAT) server designed specifically for signaling in WebRTC applications. The STUN server plays a crucial role in facilitating the peer-to-peer (P2P) communication in WebRTC by enabling the traversal of Network Address Translators (NATs) and firewalls.

## Features

**Port Configuration:** The server runs on port 3478, supporting both UDP and TCP protocols, ensuring compatibility and flexibility in various network environments.\
**WebRTC Signaling:** Primarily focused on WebRTC signaling, this STUN server assists in establishing direct communication paths between peers in a WebRTC session.\
**NAT Traversal:** Efficiently handles NAT traversal, enabling peers behind different NATs to discover and communicate their public-facing IP addresses and ports.

## Acknowledgements

A special thanks to scjtqs for their invaluable contributions with the stun docker image.
