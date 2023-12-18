# Notes => Blog

> [Prerequisites](./book.md#prerequisites)

## Requirements

> The following instructions will use [joplin](https://joplinapp.org/) as a note-taking tool and [hexo](https://hexo.io/) as a blogging platform. It is assumed that the reader is already familiar with both tools.

1.  First, make sure that the web clipper service is enabled in Joplin. You can refer to the [Joplin web clipper service documentation](https://joplinapp.org/help/apps/clipper/) for instructions on how to enable it.
2.  Next, you need a hexo project. If you already have one, you can proceed with the following steps in that directory. Otherwise, create a new hexo project.

## Create a new hexo project

Follow the instructions in the [official documentation](https://hexo.io/docs/setup) to initialize a simple hexo project.

```sh
npm i -g hexo-cli
hexo init <folder>
cd <folder>
npm install
```

## Connect Joplin

1.  Install the required dependencies: `npm i -D @mark-magic/cli @mark-magic/plugin-joplin @mark-magic/plugin-hexo`

2.  Add the configuration file `mark-magic.config.yaml`

    ```yaml
    # mark-magic.config.yaml
    tasks:
      - name: blog
        input:
          name: '@mark-magic/plugin-joplin' # Input plugin to retrieve data from Joplin notes
          config:
            baseUrl: 'http://localhost:27583' # The address of Joplin web clipper service, usually http://localhost:41184. In this example, we use the development address http://localhost:27583
            token: '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31' # The token for Joplin web clipper service
            tag: blog # Filter notes based on this tag
        output:
          name: '@mark-magic/plugin-hexo' # Output plugin to generate files for hexo
          config:
            path: './' # The root directory of the hexo project
            base: /joplin-hexo-demo/ # The base URL for deployment. By default, it deploys to the root path of the domain. Make sure it matches the 'root' configuration in hexo _config.yml
    ```

3.  Modify the hexo configuration file `_config.yml` (if it exists) to include the following:

    ```yaml
    permalink: :abbrlink/
    ```

4.  Modify the .gitignore file to ignore the auto-generated `source/_posts` and `source/resources` directories:

    ```txt
    source/_posts
    source/resources
    ```

5.  Retrieve notes from Joplin and generate the required files for the hexo blog:

    ```sh
    npx mark-magic
    ```

After completing these steps, you should see the generated files in the `source/_posts` and `source/resources` directories. You can proceed to build and publish your hexo blog.

## Build and publish the hexo blog

Start by previewing the blog locally:

```sh
npm run server
```

Then, you can build and publish the blog to GitHub Pages:

```sh
npm i -D gh-pages # Install the required dependency
npm run build # Generate the static files
npx gh-pages -d public --dotfiles # Publish to GitHub Pages
```

Wait for GitHub Actions to complete the process. You can check the progress at `https://github.com/<username>/[repo]/actions`.

Once everything is done, your site should be deployed at `https://<username>.github.io/<repo>/` or `https://<custom-domain>/`, depending on your configuration.

> You can find a sample project at <https://github.com/mark-magic/joplin-hexo-demo>.
