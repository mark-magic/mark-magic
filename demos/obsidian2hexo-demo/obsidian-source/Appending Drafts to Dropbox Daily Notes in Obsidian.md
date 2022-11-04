---
Author: Mike Schmitz
Tags: drafts, dropbox, dailynotes, setup
---

[Drafts](https://getdrafts.com/) has long been the place that text starts on my iOS device. But lately I've been doing a lot more in [Obsidian](https://obsidian.md/), and was looking for a way to get that text into Obsidian easily when I was done. While this is pretty straightforward using a cloud service like Dropbox to sync your vault, I then began wondering if I could do something more than just dump my text files in a synced folder.

Turns out you can.

## Why Append to Daily Notes?

If you're not familiar with the concept of _Daily Notes_, it's basically a feature you can enable that creates a new note for each day you open the Obsidian app. I previously shared [a video](https://thesweetsetup.com/journaling-using-daily-questions-in-obsidian) showing how I use this page for my daily journaling, but I know many people like to use these Daily Notes pages as the place to capture tasks, ideas, meeting notes, and the like. Backlinks make it easy to tie these notes to other related notes, so this is actually a pretty great workflow.

The problem is on iOS.

While Obsidian does have iOS apps that are currently in private beta, they're not ideal for capturing for several reasons:

1. Your vault needs to load when you open the app (takes several seconds)
2. You have to navigate to the right note
3. You have to navigate to the right spot in the note
4. _THEN_ you can capture your text.

That's too much friction for me. With Drafts, I can just open the app and start typing. And once I set up a Drafts export action to append the text to my Daily Note in Obsidian, I can simply tap a button and be done.

_(BTW, if you want more info on Obsidian for iOS, check out [[Using Obsidian on iOS]].)_

## Setting Up Obsidian

Before this will work correctly, you need to make sure Obsidian is set up correctly. There's a couple steps to this:

1. You need to make sure your vault (folder containing all the text files Obsidian looks at) is synced to the cloud. Theoretically you can use any cloud service, but I prefer Dropbox for this.
2. You need to make sure that _Daily Notes_ are enabled (you can toggle this on by going to _Settings --> Core Plugins --> Daily Notes_).
3. You need to make sure that the Daily Notes settings are using the _YYYY-MM-DD_ format (this is what Drafts uses in it's date token).
4. You need the folder for the _New File Location_ (this is where we'll tell Drafts to look for the files). Note that this is a usually a subfolder inside your main vault folder.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidian1.jpg)

Once you have these settings, we can go set things up in Drafts.

## Setting Up the Drafts Action

The export action is actually pretty simple, but requires some formatting. Here's how to set it up.

First, open the Drafts export actions and tap the **+** button to create a new action, then select _New Action_ (we're going to build this one from scratch).

![](https://thesweetsetup.com/wp-content/uploads/2021/04/drafts1.jpg)

Next, name the action and change the color and icon if you want to.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/drafts2.jpg)

Tap on _Steps_ and select the _Dropbox_ step under _Services_.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/drafts3.jpg)

Now you need to configure this step correctly. Here's the settings you want to use:

1. The _Name_ should be `[[date]].md`. The `[[date]]` is the Drafts date token, and .md is the file extension that Obsidian uses by default. This tells Drafts to look for the file `YYYY-MM-DD.md` as the target for our text.
2. The _Path_ must be set to your Daily Notes folder, relative to your Dropbox folder. For example, my Obsidian vault is located at /Users/XXXXXX/Dropbox/Notes/Daily Notes, so the path I use here is `/Notes/Daily Notes/`.
3. The _Template_ is what text will be sent. By default, the `[[draft]]` token will grab the entire text in Drafts and send it to the file.
4. The _Write Type_ should be set to _append_. This will place the text at the end of the Daily Note. If you prefer it appear at the beginning, you can use _prepend_ instead.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/drafts4.jpg)

That's it! Now tap _Save & Exit_, and you're ready to use your new export action.

## Sending Text from Drafts to Obsidian

Now you can type your text and send it to Obsidian. You can tap the Drafts icon in the upper-right and select your action, or use just tap the name of the action in the bar above the keyboard.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/drafts5.jpg)

Whatever text you type will be appended to the file in Dropbox and instantly show up in Obsidian.

One cool thing about this is that both Drafts and Obsidian can do special things on top of plain text. For example, if you want to send a task from Drafts to Obsidian, you could do that by using the plain text task formatting: a dash, followed by a space, then left and right brackets with a space in-between. Then when the text appears in Obsidian, you can switch to _Preview Mode_ to interact with the task element and check it off. Here's a screenshot of Edit Mode and Preview Mode side-by-side using the default Obsidian theme:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidian2.jpg)

## Bonus Nerdery

If you go back and edit the Drafts action, you can find a couple of other cool options if you scroll down a bit:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/drafts6.jpg)

For example:

- You can assign this action to an external keyboard shortcut
- You can add the action to Siri
- You can automatically archive or delete the text in Drafts once the action has been completed.

I usually don't assign keyboard shortcuts because I'm primarily using Drafts on my iPhone, but I do like to automatically archive the text after it's been sent to Obsidian. This helps me keep my Drafts inbox a little more tidy.
