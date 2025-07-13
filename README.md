# Monkey tours

Monkey tours is an event and tours social platform where users can post, view, and interact with event-related content. It includes user authentication, profile management, media uploads, vendor details, trivia, and more.

---

## 🚀 Features

- Event Feed with Infinite Scroll
- User Authentication (Email/Password, Google, Facebook)
- Profile Management (Update Profile, Avatar Upload)
- Vendor Sections and Media
- Trivia Questions and Answers
- Responsive UI with Dark Mode Support
- Toast Notifications for Success & Errors

---

## 🛠 Installation

Clone the repository:

```bash
git clone https://github.com/Twisac-Solutions/tours-dashboard.git
cd tours-dashboard
```

### Using **npm**:

```bash
npm install
```

### Using **pnpm**:

```bash
pnpm install
```

### Using **yarn**:

```bash
yarn install
```

---

## ⚙️ Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

Or for local development:

```bash
cp .env.example .env.local
```

2. Fill in your API base URL, secrets, and other environment variables.

---

## 🧪 Run the App

### Development Server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

The app will run at [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure Overview

```
/app              # Next.js App Router pages and components
/components       # Reusable UI components (Buttons, Toasts, etc.)
/lib              # Axios instances, authentication helpers
/store            # Zustand state management
```

---

## 📌 Notes

- Ensure your backend is running and accessible at the API base URL set in `.env`.
- Authentication tokens are stored securely in cookies/local storage depending on implementation.
- Uses **shadcn/ui** for styled UI components.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/awesome-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request 🚀
