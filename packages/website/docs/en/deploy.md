# Deployment

The following guide mainly explains how to publish the `dist/docs` directory after building it with plugin-docs.

## Build and Test Locally

After the local build is completed, you can preview it locally.

```sh
npx mark-magic
npx live-server dist/docs
```

## Set the Base Path

By default, we assume that the site will be deployed at the root path (`/`) of the domain. If the site is going to be served on a subpath, such as <https://mywebsite.com/blog/>, you need to set the `base` option of the `plugin-docs` plugin in the _mark-magic.config.yaml_ file to `'/blog/'`.

Example: If you use GitHub Pages and deploy to `user.github.io/repo/`, then set `base` to `/repo/`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: docs
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs'
      config:
        path: ./dist/docs/
        name: 'My First Book'
        base: /repo/
```

## Platform Guides

### GitHub Pages

1.  Create a `deploy.yml` file in the `.github/workflows` directory of your project with the following content.

    ```yml
    name: Deploy site to Pages

    on:
      push:
        branches: [main]

      workflow_dispatch:

    permissions:
      contents: read
      pages: write
      id-token: write

    concurrency:
      group: pages
      cancel-in-progress: false

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v3
            with:
              fetch-depth: 0
          - uses: pnpm/action-setup@v2
          - uses: actions/setup-node@v3
            with:
              node-version: 20
              cache: pnpm
          - name: Setup Pages
            uses: actions/configure-pages@v3
          - name: Install dependencies
            run: pnpm i
          - name: Build
            run: |
              pnpm mark-magic
              touch dist/docs/.nojekyll
          - name: Upload artifact
            uses: actions/upload-pages-artifact@v2
            with:
              path: dist/docs

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

    > Make sure the `base` configuration of the plugin-docs is correct, see [Set the Base Path](#set-the-base-path) for reference.

2.  In the **Pages** section of your repository's settings, select **Build and deployment > Source > GitHub Actions**.

3.  Push the changes to GitHub and wait for the GitHub Actions workflow to complete. You should be able to see the site deployed at `https://<username>.github.io/[repository]/` or `https://<custom-domain>/` depending on your setup. Your website will be automatically deployed on the main branch every time you push changes.
