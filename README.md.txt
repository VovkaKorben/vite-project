make VITE app
npm create vite@latest


# structure


• + register page
  • information "e-mail was sent"
  • confirmation "e-mail confirmed"
• +login page (on this page also link to register)
  • 
• +logout 
restore password
chamge password



# debug

### server debug
1. run new javascript debug terminal (ctrl+shift+P -> select from menu)
2. in this terminal run with -> npm run dev

 "scripts": {
    "dev": "nodemon --inspect=3500 ./server.js"
  }



  ### front debug
1. run new javascript debug terminal (ctrl+shift+P -> select from menu)
2. in this terminal run with -> npm run dev
3. next launch chrome with
      "configurations": [
        {
            "name": "webdevstudios.com",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:5173",
            "webRoot": "${workspaceFolder}/src",
        },