# Deployment

The following guide explains how to publish the dist/docs directory after building it with plugin-docs.

## Local Build and Testing

After the local build is completed, you can preview it locally.

```sh
npx mark-magic
npx live-server dist/docs
```

## Setting the Public Base Path

By default, we assume that the site will be deployed on the root path of the domain `/`. If the site will be served on a subpath, such as <https://mywebsite.com/blog/>, you need to set the `base` option of the `plugin-docs` plugin in _mark-magic.config.yaml_ to `'/blog/'`.

Example: If you are using GitHub Pages and deploying to `user.github.io/repo/`, then set `base` to `/repo/`.

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
        name: 'My First Book' # Name of the book
        base: /repo/
```

## Platform Guides

### GitHub Pages

1.  Create a `deploy.yml` file in the `.github/workflows` directory of your project with the following content:

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

    > Make sure the `base` configuration of plugin-docs is correct, see [Setting the Public Base Path](#setting-the-public-base-path).

2.  In the repository settings, go to the **Pages** menu and select **Build and deployment > Source > GitHub Actions**.

3.  Push the modifications to GitHub and wait for the GitHub Actions workflow to complete. Your website should be deployed at `https://<username>.github.io/[repository]/` or `https://<custom-domain>/`, depending on your setup. The site will be automatically deployed on the main branch for each push.
