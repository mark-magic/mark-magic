---
Author: Mike Schmitz
Tags: meetings, templates, tasks, productivity
---

Obsidian is a great place to keep meeting notes. But there are a couple of best practices, which can make your meeting notes more effective. In this article, we walk you through setting up a meeting notes template and how to use it in Obsidian.

## Setting Up the Meeting Notes Template

Creating a template makes it much easier to take meeting notes. This template is simply a note in my Obsidian vault. Here's the meeting notes template I use:

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes1.jpg)

This template has 4 sections:

- A date token at the top
- An _Attendees_ section
- An _Agenda_ section
- An _Action items_ section

Each section is separated as a second-level header, except for the metadata at the top.

The date token in the curly brackets tells Obsidian to insert a date stamp using the YYYY-MM-DD format, and the double brackets link that date to the daily note for the day.

Once you have your template file the way you want it, the next step is to set up the Templates plugin.

## Setting Up the Templates Plugin

First, click on the _Settings_ button in the left sidebar.

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes2.jpg)

Select _Core Plugins_, and make sure _Templates_ is toggled on.

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes3.jpg)

Next, go to the setting for the Templates plugin and make sure that it is pointing at the folder where you have your Meeting Notes template stored.

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes4.jpg)

Once you have the plugin enabled and pointing at your templates directory, we're ready to use the template we created.

## Using the Template

To use the template, you first need to create a new blank note. Give your note a title, and then hit _Command-P_ to access the Command Palette. From the Command Palette. select the _Template: Insert template_ option.

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes5.jpg)

If you pointed the Templates plugin at the right folder, you should see all the files in that folder appear as template options.

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes6.jpg)

Select your meeting notes template and hit _Enter._ The empty note populates with the contents of your template file. The date token is converted to today's date, and each of your sections is created.

## Meeting Notes Tips

I like to link the attendees to the meeting notes by including their names in the _Attendees_ section in double-brackets. This links the meeting notes file and the person via the Local Graph.

I also use double brackets to create internal links to important agenda items. For example, if we're talking about a project, I'll use double brackets to link to the project name.

You can also use Obsidian's Markdown-based task syntax to track action items. Just use a `- [ ]` before the task name and it will render as a clickable box in Preview mode.

![](https://thesweetsetup.com/wp-content/uploads/2021/07/meetingnotes7.jpg)

You can also link those tasks to a specific person or date by adding either inside of double brackets as well.
