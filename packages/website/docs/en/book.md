# Novel => Website + EPUB

## Prerequisites

1.  [Node.js](https://nodejs.org) LTS version installed
2.  [Git](https://git-scm.com/) latest version installed
3.  Terminal to access mark-magic through command line interface
4.  Text editor that supports markdown and YAML, recommended: [VSCode](https://code.visualstudio.com/)

## Initialize Novel Project

1.  Create an empty directory and initialize a package.json and a books directory to store the novel

    ```sh
    mkdir my-book && cd my-book
    npm init -y
    mkdir books
    ```

2.  Install dependencies

    ```sh
    npm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub live-server
    ```

## Configure Novel

Add a configuration file `mark-magic.config.yaml` and set the input to the local `books` directory and the output to `epub/docs`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # Input plugin to read from local directory
      config:
        path: ./books/ # Directory to read from
    output:
      name: '@mark-magic/plugin-epub' # Output plugin to generate epub file
      config:
        path: ./dist/my-book.epub # Path to generate the file
        id: my-book # Unique id for the novel
        title: My First Book # Name of the novel
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
        name: 'My First Book' # Name of the novel
```

## Start Writing

Start with the homepage of the novel by creating a `readme.md` file in the `books` directory.

```md
# Hello World
```

Continue writing more files, it is recommended to use prefixes like 01, 02, 03... for file names to maintain order.

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

After completion, you can find the generated epub file and the built HTML files in the `dist` directory. Use live-server to preview it.

```sh
npx live-server dist/docs
```

> You can find the sample project at <https://github.com/mark-magic/book-demo>.

## Local Build and Test

After the local build is completed, you can preview it locally.

```sh
npx mark-magic
npx live-server dist/docs
```

## Set Base Path

By default, we assume that the website will be deployed on the root path `/` of the domain. If the website will be served on a subpath like <https://mywebsite.com/blog/>, then you need to set the `base` option of the `plugin-docs` plugin in _mark-magic.config.yaml_ to `'/blog/'`.

For example, if you are using Github Pages and deploying to `user.github.io/repo/`, then set `base` to `/repo/`.

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
        name: 'My First Book' # Name of the novel
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

    > Make sure the `base` configuration of plugin-docs is correct, see [Setting Up a Base Path](#setting-up-a-base-path) for more information.

2.  In the repository settings, go to the **Pages** menu item and choose **GitHub Actions** under **Build and deployment > Source**.

3.  Push your changes to GitHub and wait for the GitHub Actions workflow to complete. Your site should be deployed at `https://<username>.github.io/[repository]/` or `https://<custom-domain>/` depending on your settings. Your site will be automatically deployed on each push to the main branch.

## Next Steps

- To learn more about how things work, continue reading the [Plugins](./plugin/index.md) section.
