# DeveloperNetwork — Full-Stack Developer Platform

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Spring Security](https://img.shields.io/badge/Security-JWT%20%26%20OAuth2-6DB33F?style=flat&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![WebSocket](https://img.shields.io/badge/Real--Time-STOMP%20%2F%20WebSocket-010101?style=flat&logo=socketdotio&logoColor=white)](https://spring.io/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

A scalable full-stack community platform designed for developers to build professional connection networks, discover peers, and exchange real-time direct messages. Built with **Spring Boot** on the backend using clean layered design patterns, backed by **PostgreSQL** with cursor-paginated queries, and containerized via **Docker Compose**.

---

## 🚀 Key Highlights & Architecture

- **Clean Layered Architecture:** Strict separation of concerns across `Controller`, `Service`, and `Repository` layers.
- **DTO Projection Pattern:** Complete decoupling of JPA domain entities from public REST API contracts to prevent over-fetching and accidental data exposure.
- **Optimized Relational Schema:** Bidirectional connection graph models and message histories mapped with Hibernate/JPA, utilizing composite database indexes and cursor-based pagination for $O(1)$ feed loading.
- **Stateless Security Pipeline:** Custom Spring Security filter chain with stateless JWT validation, BCrypt password hashing, and GitHub OAuth2 social login.
- **Secure 1:1 STOMP Messaging:** Real-time bi-directional messaging over WebSockets with server-side handshake authorization and connection state validation.
- **Production Containerization:** Multi-stage `Dockerfile` and `docker-compose.yml` orchestrating API services, persistent PostgreSQL volumes, and isolated bridge networks.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Backend Framework** | Java 17+, Spring Boot 3.x, Spring MVC, Spring Data JPA |
| **Security & Auth** | Spring Security 6, Stateless JWT (JJWT), OAuth 2.0 (GitHub) |
| **Real-Time Communication** | Spring WebSocket, STOMP Messaging Broker |
| **Database & ORM** | PostgreSQL, Hibernate ORM |
| **DevOps & Tooling** | Docker, Docker Compose, Maven, Postman |
| **Frontend** | React.js, Tailwind CSS |

---

## 🏗️ System Architecture

```text
[ React Frontend / Client ]
            |
            +--- (HTTP REST / JSON) ---> [ JWT Filter / Security Context ]
            |                                         |
            |                               [ REST Controllers ]
            |                                         |
            |                                [ Service Layer ]
            |                                         |
            |                                [ DTO Projections ]
            |                                         |
            |                            [ Spring Data Repositories ]
            |                                         |
            |                                  [ PostgreSQL ]
            |
            +--- (WS / STOMP Handshake) -> [ STOMP Message Broker ]
                                                      |
                                        [ Authenticated 1:1 Channels ]
