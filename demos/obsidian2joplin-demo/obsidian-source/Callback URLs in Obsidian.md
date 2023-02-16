---
Author: Mike Schmitz
Tags: things, hook, dailynotes. productivity
---

One of the things I love about Obsidian is that it offers support for _callback URLs_. For example, you could include a link to a specific note inside of a task in _Things_ or a link to an email message from your Daily Notes in Obsidian.

In this article, I'll show you a couple of ways you can connect things in Obsidian to other apps.

## Linking to a Note in Obsidian

Each note in Obsidian has its own callback URL that you can use to access that note directly. To get to Obsidian URL, just right-click the note you want and select _Copy obsidian url_:

![](https://thesweetsetup.com/wp-content/uploads/2021/05/copyobsidianurl.jpg)

The URL is copied to your clipboard, and you can now paste that link in another application like Things. This allows you to manage the task (and all the associated metadata, like due date, project, etc.) in your task manager, and when it's time to write you just click the Obsidian URL in the task to go straight to the note in Obsidian.

![](https://thesweetsetup.com/wp-content/uploads/2021/05/thingsobsidianlink.jpg)

Here are the different components that make up this specific URL:

- `obsidian://open?` tells the operating system to access the Obsidian application and open a specific file.
- `vault=Notes` tells the Obsidian app which vault to look inside.
- `&file=Articles%2FObsidian%20vs.%20Roam%20Research` specifies the file path in the vault. _Articles_ is the folder, and _Obsidian vs. Roam Research_ is the file name. _%2F_ represents the slash in the directory path, and _%20_ represents the spaces in the file name.

This URL works on both macOS and iOS, provided that you have the Obsidian application installed and the vault names are the same. (Of course, the file must exist on your other device as well.)

## Linking to a Task from Your Daily Notes Page

Another thing you can do is take tasks from your task manager and put those URLs inside of Obsidian. For example, you can use Obsidian like a digital [Bullet Journal](https://thesweetsetup.com/mikes-hybrid-bullet-journal-system/) and link to the task you want to complete today in your Daily Notes.

_(In the above post, I was still using Roam Research. I've since switched to Obsidian, but the flow is still the same. If you're wondering which app is right for you, check out [[Obsidian vs. Roam Research]] for a comprehensive comparison.)_

First, you need to make sure that you have the Daily Notes core plugin enabled. To do this, click the _Settings_ icon in the lower-left and go to _Core Plugins_ section, then toggle on _Daily Notes_.

![](https://thesweetsetup.com/wp-content/uploads/2021/05/dailynoteson.jpg)

Now you can create a new Daily Note by clicking the calendar icon in the left sidebar.

Next, get the URL of the task you want to add to your Daily Notes page. In Things, you can do this by right-clicking on the task and selecting _Share &rarr; Copy Link_.

![](https://thesweetsetup.com/wp-content/uploads/2021/05/thingssharelink.jpg)

Now we can go back to our Daily Notes page and add this link. If we use the formatting `- [ ]` then Obsidian recognizes this text as a task and creates a clickable checkbox for the item. Here's what it looks like in split view, with Edit Mode on the left and Preview Mode on the right:

![](https://thesweetsetup.com/wp-content/uploads/2021/05/dailynotesurl.jpg)

There's a box with an arrow to the right of the link, telling us it's an external link and will take us out of Obsidian. But when we click on this link, we go straight to the task in Things.

## Grabbing URLs with Hook

On the Mac, there's another cool way to grab links to just about anything using an app called [Hook](https://hookproductivity.com/). For example, you can use Hook to grab a URL to a specific message in your email client. Here's how it works:

Using your Mac, open the window of the thing you want to link to and activate Hook. You can set a keyboard shortcut for this (mine is set to _Shift-Control-Option-Command-L_), and the Hook window will appear on top of the application window:

![](https://thesweetsetup.com/wp-content/uploads/2021/05/hooklink.jpg)

The second button from the left is the one to copy the link, so click that and the link to the message is copied to your clipboard. Now you can paste that URL in Obsidian, just like we did with the link to the task on our Daily Notes page:

![](https://thesweetsetup.com/wp-content/uploads/2021/05/hooklinkobsidian.jpg)

This is actually just the tip of the iceberg with Hook, though. Just like Obsidian creates bidirectional links between your notes, you can actually create bidirectional links between your files with Hook.
