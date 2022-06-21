# PilotSysMon

Simple material design system monitor Vue 2 application, using Vuetify.js components and [PilotSysModBackend](https://github.com/SanyaPilot/PilotSysMonBackend) API

## OS support

**Currently tested with backend running on Linux machines only!** In theory, it should work on Windows and macOS, but some features may be broken.

## Panels

- System overall
- CPU (load and frequency charts, detailed info **only on Linux**)
- Storage devices (mountpoints, options and filled space)
- System memory (RAM and swap load charts)
- Network stats (real-time bandwidth measuring, network interfaces info)
- Log viewer (works **only on Linux with systemd**!)

## Screenshots
![Снимок экрана от 2022-06-21 17-23-35](https://user-images.githubusercontent.com/29630471/174835157-46364bcd-1e0f-48b0-89f2-e73a60e9986b.png)
![Снимок экрана от 2022-06-21 17-24-28](https://user-images.githubusercontent.com/29630471/174835191-3aa61c78-ffca-4576-a0ad-a6f275415846.png)
![Снимок экрана от 2022-06-21 17-24-33](https://user-images.githubusercontent.com/29630471/174835208-dfd310cb-3900-456d-9ec9-1a05a5d49ddb.png)
![Снимок экрана от 2022-06-21 17-24-38](https://user-images.githubusercontent.com/29630471/174835224-ee7d509c-c477-4eb3-83b7-2855fff73813.png)
![Снимок экрана от 2022-06-21 17-24-46](https://user-images.githubusercontent.com/29630471/174835239-0909b5ec-924e-4ff0-aeac-bb5b8d3b5e1c.png)
![Снимок экрана от 2022-06-21 17-24-51](https://user-images.githubusercontent.com/29630471/174835268-12a0beda-360b-41cb-99f0-0936271134d8.png)


## Deploy

1. Install npm on your Linux distribution
2. Clone this repo:
   `git clone https://github.com/SanyaPilot/PilotSysMon`
3. Install backend referring to it's [installation instruction](https://github.com/SanyaPilot/PilotSysMonBackend#deploying)
4. Cd into the previously cloned project repo  
   Execute `npm install` to install all required dependencies
5. Adjust URL to backend API by editing *src/API/common.js*.  
   Just replace string `"http://localhost:8000"` with anything you want

#### Development build

Just hit `npm run serve` and all is set! This will execute development server at `localhost:8080`

#### Production build

To create production-optimized build without any useless debugging to deploy on your preferred HTTP server (Nginx or Apache for example), execute  

`npm run build`  

Ready production build files will be placed into the *dist* directory at the project root

