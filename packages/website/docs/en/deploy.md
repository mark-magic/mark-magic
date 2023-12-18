# Deployment

The following guide mainly provides instructions on how to publish the `dist/docs` directory after building it with `plugin-docs`.

## Local Build and Testing

After completing the local build, you can preview it locally.

```sh
npx mark-magic
npx live-server dist/docs
```

## Set Public Base Path

By default, we assume that the site will be deployed on the root path of the domain `/`. If the site will be served on a subpath like <https://mywebsite.com/blog/>, you need to set the `base` option of the `plugin-docs` plugin in the _mark-magic.config.yaml_ file to `'/blog/'`.

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

1.  Create a `deploy.yml` in the `.github/workflows` directory of your project with the following contents.

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
            with:
              version: 8
          - name: Setup Node
            uses: actions/setup-node@v3
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

    > Make sure the `base` configuration of `plugin-docs` is correct, refer to [Set Public Base Path](#set-public-base-path)

2.  In the **Pages** menu item under the repository settings, select **Build and deployment > Source** and choose **GitHub Actions**.

3.  Push the changes to GitHub and wait for the GitHub Actions workflow to complete. You should be able to see the site deployed at `https://<username>.github.io/[repository]/` or `https://<custom-domain>/`, depending on your setup. Your site will be automatically deployed on the main branch on every push.
