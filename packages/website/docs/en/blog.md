# Notes => Blog

> [Prerequisites](./book.md#prerequisites)

## Requirements

> In the following instructions, we will be using [joplin](https://joplinapp.org/) as the note-taking tool and [hexo](https://hexo.io/) as the blogging platform. However, both of these can be replaced. For example, you can use Obsidian as the source for your notes and Hugo as the platform for your blog.

1.  First, make sure that the web clipper is enabled in Joplin.
    ![joplin-webclipper](./resources/joplin-webclipper.png)
2.  Next, you will need a hexo project. If you already have one, please refer to [Connecting Joplin to an Existing Hexo Blog](#connecting-joplin-to-an-existing-hexo-blog). Otherwise, continue to the next step.

## Creating a Hexo Blog from Scratch

If you don't have a hexo blog yet, you can create one using a template to reduce configuration.

1.  Create a new project on GitHub using the template project [joplin-hexo-demo](https://github.com/mark-magic/joplin-hexo-demo). Follow the path **Use this template > Create a new repository**. If you don't have a GitHub account, please [sign up](https://github.com/signup) for one.
2.  Clone your project to your local machine using git `git clone https://github.com/<username>/<repo>.git`
3.  Modify the `baseUrl` and `token` in the mark-magic.config.yaml configuration file to match the values in your Joplin settings.
4.  Add the `blog` tag to the notes in Joplin that you want to publish.
5.  Run the command `npx mark-magic && npx hexo server`. Open <http://localhost:4000/joplin-hexo-demo/> and you should be able to see your notes.
    ![joplin-blog-demo](./resources/joplin-blog-demo.png)
6.  Now, modify the value of `root` in the \_config.yml configuration file to match the name of your cloned GitHub `<repo>`.
7.  In the **Pages** section of your GitHub repository settings, under **Build and deployment > Source**, select **GitHub Actions**.
8.  Finally, run `npm run commit` to push all the content you want to publish.

Wait for GitHub Actions to complete. You can check the progress at `https://github.com/<username>/<repo>/actions`.

Once everything is done, your site should be deployed at `https://<username>.github.io/<repo>/` or `https://<custom-domain>/`, depending on your settings.

> You can find the sample project at <https://github.com/mark-magic/joplin-hexo-demo>.

## Connecting Joplin to an Existing Hexo Blog

1.  Install the dependencies `npm i -D @mark-magic/cli @mark-magic/plugin-joplin @mark-magic/plugin-hexo`.

2.  Add the configuration to `mark-magic.config.yaml`.

    ```yaml
    # mark-magic.config.yaml
    tasks:
      - name: blog
        input:
          name: '@mark-magic/plugin-joplin' # Input plugin to read data from Joplin notes
          config:
            baseUrl: 'http://localhost:27583' # The address of the Joplin web clipper service, usually http://localhost:41184. Here, we are using the development address http://localhost:27583 for demonstration purposes.
            token: '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31' # The token for the Joplin web clipper service
            tag: blog # Filter the notes based on a tag
        output:
          name: '@mark-magic/plugin-hexo' # Output plugin to generate the files required by Hexo
          config:
            path: './' # The root directory of the Hexo project
            base: /joplin-hexo-demo/ # The baseUrl when deployed. By default, it is deployed at the root path of the domain. It should match the `root` configuration in the hexo _config.yml file.
    ```

3.  Modify the hexo configuration in `_config.yml`, if it contains

    ```yaml
    permalink: /p/:abbrlink/
    ```

4.  Read the notes from Joplin and generate the files required by Hexo Blog.

    ```sh
    npx mark-magic # This will clear the source/_posts and source/resources directories. Make sure to backup any files you need.
    ```

After completion, you should see the generated files in the `source/_posts` and `source/resources` directories. You can now continue building and publishing with Hexo.
