## Getting Started

1. **Node Version Managment**
   This project uses `.nvmrc` to specify the Node.js version.

   To switch to the correct Node version, use:

   ```bash
   nvm install    # installs the version defined in .nvmrc (only needed once)
   nvm use        # switches to the correct Node version
   ```

   Make sure you have [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) installed.

   Unfortunately, NVM does not switch versions automatically when you `cd` into the project directory. If you want to call `nvm use` automatically in a directory with a .nvmrc file, check this:
   [stack guide](https://stackoverflow.com/questions/23556330/run-nvm-use-automatically-every-time-theres-a-nvmrc-file-on-the-directory).

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in your browser:**

   [http://localhost:3000](http://localhost:3000)

---

## Project structure

https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md

---
