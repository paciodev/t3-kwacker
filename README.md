# t3-kwacker

Mini social platform created with [T3 Stack](https://create.t3.gg) with a lot of features like commenting, admin panel, or for example reporting posts.

## Features

- Sign in/Sign out with Discord OAuth
- Creating own posts
- Reading posts, and commenting on them
- Deleting own posts and comments
- Reporting bad posts
- Adding hearts to posts
- _As admin_ Deleting other posts
- _As admin_ Banning users from app
- **In future** _As admin_ Checking reported posts

## Screenshots

![App Screenshot](https://i.imgur.com/Gq0bP0L.png)

![App Screenshot](https://i.imgur.com/nJL6qPm.png)

![App Screenshot](https://i.imgur.com/tFgCZQ1.png)

## Tech Stack - [T3](https://create.t3.gg)

**Client:** React, TailwindCSS, Heroicons, react-query, dayjs

**Server:** Nextjs, prisma, next-auth

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

**Next Auth**

`NEXTAUTH_SECRET`

`NEXTAUTH_URL`

**Next Auth Discord Provider**

`DISCORD_CLIENT_ID`

`DISCORD_CLIENT_SECRET`

## Run Locally

Clone the project

```bash
  git clone https://github.com/paciodev/t3-kwacker
```

Go to the project directory

```bash
  cd t3-kwacker
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

## Lessons Learned

I learned how to use [T3 Stack](https://create.t3.gg) for creating type-safe fullstack applications and I'm really proud of it.

## Support and feedback

For support and feedback, email contact@pacio.dev or checkout [my webpage](https://pacio.dev)
