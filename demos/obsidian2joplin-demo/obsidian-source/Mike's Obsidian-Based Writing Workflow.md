---
Author: Mike Schmitz
Tags: plugins, kanban, writing
---

I've been using Obsidian as my writing app for the past several months, and I absolutely love it. In addition to giving me a great Markdown writing environment, the community plugins allow me to craft my ideal system for tracking my writing tasks well. In this article, I walk through my system and the plugins I use to manage writing projects in Obsidian.

Here's a video from our upcoming PKM & Obsidian course that walks through my entire process.

VIDEO

There are two specific plugins that make this work for me:

1. The Kanban plugin
2. The Dataview plugin

_(For more info on using the Dataview plugin, see [[YAML & Dataview]].)_

## The Kanban Plugin

To install the kanban plugin, first click on the _Settings_ button in the left sidebar.

IMG

Next, click on _Community Plugins_ and search for _Kanban_.

IMG

Click the _Install_ button, then click enable. Make sure that the plugin is toggled on by going back to the _Community Plugins_ section in the settings.

IMG

Next, you need to create your kanban board. To create a new Kanban board view, all you need to do is right-click in a folder and then select _New Kanban board_.

IMG

Once you have the board set up, you need to add some categories. Click the _Add a list_ button to create a new swim lane and give it a name.

I use three separate lists: _ToDo_, _Doing_, and _Done_. I also toggle on the option to _Mark items in this list as complete_ for the _Done_ column.

IMG

Next I add cards for the articles I'm working on. Click _Add a card_ to create a new todo in that column, and give the card a name. I always create the blank note first in my _Articles_ folder and link to the note using double brackets.

IMG

Then I can move the card from left to right by dragging it to the appropriate column. And behind it all is a simple Markdown-formatted text file.

IMG

## Dataview

I also add some YAML metadata to the top of every article which includes the status and document tags. I'm playing around with different ways to use the status currently, but one thing I like is the ability to use a status and filter everything in my _Articles_ folder by that staus using the _Dataview_ plugin.

Just like the Kanban plugin, Dataview is a third-party plugin. So click the _Settings_ buttone, go to _Community Plugins_, and serach for _Dataview_.

IMG

Install and enable the plugin, and you're ready to go.

For example, I have a note in my library called _Articles Status_. It's a blank note that filters all the notes in my _Articles_ and displays them in a list view by status in the YAML metadata.

Here's the code I use:

```dataview
table Status
from "Articles"
```

Here's what this code is doing:

- The first line tells Obsidian to use the Dataview plugin
- The second line tells it to make a table with a _Status_ column
- The third line tells it to look in the _Articles_ folder
- The last line closes the code block

When I click on _Preview_, here's what it looks like:

IMG

I have the names of all of the articles that are currently in my articles folder on the left, which are links that I can use to jump straight to those articles. And I have the status fields, indicated by those things that I marked in the YAML frontmatter, which aren't actually part of the article. But Dataview is taking those and it is sorting them in reverse alphabetical order, which allows me to see very quickly which articles I've completed, which ones I've not started and which ones are in progress. And if I wanted, I could add more to this to sort these in a specific order.

This is a simple example, and you can extend this obviously a lot further if you wanted to include due dates and things like that. But Dataview is a great way to query everything that you want to look at in a specific location, and then give you all sorts of information based on that.
