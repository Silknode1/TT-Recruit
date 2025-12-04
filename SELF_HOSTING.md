# Self-Hosting Guide for TT-Recruit

This guide explains how to host the **TT-Recruit** application on your own infrastructure (VPS, internal server, or local machine).

## Prerequisites

- **Node.js**: Version 18+ installed.
- **Git**: To clone the repository.
- **Web Server**: Nginx, Apache, or a static file host (if deploying the build).

---

## Option 0: Quick Start (Easiest)

This is the simplest way to run a "production-like" version on your machine without installing Nginx or Docker.

1.  **Build the App**:
    ```bash
    npm run build
    ```

2.  **Serve it Locally**:
    Use the `serve` utility to host the built files.
    ```bash
    npx serve -s dist
    ```
    
    Your app is now running at `http://localhost:3000`.
    *Point your Cloudflare Tunnel to this port!*

---

## Option 1: Running Locally (Development Mode)

If you just want to run it on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd TT-Recruit
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## Option 2: Deploying to a VPS (Production Build)

To host it on a server (e.g., DigitalOcean, AWS, Linode) using Nginx.

### 1. Build the Application
On your local machine or the server, run:
```bash
npm run build
```
This creates a `dist/` folder containing the optimized static files.

### 2. Configure Nginx
Install Nginx on your server (`sudo apt install nginx`) and create a configuration file:

```nginx
server {
    listen 80;
    server_name your-domain.com; # Or your server IP

    root /var/www/tt-recruit/dist; # Path to your build folder
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Deploy Files
Copy the contents of the `dist/` folder to `/var/www/tt-recruit/dist` on your server.

### 4. Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## Option 3: Docker (Containerized)

If you prefer using Docker.

### 1. Create a `Dockerfile`
Create a file named `Dockerfile` in the project root:

```dockerfile
# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create `nginx.conf`
Create an `nginx.conf` file in the root:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Build and Run
```bash
docker build -t tt-recruit .
docker run -d -p 8080:80 tt-recruit
```
Access at `http://localhost:8080`.

---

## Important: API Keys

Since this is a client-side application, the **Gemini API Key** is stored in the user's browser (Local Storage). You do **not** need to configure environment variables on the server for the API key.

However, if you want to pre-configure it (not recommended for public hosting), you would need to modify the code in `src/config/constants.js` to read from an environment variable during build time.

---

## Sharing with Others (External Access)

If you are hosting this on your local machine or a home server and want to give access to friends or colleagues outside your network, the safest and easiest way is using a **Tunneling Service**.

### Recommended: Cloudflare Tunnel (Free)

This exposes your local server to the internet securely without opening ports on your router.

1.  **Install `cloudflared`**:
    - **Mac**: `brew install cloudflare/cloudflared`
    - **Linux**: Follow instructions on Cloudflare's site.

2.  **Start the Tunnel**:
    Assuming your app is running on port `5173` (dev) or `80` (production/docker):
    ```bash
    cloudflared tunnel --url http://localhost:5173
    ```

3.  **Share the URL**:
    Cloudflare will generate a random URL (e.g., `https://random-name.trycloudflare.com`). Share this link with your team.

### Important Note for Users
Since the **Gemini API Key** is stored in the browser's local storage:
- **Each user** who visits your link will need to enter their **own** API key in the Settings tab.
### Is this safe?
**Yes, it is much safer than "Port Forwarding"** because you don't open any holes in your home router's firewall.

**However, keep in mind:**
1.  **The URL is Public**: Anyone who guesses or gets the URL can see the login page.
2.  **Data Privacy**: Since the app stores data in the *browser* (Local Storage) and uses *your* API key, there is no risk of strangers accessing your saved data or stealing your key just by visiting the site.
3.  **For Extra Security**: If you want to restrict access to *only* specific emails, look into **Cloudflare Access (Zero Trust)**. It's free for up to 50 users and sits on top of the tunnel.


