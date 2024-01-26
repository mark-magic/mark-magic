# Fiction => Website + EPUB

## Prerequisites

1.  [Node.js](https://nodejs.org) (latest LTS version) installed
2.  [Git](https://git-scm.com/) (latest version) installed
3.  Terminal for accessing mark-magic through the command line interface
4.  Text editor that supports markdown and YAML, recommended: [VSCode](https://code.visualstudio.com/)

## Initialize Fiction Project

1.  Create an empty directory and initialize package.json and the "books" directory for storing the fiction

    ```sh
    mkdir my-book && cd my-book
    npm init -y
    mkdir books
    ```

2.  Install dependencies

    ```sh
    npm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub live-server
    ```

## Configure Fiction

Add a configuration file `mark-magic.config.yaml`. The input will be the local "books" directory, and the outputs will be configured as epub/docs.

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # Input plugin, reads from local directory
      config:
        path: ./books/ # Directory to read from
    output:
      name: '@mark-magic/plugin-epub' # Output plugin, generates epub file
      config:
        path: ./dist/my-book.epub # Path to generate file
        id: my-book # Unique id for the fiction
        title: My First Book # Name of the fiction
        creator: Mark Magic # Creator
  - name: docs
    input:
      name: '@mark-magic/plugin-local' # Same as above
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs' # Same as above
      config:
        path: ./dist/docs/ # Output directory
        name: 'My First Book' # Name of the fiction
```

## Start Writing

Start with the homepage of the fiction and create a readme.md file in the "books" directory.

```md
# Hello World
```

You can continue writing more. To maintain order, it is recommended to use prefixes like 01, 02, 03... for file names.

File structure

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

## Run the Build

Now, you can start the build process.

```sh
npx mark-magic
```

After completion, you can see the generated epub file and the built HTML files in the dist folder. Use live-server to preview them.

```sh
npx live-server dist/docs
```

> You can find the sample project at <https://github.com/mark-magic/book-demo>.

## Local Build and Test

After the local build is complete, you can preview it locally.

```sh
npx mark-magic
npx live-server dist/docs
```

## Set Base Path for Deployment

By default, we assume that the site will be deployed at the root path of the domain `/`. If the site will be served on a subpath, e.g., <https://mywebsite.com/blog/>, then the `base` option of the `plugin-docs` plugin in _mark-magic.config.yaml_ needs to be set to `'/blog/'`.

Example: If using Github Pages and deploying to `user.github.io/repo/`, then set `base` to `/repo/`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: docs
    input:
      name: '@mark-magic/plugin-local' # Same as above
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs' # Same as above
      config:
        path: ./dist/docs/ # Output directory
        name: 'My First Book' # Name of the fiction
        base: /repo/
```

## Platform Guide

### GitHub Pages

1.  Create a `deploy.yml` file in the `.github/workflows` directory of your project with the following content.

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

    > Make sure the `base` configuration of the plugin-docs is set correctly, see [Setting a Common Base Path](#setting-a-common-base-path)

2.  In the **Pages** tab of your repository settings, select **Build and deployment > Source** and choose **GitHub Actions**.

3.  Push your modifications to GitHub and wait for the GitHub Actions workflow to complete. Your site should be deployed at `https://<username>.github.io/[repository]/` or `https://<custom-domain>/`, depending on your settings. Your website will be automatically deployed on the main branch every time you push changes.

## Next Steps

- For a better understanding of how it works, continue reading [the plugin](./plugin/index.md)
