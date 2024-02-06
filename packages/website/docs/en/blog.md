# Notes => Blog

## Prerequisites

> Below we will use [joplin](https://joplinapp.org/) as the note-taking tool, and [hexo](https://hexo.io/) as the blogging platform for illustration. However, both can be replaced, for example, the source of notes can be replaced with obsidian, and the output blog can be replaced with hugo.

1.  First, make sure that the joplin web clipper is already enabled.
    ![joplin-webclipper](./resources/joplin-webclipper.png)
2.  Furthermore, you need a hexo project. If you already have one, please refer to [Connecting Joplin to an existing Hexo blog](#connecting-joplin-to-an-existing-hexo-blog), otherwise proceed to the next step.

## Creating a hexo blog from scratch

If you don't have a hexo blog yet, you can directly use a template to reduce the configuration.

1.  Create a new project on GitHub using the template project [joplin-hexo-demo](https://github.com/mark-magic/joplin-hexo-demo), following the path **Use this template > Create a new repository**. If you don't have a GitHub account yet, please [sign up](https://github.com/signup).
2.  Use git to clone your project to your local machine via the command line `git clone https://github.com/<username>/<repo>.git`
3.  Modify the `baseUrl` and `token` values in the mark-magic.config.yaml configuration file to match the values set in joplin.
4.  Add the `blog` tag to the notes you wish to publish in joplin.
5.  Run the command `npx mark-magic && npx hexo server`, then open <http://localhost:4000/joplin-hexo-demo/> to see your notes.
    ![joplin-blog-demo](./resources/joplin-blog-demo.png)
6.  Now modify the value of `root` in the \_config.yml configuration file to be the name of your cloned github `<repo>`.
7.  Under the **Pages** menu item in the repository settings on GitHub, select **Build and deployment > Source**, then choose **GitHub Actions**.
8.  Finally, run `npm run commit` to push all the notes you want to publish.

Wait for GitHub Actions to complete, you can check the progress at `https://github.com/<username>/<repo>/actions`.

Once everything is done, your site should be deployed at either `https://<username>.github.io/<repo>/` or `https://<custom-domain>/`, depending on your settings.

> You can find the sample project at <https://github.com/mark-magic/joplin-hexo-demo>.

## Connecting Joplin to an existing Hexo blog

1.  Install dependencies `npm i -D @mark-magic/cli @mark-magic/plugin-joplin @mark-magic/plugin-hexo`

2.  Add configuration `mark-magic.config.yaml`

    ```yaml
    # mark-magic.config.yaml
    tasks:
      - name: blog
        input:
          name: '@mark-magic/plugin-joplin' # Input plugin to read data from Joplin notes
          config:
            baseUrl: 'http://localhost:27583' # The address of the Joplin web clipper service, usually http://localhost:41184, here we use the development-time http://localhost:27583 for demonstration purposes
            token: '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31' # The token of the Joplin web clipper service
            tag: blog # Filter notes based on tag
        output:
          name: '@mark-magic/plugin-hexo' # Output plugin to generate files required by Hexo
          config:
            path: './' # The root directory of the hexo project
            base: /joplin-hexo-demo/ # The baseUrl when deployed, defaults to the root path of the domain, should match the root configuration in hexo _config.yml
    ```

3.  Modify the hexo configuration `_config.yml`, if it contains

    ```yaml
    permalink: /p/:abbrlink/
    ```

4.  Read notes from Joplin and generate the files required by hexo blog

    ```sh
    npx mark-magic # This will empty the source/_posts and source/resources directories, so please backup any important files
    ```

After that, you can see the generated files in the `source/_posts` and `source/resources` directories, and now you can continue with hexo build and publish.
