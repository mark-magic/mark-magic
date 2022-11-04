---
Author: Mike Schmitz
Tags: plugins, metadata, productivity
---

Dataview is an incredibly powerful plugin that allows you to filter data in your obsidian vault in a lot of really cool ways. In this post, I'm going to show you how I use it to create a table of book ratings from YAML metadata.

Dont' worry, it's not as complicated as it sounds. Here's a post that walks you through the whole process.

## How Dataview works

The best way to explain the [Dataview plugin](https://github.com/blacksmithgu/obsidian-dataview) is to show an example. One of the ways I use it is to create a table of all of the ratings from the [Bookworm podcast](https://bookworm.fm/) that I do with [Joe Buhlig](https://thesweetsetup.com/how-joe-buhligs-shabbat-helps-him-stay-intentional/). We read a book every two weeks, we talk about what we got out of it, and we give the book a rating. And using Dataview, I can compile all of the ratings into a table.

So to start, I have a note in my Obsidian Vault for every single episode of bookworm. To add the rating, I simply add the YAML frontmatter metadata in Edit Mode like so:

```
---
(your YAML text)
---
```

Here's what it looks like side-by-side in Edit Mode and Preview Mode:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/dataview1.jpg)

In this particular example, I have a 3 pieces of metadata:

1. The tag _bookworm_
2. Joe's Rating (4.0)
3. My rating (4.0)

(In the podcast, we rate books from one to five stars, similar to the Amazon ratings. So this particular book, Joe gave it a 4 stars, and I gave it a 4 stars.)

Now from this point, we're going to create a new note and use the Dataview plugin to create a table of all of these ratings in the new note. So the first thing we need to do is to install the Dataview plugin.

To install the plugin, click the Gear to access the Settings:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/dataview2.jpg)

Then go to _Community Plugins_ and click _Browse_:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/dataview3.jpg)

Search the Dataview plugin. Once you find it, click _Install_ and then _Enable_.

![](https://thesweetsetup.com/wp-content/uploads/2021/06/dataview4.jpg)

Note that in the plugin description, they give you a lot of other examples on how you might want to use this.

Now we can close the Settings and go back to our new note, _Bookworm Ratings_, and add the following code:

```dataview
table Joe, Mike
from "Bookworm"
sort Mike desc
```

The three backticks are the Obsidian formatting for code snippets, and everything inside is telling the Dataview plugin what to do. Here's a description of what's going on here:

- `dataview` tells Obsidian to use the Dataview plugin
- table Joe, Mike tells Dataview to create a table with values from Joe & Mike from the YAML section of the desired files
- from "Bookworm" tell Dataview to include all files from the _Bookworm_ folder
- sort Mike desc says to sort everything in descending order by the values in the Mike column

That's all we have to do. Now when we click the Preview button, Dataview will render a table of ratings based on the values in the YAML metadata. Here's a side-by-side screenshot of the code in Edit Mode and the table in Preview Mode:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/dataview5.jpg)

But this is just one example of how you might use this incredible plugin. There are lots of other great examples over at the [Obdisian forum](https://forum.obsidian.md/t/dataview-plugin-snippet-showcase/13673) if you need some additional inspiration.

_(If you want more plugin recommendations, check out [[A Few of Our Favorite Obsidian Plugins]])._
