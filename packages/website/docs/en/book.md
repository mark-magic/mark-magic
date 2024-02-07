# Novel => Website + EPUB

## Prerequisites

1. Already installed the latest lts version of [nodejs](https://nodejs.org)
2. Already installed the latest version of [git](https://git-scm.com/)
3. A terminal to access mark-magic via the command line interface
4. Text editor supporting markdown and yaml. Recommend [vscode](https://code.visualstudio.com/)

## Initialize Novel Project

1. Create a blank directory, then initialize a package.json and a books directory to hold the novel.

   ```sh
   mkdir my-book && cd my-book
   npm init -y
   mkdir books
   ```

2. Install dependencies

   ```sh
   npm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub live-server
   ```

## Configure Novel

Add configuration file `mark-magic.config.yaml`, the input is the local books directory, and the output is configured respectively as epub/docs.

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # Input plugin, read from local directory
      config:
        path: ./books/ # Reading directory
    output:
      name: '@mark-magic/plugin-epub' # Output plugin, generate epub file
      config:
        path: ./dist/my-book.epub # Generating path
        id: my-book # Unique id of novel
        title: My First Book # Novel title
        creator: Mark Magic # Creator
  - name: docs
    input:
      name: '@mark-magic/plugin-local' # The same as above
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs' # The same as above
      config:
        path: ./dist/docs/ # Output directory
        name: 'My First Book' # Novel title
```

## Start Writing

Start from the homepage of the novel, create readme.md as the homepage in the books directory.

```md
# Hello World
```

Then you can continue to create more. To keep the order, it is recommended to use prefixes such as 01,02,03... for the file name.

File structure

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

## Run Build

Now, you can start building.

```sh
npx mark-magic
```

After that, you can see the epub file and the built html file in dist. Use live-server to preview it.

```sh
npx live-server dist/docs
```

> Example project can be seen at <https://github.com/mark-magic/book-demo>.

## Local Build and Test

After the local build is completed, you can preview it locally first.

```sh
npx mark-magic
npx live-server dist/docs
```

## Set Public Base Path

By default, we assume the site will be deployed at the root path `/` of the domain. If the website will be served on a sub-path, such as <https://mywebsite.com/blog/>, then you need to set the `base` option of the `plugin-docs` plugin in _mark-magic.config.yaml_ to `'/blog/'`.

Example: If you use Github Pages and deploy to `user.github.io/repo/`, then set `base` to `/repo/`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: docs
    input:
      name: '@mark-magic/plugin-local' # As above
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs' # As above
      config:
        path: ./dist/docs/ # Output directory
        name: 'My First Book' # Novel title
        base: /repo/
```

## Platform Guide

### GitHub Pages

1. Create a `deploy.yml` in the `.github/workflows` directory of your project, containing the following content.

   ```yml
   name: Deploy site to Pages

   on:
     # Runs on pushes targeting the `main` branch. Change this to `master` if you're
     # using the `master` branch as the default branch.
     push:
       branches: [main]

     # Allows you to run this workflow manually from the Actions tab
     workflow_dispatch:

   # Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
   # However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     # Build job
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
           with:
             fetch-depth: 0 # Not needed if lastUpdated is not enabled
         # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
         # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: 20
             cache: pnpm # or pnpm / yarn
         - name: Setup Pages
           uses: actions/configure-pages@v3
         - name: Install dependencies
           run: pnpm i # or pnpm install / yarn install / bun install
         - name: Build
           run: |
             pnpm mark-magic
             touch dist/docs/.nojekyll
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             path: dist/docs

     # Deployment job
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       needs: build
       runs-on: ubuntu-latest
       name: Deploy
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v2
   ```

   > Make sure the `base` configuration of plugin-docs is correct, please refer to [Setting Public Base Path](#set-public-base-path)

2. Under the **Settings > Pages** of your repository, select **GitHub Actions** in **Build and deployment > Source**.

3. Push changes to GitHub and wait for the GitHub Actions workflow to complete. You should see the site deployed at `https://<username>.github.io/[repository]/` or `https://<custom-domain>/` depending on the settings. Your site will be automatically deployed on each push to the main branch.

## Next Steps

- To better understand how it actually works, please continue reading [Plugins](./plugin/index.md)
