---
Author: Mike Schmitz
Tags: plugins, kanban, calendar, todoist, journaling, dailynotes, setup
---

Obsidian is a phenomenal notes app, but with a few free community plugins installed, it can become pretty much whatever you want it to be. In this article, we're going to show you how to install community plugins if you're not familiar with the process and share some of our favorites.

## How to Install Plugins in Obsidian

There are two kinds of plugins in Obsidian:

- _Core plugins_ that ship with the app
- _Community plugins_ developed by others

The community plugins are where a lot of the magic happens.

To access the plugins, click on the _Settings_ button in the left sidebar. Click on _Community plugins_, and toggle off Safe Mode. Then click on _Browse_ and you'll be taken to the Community plugin directory:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/directory.jpg)

To install a plugin:

1. Click the plugin you want to install from the list on the left
2. Click the _Install_ button
3. Click the _Enable_ button

Your plugin is now installed and ready to be used.

You can also toggle individual plugins on and off once they are installed at the bottom of the _Settings--> Community plugins_ screen.

![](https://thesweetsetup.com/wp-content/uploads/2021/06/pluginsactive.jpg)

Now that you know how to install community plugins, let's look at some of our favorites.

## A Few of Our Favorite Plugins

Out of all the plugins we've tried, these are the ones we consider to be the best of the bunch. Keep in mind that these plugins are being updated and new ones are being added all the time, so you may want to check the directory frequently to see what's new.

### Kanban

I use the [Kanban plugin](https://github.com/mgmeyers/obsidian-kanban) to track all of my writing projects, and link to the individual cards for each article that I'm currently writing. You can even link the cards in the plugin as tasks to your Daily Notes using a date-picker. Here's what it looks like:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/kanban1.jpg)

This screenshot doesn't really do the plugin justice as ever card is draggable between the different swim lanes. There's even a setting for automatically marking the task as complete when dragging it to the _Done_ column. But behind all the functionality this plugin gives you, the file itself is still just a basic Markdown-formatted text file:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/kanban2.jpg)

This is my favorite plugin, hands down. I can't recommend it enough. And if you want to read more about how I use it, check out [[Mike's Obsidian-Based Writing Workflow]].

### Calendar

The Calendar plugin is currently the most popular plugin in the Obsidian directory, and with good reason. It gives you an easy way to jump between dates for your Daily Notes by giving you a clickable calendar view in your sidebar.

![](https://thesweetsetup.com/wp-content/uploads/2021/06/calendar.jpg)

To jump to a specific date, just click on it in the calendar view. If the date doesn't exist yet, it will prompt you to create a new Daily Note in the appropriate location. Dots appear under each day to indicate the amount of text in the note and whether there are any unfinished tasks linked to that date.

If you're going to use Daily Notes in Obsidian, you need the Calendar plugin. It's that simple.

### Review

Speaking of Daily Notes, the [Review plugin](https://github.com/ryanjamurphy/review-obsidian) can help you remember to review notes on specific days. You do this by activating the Command Palette (Command-P) and selecting **Review: Add this note to a daily note for review** from the desired note. This creates a second-level header at the bottom of the Daily Note for the desired date and adds a link back to the original note:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/review.jpg)

This plugin uses natural language to determine the next review (i.e. "Next Friday"), so it also requires a separate [Natural Language Dates plugin](https://github.com/argenos/nldates-obsidian). Just be aware it may not quite work exactly as expected until you install and activate both of these plugins.

For those interested in the concept of spaced repetition, this one is essential.

### Vantage

Queries are a bit of a hidden power user feature in Obsidian, but they don't have to be. With the [Vantage plugin](https://github.com/ryanjamurphy/vantage-obsidian), you can construct powerful search queries without needing to know all of the syntax Just active Vantage from the Command Palette (Command-P) and select **Vantage - advanced search builder: Build a new search**.

![](https://thesweetsetup.com/wp-content/uploads/2021/06/vantage.jpg)

Here's the code that creating an embedded search based on the screenshot above adds to the current note:

```query
file:(2021-06-10 OR 2021-06-11 OR 2021-06-12 OR 2021-06-13 OR 2021-06-14 OR 2021-06-15 OR 2021-06-16 OR 2021-06-17 OR 2021-06-18) path:(PKM Course)  (line:(/- \[ \].*record.*/)) ((/- [^[.]].*\[\[.*Vantage.*\]\].*/))
```

But the beautiful part about all of this is that _you don't need to understand any of that code._ You can build you queries in Vantage and the plugin translates everything for you.

### Note Refactor

In the [Zero-to-Obsidian workshop](https://thesweetsetup.com/obsidian/), I explained the importance of what I call _atomic notes_. The basic idea is to break your notes apart into smaller chunks in order to make the most out of the bidirectional links in Obsidian. So for example, in the screenshot below I have the Atomic Habits note open on the right, and a separate note that I broke out as it's own note (The 4 Laws of Behavior Change) on the left:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/noterefactor.jpg)

Notice the link on the Atomic Habits page to the 4 Laws page. That's important.

What the [Note Refactor plugin](https://github.com/lynchjames/note-refactor-obsidian) does is take a selection of text and break it out as it's own note while simultaneously putting a link into the original note that points to the new one. This makes a bidirectional link between the two notes and is visible in the local graph in the upper-right.

There's lots of different formatting options you can use with this, but it's an essential tool for build a library of atomic notes.

_Update: You can now do this using a Core plugin that you can read about in [[Splitting Notes in Obsidian]]. But Note Refactor is still the power user tool of choice._

### Better Word Count

Obsidian ships with a core plugin for word count, but the [Better Word Count plugin](https://github.com/lukeleppan/better-word-count) is, well, _better_. It gives you options to toggle on or off the number of words, characters, and sentences, lets you customize the descriptors for each, and lets you count from a selection as well as the entire document.

![](https://thesweetsetup.com/wp-content/uploads/2021/06/betterwordcount.jpg)

It's pretty simple as far as plugins go, but it makes Obsidian an even better writing tool. If you want to know more, check out [[Turning Obsidian into the Perfect Writing App]].

### Todoist

The [Todoist plugin](https://github.com/jamiebrynes7/obsidian-todoist-plugin) allows you to embed interactive Todoist tasks into an Obsidian note. The syntax for this plugin is based on Todoist's powerful web filters, which allows you to embed tasks that meet certain criteria. For example, here's a simple query for the book publishing checklist I have in Todoist embedded in Obsidian:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/todoist.jpg)

On the left is the actual code written in Edit Mode, and on the right is the interactive rendering of the Todoist tasks in Preview Mode. As you can see, the task names, projects, and even swim lanes are displayed in Obsidian. The colors come over from Todoist's priority levels, and each task is interactive so I can check the circle and mark it off as complete in Todoist.

This is a great plugin for anyone who keeps tasks in Todoist but wants a way to visualize those tasks alongside project information inside of Obsidian. If you want to see it in action, check out [[Syncing and Embedding Tasks with Todoist]].

### Tracker

The [Tracker Plugin](https://github.com/pyrochlore/obsidian-tracker) is the heart and soul of my [[Daily Questions in Obsidian]] journaling workflow. What it does is take values (in my case, numeric values associated with specific tags) and plots them on a graph. Here's a side-by-side screenshot of the code snippets in Edit Mode and what it looks like rendered in Preview Mode:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/tracker.jpg)

My use case is pretty basic: I assign values daily to the tags on a scale of 1-10 using my Daily Notes for journaling, then Tracker collects all of those and plots them on individual graphs by tag. But there's a lot more you can do with with the Tracker plugin if you're willing to devote a little bit of time to figure out how to make it work.

### Dataview

Another great plugin for visualizing data is the [Dataview plugin](https://github.com/blacksmithgu/obsidian-dataview), which turns your Obsidian vault into a database with powerful query tools. For example, I have a note for every episode of the [Bookworm podcast](https://bookworm.fm/) I've recorded. Using YAML at the top of the document, I can apply individual values for both my rating and Joe's rating (my co-host) for the book that we covered. Then using Dataview, I can tabulate all those ratings and sort in a desired order. Here's a screenshot of the Dataview code in Edit Mode (which includes every note in the _Bookworm_ folder and sorts them in descending order based on my rating) and the visualization of that code in Preview Mode:

![](https://thesweetsetup.com/wp-content/uploads/2021/06/dataview.jpg)

I walk through the whole process in setting this up in [[YAML & Dataview]].

There's lots of other stuff you can do with this plugin. See [this thread in the Obsidian forum](https://forum.obsidian.md/t/dataview-plugin-snippet-showcase/13673) for more inspiration.

### Obsidian Git

**WARNING! This one is super-nerdy.**

[Obsidian Git](https://github.com/denolehov/obsidian-git) is basically a backup plugin for Obsidian, but instead of creating a local backup of all your files it sends all your changes to a GitHub repository. In addition to a backup, this also gives you a sort of version control for your Obsidian vault. You can set it up backup automatically, or use a keyboard shortcut to manually trigger a push/pull.

I learned the hard way that getting up Git on your Mac can be tricky. I don't really use Git much, so I enlisted the help of a friend who really understands this stuff. But if you're feeling adventurous, [here's a pretty good guide to getting started](https://medium.com/analytics-vidhya/how-i-put-my-mind-under-version-control-24caea37b8a5).
